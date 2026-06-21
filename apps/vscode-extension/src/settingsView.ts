import * as vscode from "vscode";
import { ProviderManager } from "./providerManager";
import { SettingsService, type AgentixSettings } from "./settings";
import { buildCsp, confirmRemoveKey, getNonce, promptAndSaveKey } from "./webviewUtils";
import type { ProviderId } from "./providers/types";

type InboundMessage =
  | { type: "ready" }
  | { type: "addProviderKey"; id: ProviderId }
  | { type: "removeProviderKey"; id: ProviderId }
  | { type: "setActiveProvider"; id: ProviderId }
  | { type: "revalidateProvider"; id: ProviderId }
  | { type: "setSetting"; key: keyof AgentixSettings; value: boolean };

let panel: vscode.WebviewPanel | undefined;

/** Opens (or reveals) the Agentix OS settings page. */
export function openSettings(
  extensionUri: vscode.Uri,
  providers: ProviderManager,
  settings: SettingsService,
  storePath: string
): void {
  if (panel) {
    panel.reveal(vscode.ViewColumn.Active);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    "agentix.settings",
    "Agentix OS — Settings",
    vscode.ViewColumn.Active,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")]
    }
  );
  panel.iconPath = vscode.Uri.joinPath(extensionUri, "resources", "icon.svg");
  panel.webview.html = getSettingsHtml(panel.webview, extensionUri);

  const post = () => void postState(panel!, providers, settings, storePath);

  const subs = [providers.onDidChange(post), settings.onDidChange(post)];

  panel.webview.onDidReceiveMessage(async (message: InboundMessage) => {
    switch (message.type) {
      case "ready":
        post();
        return;
      case "addProviderKey":
        await promptAndSaveKey(providers, message.id);
        return;
      case "removeProviderKey":
        await confirmRemoveKey(providers, message.id);
        return;
      case "setActiveProvider": {
        const result = await providers.setActive(message.id);
        if (!result.ok) {
          void vscode.window.showWarningMessage(result.error ?? "Could not select provider.");
        }
        return;
      }
      case "revalidateProvider": {
        const result = await providers.revalidate(message.id);
        void (result.ok
          ? vscode.window.showInformationMessage("API key is valid.")
          : vscode.window.showWarningMessage(result.error ?? "Validation failed."));
        return;
      }
      case "setSetting":
        await settings.set(message.key, message.value);
        return;
    }
  });

  panel.onDidDispose(() => {
    subs.forEach((off) => off());
    panel = undefined;
  });
}

async function postState(
  target: vscode.WebviewPanel,
  providers: ProviderManager,
  settings: SettingsService,
  storePath: string
): Promise<void> {
  void target.webview.postMessage({
    type: "state",
    statuses: await providers.getStatuses(),
    settings: settings.get(),
    storePath
  });
}

function getSettingsHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const nonce = getNonce();
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "main.css"));
  const settingsStyleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "settings.css")
  );
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "settings.js")
  );

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${buildCsp(webview, nonce)}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="${styleUri}" rel="stylesheet" />
  <link href="${settingsStyleUri}" rel="stylesheet" />
  <title>Agentix OS Settings</title>
</head>
<body>
  <div class="settings">
    <header class="settings-header">
      <h1>Settings</h1>
      <p class="subtitle">Configure AI providers and preferences for Agentix OS.</p>
    </header>

    <section class="settings-section">
      <h2>AI Providers</h2>
      <p class="section-desc">
        Add an API key to enable a provider. Keys are stored securely in the OS keychain
        via VS Code SecretStorage — never in the local data file.
      </p>
      <div id="providers-list" class="settings-providers"></div>
    </section>

    <section class="settings-section">
      <h2>Preferences</h2>
      <div id="preferences" class="preferences"></div>
    </section>

    <section class="settings-section">
      <h2>Local data</h2>
      <p class="section-desc">
        Provider selection, validation status, and preferences are saved to a local JSON file:
      </p>
      <code class="store-path" id="store-path">—</code>
    </section>
  </div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}
