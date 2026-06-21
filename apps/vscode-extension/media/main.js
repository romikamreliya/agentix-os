// @ts-check
(function () {
  const vscode = acquireVsCodeApi();

  const promptEl = /** @type {HTMLTextAreaElement} */ (document.getElementById("prompt"));
  const sendBtn = /** @type {HTMLButtonElement} */ (document.getElementById("send"));
  const emptyState = /** @type {HTMLElement} */ (document.getElementById("empty-state"));
  const thread = /** @type {HTMLElement} */ (document.getElementById("thread"));
  const composer = /** @type {HTMLElement} */ (document.querySelector(".composer"));
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
  /** @type {any} */
  let session = null;

  // ---------- Helpers ----------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function scrollToBottom() {
    const main = document.getElementById("main");
    if (main) main.scrollTop = main.scrollHeight;
  }

  // ---------- Composer ----------
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

  function submit() {
    const prompt = promptEl.value.trim();
    if (!prompt || busy) return;
    if (!hasActiveProvider) {
      providersPanel.classList.remove("hidden");
      flashNotice("Add and select an AI provider to start building.");
      return;
    }
    busy = true;
    syncSendState();
    promptEl.value = "";
    autoGrow();
    vscode.postMessage({ type: "start", prompt });
  }

  function flashNotice(text) {
    emptyState.classList.add("hidden");
    const el = document.createElement("div");
    el.className = "bubble ai notice";
    el.textContent = "⚠️ " + text;
    thread.appendChild(el);
    scrollToBottom();
  }

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
      const badge = p.configured ? STATUS_META[p.status] || STATUS_META.unknown : { label: "Not configured", cls: "off" };
      const badgeLabel = p.configured && p.status === "unknown" ? "Configured" : badge.label;
      const actions = p.configured
        ? (p.active ? '<span class="tag-active">Active</span>' : '<button class="link" data-act="activate">Use</button>') +
          '<button class="link" data-act="update">Update</button>' +
          '<button class="link danger" data-act="remove">Remove</button>'
        : '<button class="link primary" data-act="add">Add key</button>';
      row.innerHTML =
        '<div class="provider-info"><div class="provider-title">' +
        '<span class="provider-label">' + escapeHtml(p.label) + "</span>" +
        '<span class="provider-vendor">' + escapeHtml(p.vendor) + "</span></div>" +
        '<span class="badge ' + badge.cls + '">' + escapeHtml(badgeLabel) + "</span></div>" +
        '<div class="provider-actions">' + actions + "</div>";
      row.querySelectorAll("[data-act]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const act = btn.getAttribute("data-act");
          if (act === "add" || act === "update") vscode.postMessage({ type: "addProviderKey", id: p.id });
          else if (act === "activate") vscode.postMessage({ type: "setActiveProvider", id: p.id });
          else if (act === "remove") vscode.postMessage({ type: "removeProviderKey", id: p.id });
        });
      });
      providersList.appendChild(row);
    });
  }

  // ---------- Workflow rendering ----------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return /** @type {HTMLElement} */ (t.content.firstElementChild);
  }

  function spinnerCard(text) {
    return el('<div class="bubble ai"><div class="status"><span class="spinner"></span>' + escapeHtml(text) + "</div></div>");
  }

  function questionsCard(questions, onSubmit, submitLabel) {
    const card = el('<div class="bubble ai wf-card"><div class="label">❓ A few questions</div></div>');
    questions.forEach((q) => {
      const fs = el('<fieldset class="wf-q" data-qid="' + escapeHtml(q.id) + '"><legend>' + escapeHtml(q.text) + "</legend></fieldset>");
      q.options.forEach((opt, i) => {
        const id = q.id + "-" + i;
        const row = el(
          '<label class="wf-opt"><input type="radio" name="' + escapeHtml(q.id) + '" value="' + escapeHtml(opt) + '"' +
          (i === 0 ? " checked" : "") + ' /> <span>' + escapeHtml(opt) + "</span></label>"
        );
        fs.appendChild(row);
      });
      if (q.allowOther) {
        const row = el(
          '<label class="wf-opt wf-other"><input type="radio" name="' + escapeHtml(q.id) + '" value="__other__" /> ' +
          '<input type="text" class="wf-other-input" placeholder="Other…" disabled /></label>'
        );
        const radio = /** @type {HTMLInputElement} */ (row.querySelector('input[type=radio]'));
        const text = /** @type {HTMLInputElement} */ (row.querySelector('input[type=text]'));
        fs.addEventListener("change", () => {
          text.disabled = !radio.checked;
          if (radio.checked) text.focus();
        });
        text.addEventListener("focus", () => { radio.checked = true; text.disabled = false; });
        fs.appendChild(row);
      }
      card.appendChild(fs);
    });
    const actions = el('<div class="plan-actions"></div>');
    const btn = el('<button class="btn primary">' + escapeHtml(submitLabel) + "</button>");
    btn.addEventListener("click", () => onSubmit(readAnswers(card)));
    actions.appendChild(btn);
    card.appendChild(actions);
    return card;
  }

  function readAnswers(card) {
    /** @type {Record<string,string>} */
    const answers = {};
    card.querySelectorAll(".wf-q").forEach((fs) => {
      const qid = fs.getAttribute("data-qid");
      const checked = /** @type {HTMLInputElement} */ (fs.querySelector("input[type=radio]:checked"));
      if (!checked) return;
      if (checked.value === "__other__") {
        const other = /** @type {HTMLInputElement} */ (fs.querySelector(".wf-other-input"));
        if (other && other.value.trim()) answers[qid] = other.value.trim();
      } else {
        answers[qid] = checked.value;
      }
    });
    return answers;
  }

  function understandingEditor(u, editable) {
    const card = el('<div class="bubble ai wf-card"></div>');
    card.appendChild(el('<div class="label">🧠 AI Understanding</div>'));
    if (editable) {
      const sum = el('<div class="wf-field"><label>Summary</label><textarea data-f="summary" rows="2"></textarea></div>');
      /** @type {HTMLTextAreaElement} */ (sum.querySelector("textarea")).value = u.summary;
      card.appendChild(sum);
      const goals = el('<div class="wf-field"><label>Goals (one per line)</label><textarea data-f="goals" rows="3"></textarea></div>');
      /** @type {HTMLTextAreaElement} */ (goals.querySelector("textarea")).value = (u.goals || []).join("\n");
      card.appendChild(goals);
    } else {
      card.appendChild(el('<p class="wf-summary">' + escapeHtml(u.summary) + "</p>"));
      if (u.goals && u.goals.length) {
        card.appendChild(el('<ul class="wf-list">' + u.goals.map((g) => "<li>" + escapeHtml(g) + "</li>").join("") + "</ul>"));
      }
    }
    if (u.assumptions && u.assumptions.length) {
      card.appendChild(el('<div class="wf-sub">Assumptions</div>'));
      card.appendChild(el('<ul class="wf-list muted">' + u.assumptions.map((a) => "<li>" + escapeHtml(a) + "</li>").join("") + "</ul>"));
    }
    return card;
  }

  function readUnderstanding(card) {
    const summary = /** @type {HTMLTextAreaElement} */ (card.querySelector('[data-f="summary"]')).value.trim();
    const goals = /** @type {HTMLTextAreaElement} */ (card.querySelector('[data-f="goals"]')).value
      .split("\n").map((s) => s.trim()).filter(Boolean);
    return { summary, goals };
  }

  function planEditor(plan, editable) {
    const card = el('<div class="bubble ai wf-card"></div>');
    card.appendChild(el('<div class="label">📋 Project Plan</div>'));
    (plan.steps || []).forEach((step, i) => {
      const stepEl = el('<div class="wf-step" data-id="' + escapeHtml(step.id) + '"></div>');
      if (editable) {
        const title = el('<div class="wf-field"><label>Step ' + (i + 1) + "</label><input data-f=\"title\" type=\"text\" /></div>");
        /** @type {HTMLInputElement} */ (title.querySelector("input")).value = step.title;
        stepEl.appendChild(title);
        const sub = el('<div class="wf-field"><label>Sub-tasks (one per line)</label><textarea data-f="subSteps" rows="3"></textarea></div>');
        /** @type {HTMLTextAreaElement} */ (sub.querySelector("textarea")).value = (step.subSteps || []).join("\n");
        stepEl.appendChild(sub);
      } else {
        stepEl.appendChild(el('<div class="wf-step-title">' + (i + 1) + ". " + escapeHtml(step.title) + "</div>"));
        if (step.subSteps && step.subSteps.length) {
          stepEl.appendChild(el('<ul class="wf-list">' + step.subSteps.map((s) => "<li>" + escapeHtml(s) + "</li>").join("") + "</ul>"));
        }
      }
      card.appendChild(stepEl);
    });
    return card;
  }

  function readPlan(card) {
    const steps = [...card.querySelectorAll(".wf-step")].map((stepEl) => ({
      id: stepEl.getAttribute("data-id") || "",
      title: /** @type {HTMLInputElement} */ (stepEl.querySelector('[data-f="title"]')).value.trim(),
      detail: "",
      subSteps: /** @type {HTMLTextAreaElement} */ (stepEl.querySelector('[data-f="subSteps"]')).value
        .split("\n").map((s) => s.trim()).filter(Boolean)
    }));
    return { steps };
  }

  function approvedSummary(label, text) {
    return el('<div class="bubble ai wf-card approved"><div class="label">' + label + ' <span class="badge ok">Approved</span></div><p class="wf-summary muted">' + escapeHtml(text) + "</p></div>");
  }

  function taskTree(nodes) {
    const ul = el('<ul class="task-tree"></ul>');
    nodes.forEach((node) => {
      const li = el('<li><div class="task-node"><span class="task-title">' + escapeHtml(node.title) + "</span>" +
        (node.requirement ? '<span class="task-req">↳ ' + escapeHtml(node.requirement) + "</span>" : "") + "</div></li>");
      if (node.children && node.children.length) li.appendChild(taskTree(node.children));
      ul.appendChild(li);
    });
    return ul;
  }

  function actionsRow(buttons) {
    const row = el('<div class="plan-actions"></div>');
    buttons.forEach((b) => {
      const btn = el('<button class="btn ' + (b.primary ? "primary" : "") + '">' + escapeHtml(b.label) + "</button>");
      btn.addEventListener("click", b.onClick);
      row.appendChild(btn);
    });
    return row;
  }

  function renderWorkflow() {
    busy = !!session && session.stage !== "completed" &&
      (session.state === "analyzing" || session.state === "creating");
    thread.innerHTML = "";

    if (!session) {
      emptyState.classList.remove("hidden");
      composer.style.display = "";
      syncSendState();
      return;
    }
    emptyState.classList.add("hidden");

    // Prompt
    thread.appendChild(el('<div class="bubble user">' + escapeHtml(session.prompt) + "</div>"));

    // ----- Understanding stage -----
    if (session.stage === "understanding") {
      if (session.state === "analyzing") {
        thread.appendChild(spinnerCard("Analyzing your request…"));
      } else if (session.state === "questions") {
        thread.appendChild(understandingEditor(session.understanding, false));
        thread.appendChild(
          questionsCard(session.understandingQuestions, (answers) => {
            vscode.postMessage({ type: "answerUnderstanding", answers });
          }, "Submit answers")
        );
      } else if (session.state === "review") {
        const card = understandingEditor(session.understanding, true);
        card.appendChild(
          actionsRow([
            { label: "Approve", primary: true, onClick: () => vscode.postMessage({ type: "approveUnderstanding", understanding: readUnderstanding(card) }) },
            { label: "Change & re-analyze", onClick: () => vscode.postMessage({ type: "changeUnderstanding", understanding: readUnderstanding(card) }) }
          ])
        );
        thread.appendChild(card);
      }
      scrollToBottom();
      composer.style.display = "none";
      return;
    }

    // Understanding is approved beyond this point.
    thread.appendChild(approvedSummary("🧠 Understanding", session.understanding.summary));

    // ----- Planning stage -----
    if (session.stage === "planning") {
      if (session.state === "creating") {
        thread.appendChild(spinnerCard("Creating the project plan…"));
      } else if (session.state === "questions") {
        thread.appendChild(planEditor(session.plan, false));
        thread.appendChild(
          questionsCard(session.planQuestions, (answers) => {
            vscode.postMessage({ type: "answerPlan", answers });
          }, "Submit answers")
        );
      } else if (session.state === "review") {
        const card = planEditor(session.plan, true);
        card.appendChild(
          actionsRow([
            { label: "Approve plan", primary: true, onClick: () => vscode.postMessage({ type: "approvePlan", plan: readPlan(card) }) },
            { label: "Change & re-plan", onClick: () => vscode.postMessage({ type: "changePlan", plan: readPlan(card) }) }
          ])
        );
        thread.appendChild(card);
      }
      scrollToBottom();
      composer.style.display = "none";
      return;
    }

    // ----- Completed: task hierarchy -----
    thread.appendChild(approvedSummary("📋 Plan", session.plan.steps.length + " steps approved"));
    const tasksCard = el('<div class="bubble ai wf-card"><div class="label">✅ Tasks & sub-tasks</div></div>');
    tasksCard.appendChild(taskTree(session.tasks));
    thread.appendChild(tasksCard);
    composer.style.display = "";
    promptEl.placeholder = "Start a new build…";
    syncSendState();
    scrollToBottom();
  }

  // ---------- Host messages ----------
  window.addEventListener("message", (event) => {
    const msg = event.data;
    switch (msg.type) {
      case "providers":
        renderProviders(msg.statuses);
        break;
      case "workflow":
        session = msg.session || null;
        renderWorkflow();
        break;
      case "needsProvider":
        busy = false;
        syncSendState();
        providersPanel.classList.remove("hidden");
        flashNotice("Add and select an AI provider to start building.");
        break;
      case "attachments":
        attachments = attachments.concat(msg.files);
        renderChips();
        break;
      case "codeContext":
        attachments.push(msg.name + " (code)");
        renderChips();
        break;
    }
  });

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

  vscode.postMessage({ type: "ready" });
})();
