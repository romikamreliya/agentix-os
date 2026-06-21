// @ts-check
(function () {
  const vscode = acquireVsCodeApi();

  const promptEl = /** @type {HTMLTextAreaElement} */ (document.getElementById("prompt"));
  const sendBtn = /** @type {HTMLButtonElement} */ (document.getElementById("send"));
  const modelEl = /** @type {HTMLSelectElement} */ (document.getElementById("model"));
  const emptyState = /** @type {HTMLElement} */ (document.getElementById("empty-state"));
  const thread = /** @type {HTMLElement} */ (document.getElementById("thread"));
  const chips = /** @type {HTMLElement} */ (document.getElementById("context-chips"));

  /** @type {string[]} */
  let attachments = [];
  let busy = false;
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

  modelEl.addEventListener("change", () => {
    vscode.postMessage({ type: "modelChanged", model: modelEl.value });
  });

  document.querySelectorAll(".icon-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      vscode.postMessage({ type: "action", action: btn.getAttribute("data-action") });
    });
  });

  // ---------- Submit ----------
  function submit() {
    const prompt = promptEl.value.trim();
    if (!prompt || busy) return;

    emptyState.classList.add("hidden");
    addUserBubble(prompt);

    busy = true;
    syncSendState();
    promptEl.value = "";
    autoGrow();

    vscode.postMessage({ type: "submit", prompt, model: modelEl.value });
  }

  // ---------- Rendering ----------
  function addUserBubble(text) {
    const el = document.createElement("div");
    el.className = "bubble user";
    el.textContent = text;
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
      el.innerHTML =
        '<div class="status implementing">⚙️ ' + labels.implement + "</div>";
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

  function renderPlan(steps) {
    if (statusBubble) statusBubble.remove();
    statusBubble = null;

    const el = document.createElement("div");
    el.className = "bubble ai";

    const items = steps.map((s) => "<li>" + escapeHtml(s) + "</li>").join("");
    el.innerHTML =
      '<div class="label">📋 Proposed Plan</div>' +
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
      case "init":
        if (msg.model) modelEl.value = msg.model;
        break;
      case "status":
        setStatus(msg.phase);
        break;
      case "plan":
        renderPlan(msg.steps);
        break;
      case "attachments":
        attachments = attachments.concat(msg.files);
        renderChips();
        break;
      case "codeContext":
        attachments.push(msg.name + " (code)");
        renderChips();
        break;
      case "reset":
        reset();
        break;
    }
  });

  vscode.postMessage({ type: "ready" });
})();
