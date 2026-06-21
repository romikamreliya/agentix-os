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
    const notice = document.createElement("div");
    notice.className = "bubble ai notice";
    notice.textContent = "⚠️ " + text;
    thread.appendChild(notice);
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

  // ---------- DOM helpers ----------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return /** @type {HTMLElement} */ (t.content.firstElementChild);
  }

  function spinnerCard(text) {
    return el('<div class="bubble ai"><div class="status"><span class="spinner"></span>' + escapeHtml(text) + "</div></div>");
  }

  // ---------- Questions card ----------
  function questionsCard(questions, onSubmit, submitLabel) {
    const card = el('<div class="bubble ai wf-card"><div class="label">❓ A few questions</div></div>');
    questions.forEach((q) => {
      const fs = el('<fieldset class="wf-q" data-qid="' + escapeHtml(q.id) + '"><legend>' + escapeHtml(q.text) + "</legend></fieldset>");
      q.options.forEach((opt, i) => {
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

  // ---------- Understanding editor ----------
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

  // ---------- Plan editor ----------
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

  // ---------- Approved summary badge ----------
  function approvedSummary(label, text) {
    return el('<div class="bubble ai wf-card approved"><div class="label">' + label + ' <span class="badge ok">Approved</span></div><p class="wf-summary muted">' + escapeHtml(text) + "</p></div>");
  }

  // ---------- Task tree (with statuses) ----------
  const STATUS_ICON = {
    "pending": "⏳",
    "in-progress": "🔄",
    "completed": "✅",
    "failed": "❌",
    "skipped": "⏭"
  };

  function taskTree(nodes, showStatus) {
    const ul = el('<ul class="task-tree"></ul>');
    nodes.forEach((node) => {
      const statusBadge = showStatus
        ? '<span class="task-status ' + escapeHtml(node.status) + '">' + (STATUS_ICON[node.status] || "") + " " + escapeHtml(node.status) + "</span>"
        : "";
      const errorText = node.error
        ? '<div class="task-error">⚠ ' + escapeHtml(node.error) + "</div>"
        : "";
      const li = el('<li><div class="task-node"><span class="task-title">' + escapeHtml(node.title) + " " + statusBadge + "</span>" +
        (node.requirement ? '<span class="task-req">↳ ' + escapeHtml(node.requirement) + "</span>" : "") +
        errorText + "</div></li>");
      if (node.children && node.children.length) li.appendChild(taskTree(node.children, showStatus));
      ul.appendChild(li);
    });
    return ul;
  }

  // ---------- Progress bar ----------
  function progressBar(tasks) {
    const flat = flattenTasks(tasks);
    const total = flat.length;
    const done = flat.filter((t) => t.status === "completed" || t.status === "failed" || t.status === "skipped").length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const container = el('<div class="progress-container"></div>');
    container.appendChild(el(
      '<div class="progress-label"><span>Progress</span><span>' + done + " / " + total + " tasks (" + pct + "%)</span></div>"
    ));
    container.appendChild(el(
      '<div class="progress-bar"><div class="progress-fill" style="width: ' + pct + '%"></div></div>'
    ));
    return container;
  }

  function flattenTasks(tasks) {
    const result = [];
    for (const t of tasks) {
      // Only count leaf tasks (no children)
      if (!t.children || t.children.length === 0) {
        result.push(t);
      } else {
        result.push(...flattenTasks(t.children));
      }
    }
    return result;
  }

  // ---------- Diff viewer ----------
  function diffViewer(changes) {
    const container = el('<div class="bubble ai wf-card"><div class="label">📝 Proposed changes</div></div>');

    changes.forEach((change) => {
      const viewer = el('<div class="diff-viewer"></div>');
      const header = el(
        '<div class="diff-header">' +
        '<span class="diff-op ' + escapeHtml(change.operation) + '">' + escapeHtml(change.operation.toUpperCase()) + "</span>" +
        '<span class="diff-path">' + escapeHtml(change.filePath) + "</span>" +
        (change.newPath ? ' → <span class="diff-path">' + escapeHtml(change.newPath) + "</span>" : "") +
        "</div>"
      );
      viewer.appendChild(header);

      if (change.diff) {
        const body = el('<div class="diff-body"><pre></pre></div>');
        const pre = body.querySelector("pre");
        change.diff.split("\n").forEach((line) => {
          const span = document.createElement("span");
          span.style.display = "block";
          if (line.startsWith("+")) {
            span.className = "diff-line-add";
          } else if (line.startsWith("-")) {
            span.className = "diff-line-del";
          } else if (line.startsWith("@@")) {
            span.className = "diff-line-hdr";
          } else {
            span.className = "diff-line-ctx";
          }
          span.textContent = line;
          pre.appendChild(span);
        });
        viewer.appendChild(body);
      } else if (change.content && change.operation === "create") {
        const body = el('<div class="diff-body"><pre></pre></div>');
        const pre = body.querySelector("pre");
        change.content.split("\n").forEach((line) => {
          const span = document.createElement("span");
          span.style.display = "block";
          span.className = "diff-line-add";
          span.textContent = "+" + line;
          pre.appendChild(span);
        });
        viewer.appendChild(body);
      }

      container.appendChild(viewer);
    });

    return container;
  }

  // ---------- Completion summary ----------
  function completionSummary(summary) {
    const card = el('<div class="bubble ai wf-card"><div class="label">🎉 Workflow Complete</div></div>');

    if (summary.completedTasks.length) {
      const sec = el('<div class="summary-section"><h4>✅ Completed Tasks <span class="summary-count">' + summary.completedTasks.length + "</span></h4></div>");
      sec.appendChild(el('<ul class="summary-list success">' + summary.completedTasks.map((t) => "<li>" + escapeHtml(t) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    if (summary.failedTasks.length) {
      const sec = el('<div class="summary-section"><h4>❌ Failed Tasks <span class="summary-count">' + summary.failedTasks.length + "</span></h4></div>");
      sec.appendChild(el('<ul class="summary-list danger">' + summary.failedTasks.map((t) => "<li>" + escapeHtml(t) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    if (summary.skippedTasks.length) {
      const sec = el('<div class="summary-section"><h4>⏭ Skipped Tasks <span class="summary-count">' + summary.skippedTasks.length + "</span></h4></div>");
      sec.appendChild(el('<ul class="summary-list warning">' + summary.skippedTasks.map((t) => "<li>" + escapeHtml(t) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    if (summary.createdFiles.length) {
      const sec = el('<div class="summary-section"><h4>📄 Created Files <span class="summary-count">' + summary.createdFiles.length + "</span></h4></div>");
      sec.appendChild(el('<ul class="summary-list info">' + summary.createdFiles.map((f) => '<li class="summary-file">' + escapeHtml(f) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    if (summary.modifiedFiles.length) {
      const sec = el('<div class="summary-section"><h4>✏️ Modified Files <span class="summary-count">' + summary.modifiedFiles.length + "</span></h4></div>");
      sec.appendChild(el('<ul class="summary-list info">' + summary.modifiedFiles.map((f) => '<li class="summary-file">' + escapeHtml(f) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    if (summary.deletedFiles.length) {
      const sec = el('<div class="summary-section"><h4>🗑 Deleted Files <span class="summary-count">' + summary.deletedFiles.length + "</span></h4></div>");
      sec.appendChild(el('<ul class="summary-list danger">' + summary.deletedFiles.map((f) => '<li class="summary-file">' + escapeHtml(f) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    if (summary.recommendations.length) {
      const sec = el('<div class="summary-section"><h4>💡 Recommendations</h4></div>');
      sec.appendChild(el('<ul class="summary-list">' + summary.recommendations.map((r) => "<li>" + escapeHtml(r) + "</li>").join("") + "</ul>"));
      card.appendChild(sec);
    }

    return card;
  }

  // ---------- Action rows ----------
  function actionsRow(buttons) {
    const row = el('<div class="plan-actions"></div>');
    buttons.forEach((b) => {
      const btn = el('<button class="btn ' + (b.primary ? "primary" : "") + " " + (b.cls || "") + '">' + escapeHtml(b.label) + "</button>");
      btn.addEventListener("click", b.onClick);
      row.appendChild(btn);
    });
    return row;
  }

  // ---------- Main workflow renderer ----------
  function renderWorkflow() {
    const isBusy = !!session && (
      session.state === "analyzing" ||
      session.state === "creating" ||
      session.state === "generating-tasks"
    );
    busy = isBusy;
    thread.innerHTML = "";

    if (!session) {
      emptyState.classList.remove("hidden");
      composer.style.display = "";
      syncSendState();
      return;
    }
    emptyState.classList.add("hidden");

    // Prompt bubble
    thread.appendChild(el('<div class="bubble user">' + escapeHtml(session.prompt) + "</div>"));

    // ===== Phase 1: Understanding =====
    if (session.stage === "understanding") {
      if (session.state === "analyzing") {
        thread.appendChild(spinnerCard("Analyzing your request…"));
      } else if (session.state === "questions") {
        thread.appendChild(understandingEditor(session.understanding, false));
        if (session.understandingQuestions && session.understandingQuestions.length) {
          thread.appendChild(
            questionsCard(session.understandingQuestions, (answers) => {
              vscode.postMessage({ type: "answerUnderstanding", answers });
            }, "Submit answers")
          );
        }
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

    // Understanding is approved beyond this point
    thread.appendChild(approvedSummary("🧠 Understanding", session.understanding.summary));

    // ===== Phase 2: Planning =====
    if (session.stage === "planning") {
      if (session.state === "creating") {
        thread.appendChild(spinnerCard("Creating the project plan…"));
      } else if (session.state === "questions") {
        thread.appendChild(planEditor(session.plan, false));
        if (session.planQuestions && session.planQuestions.length) {
          thread.appendChild(
            questionsCard(session.planQuestions, (answers) => {
              vscode.postMessage({ type: "answerPlan", answers });
            }, "Submit answers")
          );
        }
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

    // Plan is approved beyond this point
    thread.appendChild(approvedSummary("📋 Plan", session.plan.steps.length + " steps approved"));

    // ===== Phase 3: Task Generation =====
    if (session.stage === "tasks") {
      if (session.state === "generating-tasks") {
        thread.appendChild(spinnerCard("Generating tasks from the plan…"));
      } else if (session.state === "reviewing-tasks") {
        const tasksCard = el('<div class="bubble ai wf-card"><div class="label">📋 Generated Tasks — Review before execution</div></div>');
        tasksCard.appendChild(taskTree(session.tasks, true));
        tasksCard.appendChild(
          actionsRow([
            { label: "Approve & start execution", primary: true, onClick: () => vscode.postMessage({ type: "approveTasks" }) },
          ])
        );
        thread.appendChild(tasksCard);
      }
      scrollToBottom();
      composer.style.display = "none";
      return;
    }

    // ===== Phase 4: Execution =====
    if (session.stage === "execution") {
      // Progress bar
      thread.appendChild(progressBar(session.tasks));

      // Task tree with live statuses
      const tasksCard = el('<div class="bubble ai wf-card"><div class="label">🚀 Execution</div></div>');
      tasksCard.appendChild(taskTree(session.tasks, true));

      // Execution controls
      if (session.state !== "awaiting-approval") {
        const controls = el('<div class="exec-controls"></div>');
        if (session.executionControl === "running" || session.state === "executing") {
          const pauseBtn = el('<button class="btn">⏸ Pause</button>');
          pauseBtn.addEventListener("click", () => vscode.postMessage({ type: "pauseExecution" }));
          controls.appendChild(pauseBtn);

          if (session.currentTaskId) {
            const skipBtn = el('<button class="btn">⏭ Skip task</button>');
            skipBtn.addEventListener("click", () => vscode.postMessage({ type: "skipTask" }));
            controls.appendChild(skipBtn);
          }
        } else if (session.state === "paused") {
          const resumeBtn = el('<button class="btn primary">▶ Resume</button>');
          resumeBtn.addEventListener("click", () => vscode.postMessage({ type: "resumeExecution" }));
          controls.appendChild(resumeBtn);
        }

        // Retry buttons for failed tasks
        const flat = flattenTasks(session.tasks);
        flat.filter((t) => t.status === "failed" || t.status === "skipped").forEach((t) => {
          const retryBtn = el('<button class="btn">🔄 Retry: ' + escapeHtml(t.title.slice(0, 30)) + "</button>");
          retryBtn.addEventListener("click", () => vscode.postMessage({ type: "retryTask", taskId: t.id }));
          controls.appendChild(retryBtn);
        });

        tasksCard.appendChild(controls);
      }
      thread.appendChild(tasksCard);

      // Pending changes preview
      if (session.state === "awaiting-approval" && session.pendingChanges && session.pendingChanges.length) {
        thread.appendChild(diffViewer(session.pendingChanges));
        thread.appendChild(
          actionsRow([
            { label: "✅ Approve changes", primary: true, onClick: () => vscode.postMessage({ type: "approveChanges" }) },
            { label: "❌ Reject changes", cls: "danger", onClick: () => vscode.postMessage({ type: "rejectChanges" }) }
          ])
        );
      }

      scrollToBottom();
      composer.style.display = "none";
      return;
    }

    // ===== Phase 5: Completed =====
    if (session.stage === "completed") {
      // Final task tree
      const tasksCard = el('<div class="bubble ai wf-card"><div class="label">✅ All Tasks</div></div>');
      tasksCard.appendChild(taskTree(session.tasks, true));
      thread.appendChild(tasksCard);

      // Completion summary
      if (session.summary) {
        thread.appendChild(completionSummary(session.summary));
      }

      composer.style.display = "";
      promptEl.placeholder = "Start a new build…";
      syncSendState();
      scrollToBottom();
      return;
    }

    // Fallback
    composer.style.display = "";
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
