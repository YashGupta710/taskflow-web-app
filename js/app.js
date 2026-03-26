/* ============================================
   TASKFLOW — Open Source Task Manager
   app.js — Core Application Logic
   ============================================ */

'use strict';

// ── STATE ─────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
let editingId = null;
let activeFilter = 'all';
let searchQuery = '';

// ── UTILITY ───────────────────────────────────
const uid = () => '_' + Math.random().toString(36).slice(2, 9);
const save = () => localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
const qs = (sel, el = document) => el.querySelector(sel);
const $ = id => document.getElementById(id);

// ── DOM REFS ──────────────────────────────────
const modalOverlay = $('modal-overlay');
const openModalBtn = $('open-modal-btn');
const modalClose = $('modal-close');
const cancelBtn = $('cancel-btn');
const saveTaskBtn = $('save-task-btn');
const searchInput = $('search-input');

// ── MODAL HELPERS ─────────────────────────────
function openModal(task = null) {
  editingId = task ? task.id : null;
  $('modal-title').textContent = task ? 'Edit Task' : 'New Task';
  $('task-title').value = task?.title || '';
  $('task-desc').value = task?.desc || '';
  $('task-priority').value = task?.priority || 'medium';
  $('task-status').value = task?.status || 'todo';
  $('task-assignee').value = task?.assignee || '';
  $('task-due').value = task?.due || '';
  modalOverlay.classList.add('open');
  $('task-title').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  editingId = null;
}

// ── CRUD ──────────────────────────────────────
function saveTask() {
  const title = $('task-title').value.trim();
  if (!title) { $('task-title').focus(); shake($('task-title')); return; }

  const taskData = {
    title,
    desc: $('task-desc').value.trim(),
    priority: $('task-priority').value,
    status: $('task-status').value,
    assignee: $('task-assignee').value.trim(),
    due: $('task-due').value,
    createdAt: editingId ? null : Date.now()
  };

  if (editingId) {
    const idx = tasks.findIndex(t => t.id === editingId);
    if (idx !== -1) tasks[idx] = { ...tasks[idx], ...taskData };
    toast('Task updated ✓');
  } else {
    tasks.push({ id: uid(), ...taskData });
    toast('Task created ✓');
  }

  save();
  closeModal();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
  toast('Task deleted');
}

function moveTask(id, newStatus) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.status = newStatus; save(); render(); toast('Moved to ' + labelOf(newStatus)); }
}

// ── RENDER ────────────────────────────────────
function getFiltered() {
  return tasks.filter(t => {
    const matchFilter = activeFilter === 'all' || t.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q) || (t.assignee || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

function render() {
  const filtered = getFiltered();

  ['todo', 'inprogress', 'done'].forEach(status => {
    const list = $('list-' + status);
    const cards = filtered.filter(t => t.status === status);
    list.innerHTML = cards.length ? cards.map(cardHTML).join('') : '<div class="empty-col"></div>';
  });

  updateCounts();
  updateRing();

  // wire card buttons
  document.querySelectorAll('[data-id]').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.edit-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      openModal(tasks.find(t => t.id === id));
    });
    card.querySelector('.del-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      deleteTask(id);
    });
    // move buttons
    card.querySelectorAll('.move-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        moveTask(id, btn.dataset.target);
      });
    });
  });
}

function cardHTML(t) {
  const initials = t.assignee ? t.assignee.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';
  const dueStr = t.due ? formatDue(t.due) : '';
  const isOverdue = t.due && new Date(t.due) < new Date() && t.status !== 'done';

  const moveOpts = ['todo', 'inprogress', 'done']
    .filter(s => s !== t.status)
    .map(s => `<button class="card-btn move-btn" data-target="${s}" title="Move to ${labelOf(s)}">→ ${labelOf(s)}</button>`)
    .join('');

  return `
    <div class="task-card" data-id="${t.id}">
      <div class="card-top">
        <div class="card-title">${escHtml(t.title)}</div>
        <div class="card-actions">
          ${moveOpts}
          <button class="card-btn edit-btn" title="Edit">✎</button>
          <button class="card-btn del del-btn" title="Delete">✕</button>
        </div>
      </div>
      ${t.desc ? `<p class="card-desc">${escHtml(t.desc)}</p>` : ''}
      <div class="card-meta">
        <span class="priority-tag priority-${t.priority}">${t.priority}</span>
        ${initials ? `<span class="card-assignee"><span class="avatar">${initials}</span>${escHtml(t.assignee)}</span>` : ''}
        ${dueStr ? `<span class="card-due ${isOverdue ? 'overdue' : ''}">${dueStr}</span>` : ''}
      </div>
    </div>`;
}

function updateCounts() {
  $('count-all').textContent = tasks.length;
  $('count-todo').textContent = tasks.filter(t => t.status === 'todo').length;
  $('count-inprogress').textContent = tasks.filter(t => t.status === 'inprogress').length;
  $('count-done').textContent = tasks.filter(t => t.status === 'done').length;
}

function updateRing() {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const circumference = 163.36;
  $('ring-fill').style.strokeDashoffset = circumference - (circumference * pct / 100);
  $('ring-pct').textContent = pct + '%';
}

// ── HELPERS ───────────────────────────────────
function labelOf(status) {
  return { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }[status] || status;
}

function formatDue(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function shake(el) {
  el.style.animation = 'none';
  el.getBoundingClientRect();
  el.style.animation = 'shake 0.3s ease';
  el.style.borderColor = 'var(--priority-high)';
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 600);
}

// ── TOAST ─────────────────────────────────────
function toast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── EVENTS ────────────────────────────────────
openModalBtn.addEventListener('click', () => openModal());
modalClose.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
saveTaskBtn.addEventListener('click', saveTask);

modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && modalOverlay.classList.contains('open')) saveTask();
});

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    $('page-title').textContent = btn.textContent.replace(/[◈○◑●]/g, '').replace(/\d+/g, '').trim();
    render();
  });
});

// ── SEED DATA (first run) ─────────────────────
if (!tasks.length) {
  tasks = [
    { id: uid(), title: 'Set up project repository', desc: 'Initialize GitHub repo with MIT license and .gitignore', priority: 'high', status: 'done', assignee: 'Alice Roy', due: '', createdAt: Date.now() },
    { id: uid(), title: 'Design database schema', desc: 'Define tables for users, tasks, and activity logs', priority: 'high', status: 'inprogress', assignee: 'Bob Sharma', due: '', createdAt: Date.now() },
    { id: uid(), title: 'Build REST API endpoints', desc: 'CRUD operations for task management', priority: 'high', status: 'inprogress', assignee: 'Alice Roy', due: '', createdAt: Date.now() },
    { id: uid(), title: 'Write unit tests', desc: 'Achieve 80%+ code coverage using Jest', priority: 'medium', status: 'todo', assignee: 'Carol Das', due: '', createdAt: Date.now() },
    { id: uid(), title: 'Create project documentation', desc: 'README, API docs, and contribution guide', priority: 'medium', status: 'todo', assignee: 'Bob Sharma', due: '', createdAt: Date.now() },
    { id: uid(), title: 'Deploy to production', desc: 'Set up CI/CD pipeline and deploy to Vercel', priority: 'low', status: 'todo', assignee: 'Carol Das', due: '', createdAt: Date.now() },
  ];
  save();
}

// ── INIT ──────────────────────────────────────
render();
