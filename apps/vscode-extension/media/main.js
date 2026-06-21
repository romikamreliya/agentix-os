// @ts-check
(function () {
  const vscode = acquireVsCodeApi();

  const promptEl = /** @type {HTMLTextAreaElement} */ (document.getElementById("prompt"));
  const sendBtn = /** @type {HTMLButtonElement} */ (document.getElementById("send"));
  const emptyState = /** @type {HTMLElement} */ (document.getElementById("empty-state"));
  const thread = /** @type {HTMLElement} */ (document.getElementById("thread"));
  const chips = /** @type {HTMLElement} */ (document.getElementById("context-chips"));

  const providerPill = /** @type {HTMLButtonElement} */ (document.getElementById("provider-pill"));
  const providerDot = /** @type {HTMLElement} */ (document.getElementById("provider-dot"));
  const providerName = /** @type {HTMLElement} */ (document.getElementById("provider-name"));
  const providersPanel = /** @type {HTMLElement} */ (document.getElementById("providers-panel"));
  const providersList = /** @type {HTMLElement} */ (document.getElementById("providers-list"));

  /** @type {string[]} */
  let attachments = [];
  let busy = false;
  let hasActiveProvider = false;
  /** @type {HTMLElement | null} */
  let statusBubble = null;

  // ---------- Input handling ----------
  function autoGrow() {
    promptEl.style.height = "auto";
    promptEl.style.height = Math.min(promptEl.scrollHeight, 200) + "px";
  }

  function syncSendState() {
    sendBtn.disabled = busy || promptEl.value.trim().length === 0;
  }

  promptEl.addEventListener("input", () => {
    autoGrow();
    syncSendState();
  });

  promptEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  sendBtn.addEventListener("click", submit);

  document.querySelectorAll(".icon-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      vscode.postMessage({ type: "action", action: btn.getAttribute("data-action") });
    });
  });

  // ---------- Provider panel ----------
  providerPill.addEventListener("click", (e) => {
    e.stopPropagation();
    providersPanel.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !providersPanel.classList.contains("hidden") &&
      !providersPanel.contains(/** @type {Node} */ (e.target)) &&
      e.target !== providerPill
    ) {
      providersPanel.classList.add("hidden");
    }
  });

  const STATUS_META = {
    valid: { label: "Connected", cls: "ok" },
    invalid: { label: "Invalid key", cls: "err" },
    validating: { label: "Checking…", cls: "warn" },
    unknown: { label: "", cls: "" }
  };

  function renderProviders(statuses) {
    const active = statuses.find((s) => s.active && s.configured);
    hasActiveProvider = Boolean(active);

    providerName.textContent = active ? active.label : "No provider";
    providerDot.className = "dot " + (active ? "ok" : "off");

    providersList.innerHTML = "";
    statuses.forEach((p) => {
      const row = document.createElement("div");
      row.className = "provider-row" + (p.active && p.configured ? " active" : "");

      const badge = p.configured
        ? STATUS_META[p.status] || STATUS_META.unknown
        : { label: "Not configured", cls: "off" };
      const badgeLabel =
        p.configured && p.status === "unknown" ? "Configured" : badge.label;

      const actions = p.configured
        ? (p.active
            ? '<span class="tag-active">Active</span>'
            : '<button class="link" data-act="activate">Use</button>') +
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
        "</div>" +
        '<div class="provider-actions">' + actions + "</div>";

      row.querySelectorAll("[data-act]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const act = btn.getAttribute("data-act");
          if (act === "add" || act === "update") {
            vscode.postMessage({ type: "addProviderKey", id: p.id });
          } else if (act === "activate") {
            vscode.postMessage({ type: "setActiveProvider", id: p.id });
          } else if (act === "remove") {
            vscode.postMessage({ type: "removeProviderKey", id: p.id });
          }
        });
      });

      providersList.appendChild(row);
    });
  }

  // ---------- Submit ----------
  function submit() {
    const prompt = promptEl.value.trim();
    if (!prompt || busy) return;

    if (!hasActiveProvider) {
      providersPanel.classList.remove("hidden");
      flashNotice("Add and select an AI provider to start building.");
      return;
    }

    emptyState.classList.add("hidden");
    addUserBubble(prompt);

    busy = true;
    syncSendState();
    promptEl.value = "";
    autoGrow();

    vscode.postMessage({ type: "submit", prompt });
  }

  // ---------- Rendering ----------
  function addUserBubble(text) {
    const el = document.createElement("div");
    el.className = "bubble user";
    el.textContent = text;
    thread.appendChild(el);
    scrollToBottom();
  }

  function flashNotice(text) {
    emptyState.classList.add("hidden");
    const el = document.createElement("div");
    el.className = "bubble ai notice";
    el.textContent = "⚠️ " + text;
    thread.appendChild(el);
    scrollToBottom();
  }

  function setStatus(phase) {
    const labels = {
      analyze: "Analyzing your request…",
      plan: "Generating a plan…",
      implement: "Implementation started…"
    };

    if (phase === "implement") {
      if (statusBubble) statusBubble.remove();
      statusBubble = null;
      const el = document.createElement("div");
      el.className = "bubble ai";
      el.innerHTML = '<div class="status implementing">⚙️ ' + labels.implement + "</div>";
      thread.appendChild(el);
      busy = false;
      syncSendState();
      scrollToBottom();
      return;
    }

    if (!statusBubble) {
      statusBubble = document.createElement("div");
      statusBubble.className = "bubble ai";
      thread.appendChild(statusBubble);
    }
    statusBubble.innerHTML =
      '<div class="status"><span class="spinner"></span>' + labels[phase] + "</div>";
    scrollToBottom();
  }

  function renderPlan(steps, model) {
    if (statusBubble) statusBubble.remove();
    statusBubble = null;

    const el = document.createElement("div");
    el.className = "bubble ai";

    const items = steps.map((s) => "<li>" + escapeHtml(s) + "</li>").join("");
    el.innerHTML =
      '<div class="label">📋 Proposed Plan' +
      (model ? ' <span class="by">via ' + escapeHtml(model) + "</span>" : "") +
      "</div>" +
      '<ol class="plan-steps">' +
      items +
      "</ol>" +
      '<div class="plan-actions">' +
      '<button class="btn primary" id="approve">Approve plan</button>' +
      '<button class="btn" id="refine">Refine</button>' +
      "</div>";

    thread.appendChild(el);
    busy = false;
    syncSendState();
    scrollToBottom();

    el.querySelector("#approve")?.addEventListener("click", () => {
      el.querySelector(".plan-actions")?.remove();
      vscode.postMessage({ type: "approve" });
    });
    el.querySelector("#refine")?.addEventListener("click", () => {
      promptEl.focus();
    });
  }

  function renderChips() {
    chips.innerHTML = "";
    attachments.forEach((name, i) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = "📎 " + escapeHtml(name) + ' <button data-i="' + i + '">×</button>';
      chip.querySelector("button")?.addEventListener("click", () => {
        attachments.splice(i, 1);
        renderChips();
      });
      chips.appendChild(chip);
    });
  }

  function reset() {
    thread.innerHTML = "";
    chips.innerHTML = "";
    attachments = [];
    statusBubble = null;
    busy = false;
    promptEl.value = "";
    autoGrow();
    emptyState.classList.remove("hidden");
    syncSendState();
    promptEl.focus();
  }

  // ---------- Helpers ----------
  function scrollToBottom() {
    const main = document.getElementById("main");
    if (main) main.scrollTop = main.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------- Host messages ----------
  window.addEventListener("message", (event) => {
    const msg = event.data;
    switch (msg.type) {
      case "providers":
        renderProviders(msg.statuses);
        break;
      case "status":
        setStatus(msg.phase);
        break;
      case "plan":
        renderPlan(msg.steps, msg.model);
        break;
      case "attachments":
        attachments = attachments.concat(msg.files);
        renderChips();
        break;
      case "codeContext":
        attachments.push(msg.name + " (code)");
        renderChips();
        break;
      case "needsProvider":
        busy = false;
        syncSendState();
        providersPanel.classList.remove("hidden");
        flashNotice("Add and select an AI provider to start building.");
        break;
      case "reset":
        reset();
        break;
    }
  });

  vscode.postMessage({ type: "ready" });
})();
