import * as vscode from "vscode";

/** Subfolders created inside the workspace .agentix/ directory. */
const WORKSPACE_DIRS = [
  "projects",
  "knowledge",
  "blueprints",
  "exports",
  "logs",
  "attachments",
  "settings"
];

/**
 * Ensures the local-first workspace exists at <workspace>/.agentix/.
 * This is the Phase 1 workspace-initialization step.
 */
async function initWorkspace(): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    return;
  }
  const root = vscode.Uri.joinPath(folder.uri, ".agentix");
  await vscode.workspace.fs.createDirectory(root);
  for (const dir of WORKSPACE_DIRS) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(root, dir));
  }
}

/** Minimal sidebar tree for the Agentix OS activity-bar view. */
class AgentixTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.TreeItem[] {
    const dashboard = new vscode.TreeItem("Open Dashboard");
    dashboard.iconPath = new vscode.ThemeIcon("dashboard");
    dashboard.command = {
      command: "agentix.openDashboard",
      title: "Open Dashboard"
    };

    const sections = ["Projects", "Tasks", "Reviews", "Approvals", "Knowledge"].map(
      (label) => {
        const item = new vscode.TreeItem(label);
        item.description = "coming soon";
        return item;
      }
    );

    return [dashboard, ...sections];
  }
}

function dashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agentix OS</title>
  <style>
    body { font-family: var(--vscode-font-family); padding: 24px; }
    h1 { margin-bottom: 4px; }
    .muted { color: var(--vscode-descriptionForeground); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
    .card {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px; padding: 16px;
    }
    .card h2 { font-size: 13px; text-transform: uppercase; margin: 0 0 8px; }
  </style>
</head>
<body>
  <h1>Agentix OS</h1>
  <div class="muted">Local-first AI operating system &mdash; Phase 1 shell</div>
  <div class="grid">
    <div class="card"><h2>Active Projects</h2><div class="muted">None yet</div></div>
    <div class="card"><h2>Open Tasks</h2><div class="muted">None yet</div></div>
    <div class="card"><h2>Open Reviews</h2><div class="muted">None yet</div></div>
    <div class="card"><h2>Open Approvals</h2><div class="muted">None yet</div></div>
  </div>
</body>
</html>`;
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  await initWorkspace();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("agentix.home", new AgentixTreeProvider())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("agentix.openDashboard", () => {
      const panel = vscode.window.createWebviewPanel(
        "agentixDashboard",
        "Agentix OS",
        vscode.ViewColumn.One,
        { enableScripts: false }
      );
      panel.webview.html = dashboardHtml();
    })
  );

  void vscode.window.showInformationMessage("Agentix OS activated.");
}

export function deactivate(): void {
  // No teardown required for the Phase 1 shell.
}
