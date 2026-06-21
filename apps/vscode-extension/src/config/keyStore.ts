import * as vscode from "vscode";
import type { SecretStore } from "../providerManager";

/** Adapts VS Code's SecretStorage to the SecretStore interface, namespacing keys. */
export class KeyStore implements SecretStore {
  constructor(private readonly secrets: vscode.SecretStorage) {}

  get(key: string): Promise<string | undefined> {
    return Promise.resolve(this.secrets.get(key));
  }

  store(key: string, value: string): Promise<void> {
    return Promise.resolve(this.secrets.store(key, value));
  }

  delete(key: string): Promise<void> {
    return Promise.resolve(this.secrets.delete(key));
  }
}
