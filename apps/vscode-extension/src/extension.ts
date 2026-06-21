import * as vscode from "vscode";

const VIEW_ID = "agentix.home";
const PANEL_VIEW_ID = "agentix.panelHome";

/** Messages sent from the webview to the extension host. */
type InboundMessage =
  | { type: "ready" }
  | { type: "submit"; prompt: string; model: string }
  | { type: "modelChanged"; model: string }
  | { type: "approve" }
  | { type: "newChat" }
  | { type: "action"; action: "attach" | "code" | "image" };

/**
 * Drives a single Agentix OS webview (the hero prompt home screen).
 *
 * The same controller backs both the activity-bar view and the side-panel,
 * so the experience is identical wherever the user docks it.
 */
class AgentixController {
  constructor(private readonly webview: vscode.Webview) {
    webview.onDidReceiveMessage((message: InboundMessage) => this.handleMessage(message));
  }

  /** Resets the view back to the empty hero state. */
  newChat(): void {
    void this.webview.postMessage({ type: "reset" });
  }

  private async handleMessage(message: InboundMessage): Promise<void> {
    switch (message.type) {
      case "ready":
        this.post({
          type: "init",
          model: vscode.workspace.getConfiguration("agentix").get("model", "Claude")
        });
        return;

      case "modelChanged":
        await vscode.workspace
          .getConfiguration("agentix")
          .update("model", message.model, vscode.ConfigurationTarget.Global);
        return;

      case "submit":
        await this.runPlanningFlow(message.prompt, message.model);
        return;

      case "approve":
        this.post({ type: "status", phase: "implement" });
        return;

      case "newChat":
        this.newChat();
        return;

      case "action":
        await this.handleAction(message.action);
        return;
    }
  }

  private async handleAction(action: "attach" | "code" | "image"): Promise<void> {
    if (action === "attach") {
      const files = await vscode.window.showOpenDialog({ canSelectMany: true });
      if (files?.length) {
        this.post({
          type: "attachments",
          files: files.map((f) => f.path.split("/").pop() ?? f.path)
        });
      }
      return;
    }

    if (action === "code") {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        void vscode.window.showInformationMessage(
          "Open a file and select code to include it as context."
        );
        return;
      }
      const selection = editor.document.getText(editor.selection) || editor.document.getText();
      const name = editor.document.fileName.split("/").pop() ?? "selection";
      this.post({ type: "codeContext", name, snippet: selection.slice(0, 4000) });
      return;
    }

    if (action === "image") {
      const images = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { Images: ["png", "jpg", "jpeg", "gif", "webp", "svg"] }
      });
      if (images?.length) {
        this.post({
          type: "attachments",
          files: [images[0].path.split("/").pop() ?? "image"]
        });
      }
    }
  }

  /**
   * Simulated request → plan flow described in the README user flow.
   * Replace each phase with real agent calls as the runtime lands.
   */
  private async runPlanningFlow(prompt: string, model: string): Promise<void> {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    this.post({ type: "status", phase: "analyze" });
    await wait(900);

    this.post({ type: "status", phase: "plan" });
    await wait(1100);

    this.post({ type: "plan", model, steps: buildPlan(prompt) });
  }

  private post(message: unknown): void {
    void this.webview.postMessage(message);
  }
}

/**
 * Provides the Agentix OS home screen as a webview view.
 * The same provider class backs both the activity-bar view and the panel view.
 */
class AgentixHomeProvider implements vscode.WebviewViewProvider {
  private controller?: AgentixController;

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = webviewOptions(this.extensionUri);
    webviewView.webview.html = getHtml(webviewView.webview, this.extensionUri);
    this.controller = new AgentixController(webviewView.webview);
  }

  newChat(): void {
    this.controller?.newChat();
  }
}

/** Tracks the side-panel so repeated opens reveal the existing one. */
let sidePanel: vscode.WebviewPanel | undefined;
let sidePanelController: AgentixController | undefined;

/** Opens (or reveals) the Agentix OS home as a panel beside the editor. */
function openSidePanel(extensionUri: vscode.Uri): void {
  if (sidePanel) {
    sidePanel.reveal(vscode.ViewColumn.Beside);
    return;
  }

  sidePanel = vscode.window.createWebviewPanel(
    "agentix.panel",
    "Agentix OS",
    { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false },
    webviewOptions(extensionUri)
  );
  sidePanel.iconPath = vscode.Uri.joinPath(extensionUri, "resources", "icon.svg");
  sidePanel.webview.html = getHtml(sidePanel.webview, extensionUri);
  sidePanelController = new AgentixController(sidePanel.webview);

  sidePanel.onDidDispose(() => {
    sidePanel = undefined;
    sidePanelController = undefined;
  });
}

function webviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")]
  };
}

function getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const nonce = getNonce();
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "main.css")
  );
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "main.js")
  );
  const csp = [
    `default-src 'none'`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
    `font-src ${webview.cspSource}`,
    `img-src ${webview.cspSource} data:`
  ].join("; ");

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="${styleUri}" rel="stylesheet" />
  <title>Agentix OS</title>
</head>
<body>
  <div class="app">
    <header class="hero-header">
      <div class="hero-heading">
        <h1>👋 Welcome to Agentix OS</h1>
        <p class="subtitle">Your AI Development Assistant</p>
      </div>
      <div class="model-selector">
        <label class="visually-hidden" for="model">Model</label>
        <select id="model">
          <option value="Claude">Claude</option>
          <option value="GPT">GPT</option>
          <option value="Gemini">Gemini</option>
          <option value="DeepSeek">DeepSeek</option>
        </select>
      </div>
    </header>

    <main class="main" id="main">
      <section class="empty-state" id="empty-state">
        <div class="empty-icon">✦</div>
        <h2>Start building with AI</h2>
        <p>
          Describe your idea, bug, feature, or project.<br />
          Agentix OS will analyze it and create a plan before implementation.
        </p>
      </section>

      <section class="thread" id="thread" aria-live="polite"></section>
    </main>

    <footer class="composer">
      <div class="chips" id="context-chips"></div>
      <div class="prompt-box">
        <textarea
          id="prompt"
          rows="1"
          placeholder="Ask anything...&#10;(e.g. Create a full ERP system, Fix a bug, Add authentication)"
        ></textarea>
        <div class="composer-bar">
          <div class="actions">
            <button class="icon-btn" data-action="attach" title="Attach Files">📎</button>
            <button class="icon-btn" data-action="code" title="Include Code">&lt;/&gt;</button>
            <button class="icon-btn" data-action="image" title="Add Image">🖼</button>
          </div>
          <button class="send-btn" id="send" title="Send (Enter)" disabled>
            <span class="send-label">Send</span>
            <span class="send-arrow">↑</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

/** Builds a lightweight placeholder plan from the user prompt. */
function buildPlan(prompt: string): string[] {
  const trimmed = prompt.trim();
  return [
    `Understand the request: "${truncate(trimmed, 80)}"`,
    "Define scope, modules, and data model",
    "Scaffold project structure and dependencies",
    "Implement core features incrementally",
    "Add tests and verify each milestone",
    "Review, refine, and prepare to ship"
  ];
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function getNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new AgentixHomeProvider(context.extensionUri);
  const panelProvider = new AgentixHomeProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(VIEW_ID, sidebarProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.window.registerWebviewViewProvider(PANEL_VIEW_ID, panelProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.commands.registerCommand("agentix.openHome", () => {
      void vscode.commands.executeCommand(`${VIEW_ID}.focus`);
    }),
    vscode.commands.registerCommand("agentix.openPanel", () =>
      openSidePanel(context.extensionUri)
    ),
    vscode.commands.registerCommand("agentix.newChat", () => {
      sidebarProvider.newChat();
      panelProvider.newChat();
      sidePanelController?.newChat();
    }),
    vscode.commands.registerCommand("agentix.revealRightSection", revealRightSection)
  );

  // Auto-open the home as a panel beside the editor on startup.
  openSidePanel(context.extensionUri);

  // Reveal the Secondary Side Bar (the "right section") so it's ready to dock into.
  void revealRightSection();
}

/** Opens VS Code's Secondary Side Bar (the right section). */
async function revealRightSection(): Promise<void> {
  // Command ids vary across VS Code builds; try the focus command first,
  // then fall back to the toggle command which is always available.
  const candidates = [
    "workbench.action.focusAuxiliaryBar",
    "workbench.action.toggleAuxiliaryBar"
  ];
  for (const command of candidates) {
    try {
      await vscode.commands.executeCommand(command);
      return;
    } catch {
      // Try the next candidate.
    }
  }
}

export function deactivate(): void {
  // No teardown required.
}
