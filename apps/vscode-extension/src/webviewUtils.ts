import * as vscode from "vscode";
import { ProviderManager } from "./providerManager";
import { PROVIDERS } from "./providers/registry";
import type { ProviderId } from "./providers/types";

/** Generates a CSP nonce for inline-script protection. */
export function getNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

/** Builds the Content-Security-Policy for a webview. */
export function buildCsp(webview: vscode.Webview, nonce: string): string {
  return [
    `default-src 'none'`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
    `font-src ${webview.cspSource}`,
    `img-src ${webview.cspSource} data:`
  ].join("; ");
}

/** Prompts for an API key (masked), validates it, and stores it if valid. */
export async function promptAndSaveKey(
  providers: ProviderManager,
  id: ProviderId
): Promise<void> {
  const provider = PROVIDERS.find((p) => p.id === id);
  if (!provider) {
    return;
  }
  const key = await vscode.window.showInputBox({
    title: `${provider.label} API key`,
    prompt: `Enter your ${provider.vendor} API key (${provider.keyHint}).`,
    password: true,
    ignoreFocusOut: true,
    placeHolder: provider.keyHint
  });
  if (key === undefined) {
    return; // cancelled
  }

  const result = await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: `Validating ${provider.label} key…` },
    () => providers.saveKey(id, key)
  );

  void (result.ok
    ? vscode.window.showInformationMessage(`${provider.label} connected.`)
    : vscode.window.showErrorMessage(result.error ?? "Could not add the API key."));
}

/** Confirms and removes a provider's stored key. */
export async function confirmRemoveKey(
  providers: ProviderManager,
  id: ProviderId
): Promise<void> {
  const provider = PROVIDERS.find((p) => p.id === id);
  const choice = await vscode.window.showWarningMessage(
    `Remove the ${provider?.label ?? "provider"} API key?`,
    { modal: true },
    "Remove"
  );
  if (choice === "Remove") {
    await providers.removeKey(id);
  }
}
