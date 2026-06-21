import * as vscode from "vscode";
import * as path from "path";
import type { FileChange } from "./workflow/types";

/** A node in the project file tree. */
export interface ProjectNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: ProjectNode[];
}

/**
 * Wraps VS Code's workspace file system APIs to provide controlled
 * read/write/delete/rename operations. Every mutating operation goes through
 * an explicit approval step before execution.
 */
export class FileSystemService {
  /** Returns the workspace root URI, or undefined if no folder is open. */
  getWorkspaceRoot(): vscode.Uri | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri;
  }

  /** Returns the workspace root path as a string. */
  getWorkspaceRootPath(): string | undefined {
    return this.getWorkspaceRoot()?.fsPath;
  }

  /**
   * Reads the project tree structure from the workspace root.
   * Respects common ignore patterns (.git, node_modules, dist, etc.).
   */
  async getProjectTree(maxDepth = 4): Promise<ProjectNode[]> {
    const root = this.getWorkspaceRoot();
    if (!root) return [];
    return this.readDirectory(root, 0, maxDepth);
  }

  /**
   * Returns a flat text representation of the project tree for AI context.
   */
  async getProjectTreeText(maxDepth = 4): Promise<string> {
    const nodes = await this.getProjectTree(maxDepth);
    const lines: string[] = [];
    this.flattenTree(nodes, "", lines);
    return lines.join("\n");
  }

  /** Reads a file from the workspace. */
  async readFile(filePath: string): Promise<string> {
    const root = this.getWorkspaceRoot();
    if (!root) throw new Error("No workspace folder is open.");
    const uri = this.resolveUri(root, filePath);
    const data = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(data).toString("utf8");
  }

  /** Checks if a file exists in the workspace. */
  async fileExists(filePath: string): Promise<boolean> {
    const root = this.getWorkspaceRoot();
    if (!root) return false;
    try {
      await vscode.workspace.fs.stat(this.resolveUri(root, filePath));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Executes a single approved file change.
   * Returns success/failure with an optional error message.
   */
  async executeChange(change: FileChange): Promise<{ ok: boolean; error?: string }> {
    const root = this.getWorkspaceRoot();
    if (!root) return { ok: false, error: "No workspace folder is open." };

    try {
      switch (change.operation) {
        case "create": {
          const uri = this.resolveUri(root, change.filePath);
          // Ensure parent directory exists
          const parent = vscode.Uri.joinPath(uri, "..");
          await vscode.workspace.fs.createDirectory(parent);
          const content = Buffer.from(change.content ?? "", "utf8");
          await vscode.workspace.fs.writeFile(uri, content);
          return { ok: true };
        }

        case "modify": {
          const uri = this.resolveUri(root, change.filePath);
          const content = Buffer.from(change.content ?? "", "utf8");
          await vscode.workspace.fs.writeFile(uri, content);
          return { ok: true };
        }

        case "delete": {
          const uri = this.resolveUri(root, change.filePath);
          await vscode.workspace.fs.delete(uri, { recursive: true });
          return { ok: true };
        }

        case "rename":
        case "move": {
          if (!change.newPath) {
            return { ok: false, error: "New path is required for rename/move." };
          }
          const oldUri = this.resolveUri(root, change.filePath);
          const newUri = this.resolveUri(root, change.newPath);
          // Ensure parent of target exists
          const newParent = vscode.Uri.joinPath(newUri, "..");
          await vscode.workspace.fs.createDirectory(newParent);
          await vscode.workspace.fs.rename(oldUri, newUri, { overwrite: false });
          return { ok: true };
        }

        default:
          return { ok: false, error: `Unknown operation: ${change.operation}` };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message.slice(0, 300) };
    }
  }

  /**
   * Generates a simple unified diff between two strings.
   */
  generateDiff(original: string, modified: string, filePath: string): string {
    const origLines = original.split("\n");
    const modLines = modified.split("\n");
    const lines: string[] = [];
    lines.push(`--- a/${filePath}`);
    lines.push(`+++ b/${filePath}`);

    // Simple line-by-line diff (not optimal, but clear)
    const maxLen = Math.max(origLines.length, modLines.length);
    let inHunk = false;
    let hunkStart = -1;
    const hunkLines: string[] = [];

    for (let i = 0; i < maxLen; i++) {
      const origLine = i < origLines.length ? origLines[i] : undefined;
      const modLine = i < modLines.length ? modLines[i] : undefined;

      if (origLine === modLine) {
        if (inHunk) {
          hunkLines.push(` ${origLine ?? ""}`);
          // End hunk after 3 context lines
          if (hunkLines.filter((l) => l.startsWith(" ")).length >= 3) {
            lines.push(`@@ -${hunkStart + 1} +${hunkStart + 1} @@`);
            lines.push(...hunkLines);
            hunkLines.length = 0;
            inHunk = false;
          }
        }
      } else {
        if (!inHunk) {
          inHunk = true;
          hunkStart = Math.max(0, i - 1);
          // Add 1 line of context before
          if (i > 0) {
            hunkLines.push(` ${origLines[i - 1] ?? ""}`);
          }
        }
        if (origLine !== undefined && modLine === undefined) {
          hunkLines.push(`-${origLine}`);
        } else if (origLine === undefined && modLine !== undefined) {
          hunkLines.push(`+${modLine}`);
        } else {
          if (origLine !== undefined) hunkLines.push(`-${origLine}`);
          if (modLine !== undefined) hunkLines.push(`+${modLine}`);
        }
      }
    }

    // Flush remaining hunk
    if (hunkLines.length) {
      lines.push(`@@ -${hunkStart + 1} +${hunkStart + 1} @@`);
      lines.push(...hunkLines);
    }

    return lines.join("\n");
  }

  // ---------- Private helpers ----------

  private resolveUri(root: vscode.Uri, filePath: string): vscode.Uri {
    // Handle both absolute and relative paths
    if (path.isAbsolute(filePath)) {
      return vscode.Uri.file(filePath);
    }
    return vscode.Uri.joinPath(root, filePath);
  }

  private readonly IGNORE_DIRS = new Set([
    ".git",
    "node_modules",
    "dist",
    ".next",
    "__pycache__",
    ".venv",
    "venv",
    ".DS_Store",
    "coverage",
    ".turbo",
    ".cache"
  ]);

  private async readDirectory(
    uri: vscode.Uri,
    depth: number,
    maxDepth: number
  ): Promise<ProjectNode[]> {
    if (depth >= maxDepth) return [];

    const entries = await vscode.workspace.fs.readDirectory(uri);
    const nodes: ProjectNode[] = [];

    // Sort: directories first, then alphabetical
    entries.sort((a, b) => {
      if (a[1] !== b[1]) return b[1] - a[1]; // dirs first
      return a[0].localeCompare(b[0]);
    });

    for (const [name, type] of entries) {
      if (this.IGNORE_DIRS.has(name) || name.startsWith(".")) {
        continue;
      }

      const childUri = vscode.Uri.joinPath(uri, name);
      const isDir = type === vscode.FileType.Directory;
      const node: ProjectNode = {
        name,
        path: vscode.workspace.asRelativePath(childUri, false),
        isDirectory: isDir
      };

      if (isDir) {
        node.children = await this.readDirectory(childUri, depth + 1, maxDepth);
      }

      nodes.push(node);
    }

    return nodes;
  }

  private flattenTree(nodes: ProjectNode[], prefix: string, lines: string[]): void {
    for (const node of nodes) {
      const icon = node.isDirectory ? "📁" : "📄";
      lines.push(`${prefix}${icon} ${node.name}`);
      if (node.children) {
        this.flattenTree(node.children, prefix + "  ", lines);
      }
    }
  }
}
