// @ts-check
(function () {
  const vscode = acquireVsCodeApi();

  const providersList = /** @type {HTMLElement} */ (document.getElementById("providers-list"));
  const preferences = /** @type {HTMLElement} */ (document.getElementById("preferences"));
  const storePath = /** @type {HTMLElement} */ (document.getElementById("store-path"));

  const STATUS_META = {
    valid: { label: "Connected", cls: "ok" },
    invalid: { label: "Invalid key", cls: "err" },
    validating: { label: "Checking…", cls: "warn" },
    unknown: { label: "", cls: "" }
  };

  const PREF_META = [
    {
      key: "autoOpenPanel",
      label: "Open beside the editor on startup",
      desc: "Automatically open the Agentix OS panel when VS Code starts."
    },
    {
      key: "revealRightSection",
      label: "Reveal the right section on startup",
      desc: "Show the Secondary Side Bar so Agentix can be docked there."
    },
    {
      key: "confirmPlan",
      label: "Confirm plan before implementation",
      desc: "Require approval of the generated plan before building."
    }
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderProviders(statuses) {
    providersList.innerHTML = "";
    statuses.forEach((p) => {
      const row = document.createElement("div");
      row.className = "provider-row" + (p.active && p.configured ? " active" : "");

      const badge = p.configured
        ? STATUS_META[p.status] || STATUS_META.unknown
        : { label: "Not configured", cls: "off" };
      const badgeLabel = p.configured && p.status === "unknown" ? "Configured" : badge.label;

      const actions = p.configured
        ? (p.active
            ? '<span class="tag-active">Active</span>'
            : '<button class="link" data-act="activate">Use</button>') +
          '<button class="link" data-act="revalidate">Re-check</button>' +
          '<button class="link" data-act="update">Update</button>' +
          '<button class="link danger" data-act="remove">Remove</button>'
        : '<button class="link primary" data-act="add">Add key</button>';

      row.innerHTML =
        '<div class="provider-info">' +
        '<div class="provider-title">' +
        '<span class="provider-label">' + escapeHtml(p.label) + "</span>" +
        '<span class="provider-vendor">' + escapeHtml(p.vendor) + "</span>" +
        "</div>" +
        '<span class="badge ' + badge.cls + '">' + escapeHtml(badgeLabel) + "</span>" +
        '<span class="key-hint">' + escapeHtml(p.keyHint) + "</span>" +
        "</div>" +
        '<div class="provider-actions">' + actions + "</div>";

      row.querySelectorAll("[data-act]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const act = btn.getAttribute("data-act");
          if (act === "add" || act === "update") {
            vscode.postMessage({ type: "addProviderKey", id: p.id });
          } else if (act === "activate") {
            vscode.postMessage({ type: "setActiveProvider", id: p.id });
          } else if (act === "revalidate") {
            vscode.postMessage({ type: "revalidateProvider", id: p.id });
          } else if (act === "remove") {
            vscode.postMessage({ type: "removeProviderKey", id: p.id });
          }
        });
      });

      providersList.appendChild(row);
    });
  }

  function renderPreferences(settings) {
    preferences.innerHTML = "";
    PREF_META.forEach((pref) => {
      const checked = Boolean(settings[pref.key]);
      const row = document.createElement("label");
      row.className = "pref-row";
      row.innerHTML =
        '<div class="pref-text">' +
        '<span class="pref-label">' + escapeHtml(pref.label) + "</span>" +
        '<span class="pref-desc">' + escapeHtml(pref.desc) + "</span>" +
        "</div>" +
        '<span class="switch' + (checked ? " on" : "") + '"><span class="knob"></span></span>';

      row.querySelector(".switch")?.addEventListener("click", () => {
        vscode.postMessage({ type: "setSetting", key: pref.key, value: !checked });
      });
      preferences.appendChild(row);
    });
  }

  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (msg.type === "state") {
      renderProviders(msg.statuses);
      renderPreferences(msg.settings);
      storePath.textContent = msg.storePath || "—";
    }
  });

  vscode.postMessage({ type: "ready" });
})();
