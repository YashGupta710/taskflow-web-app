# ⬡ TaskFlow — Open Source Task Manager

> A lightweight, zero-dependency Kanban-style task manager built with vanilla HTML, CSS, and JavaScript. Manage your team's workflow directly in the browser — no backend required.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TaskFlow** is a browser-based Kanban task manager designed for individuals and small teams to organize their work into three clear stages: **To Do**, **In Progress**, and **Done**. It requires no installation, no server, and no database — all data is persisted via `localStorage`.

This project was built as part of the **Open Source Software** course and demonstrates key open-source principles: transparency, accessibility, modularity, and community-driven development.

---

## ✨ Features

- 📋 **Kanban Board** — Organize tasks across To Do, In Progress, and Done columns
- ➕ **Create / Edit / Delete Tasks** — Full CRUD functionality
- 🔴 **Priority Levels** — Low, Medium, and High with color-coded badges
- 🔍 **Live Search** — Filter tasks in real time by title, description, or assignee
- 📊 **Completion Ring** — Visual progress tracker showing task completion rate
- 👤 **Assignee Avatars** — Track who is responsible for each task
- 📅 **Due Dates** — Overdue tasks highlighted in red
- ➡️ **Quick Move** — Move tasks between columns without opening the edit modal
- 💾 **Persistent Storage** — All data saved in `localStorage` — survives page refresh
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- ♿ **Accessible** — Keyboard navigation supported (Esc to close, Ctrl+Enter to save)

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No Node.js, npm, or server required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/taskflow.git
   cd taskflow
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html          # macOS
   start index.html         # Windows
   xdg-open index.html      # Linux
   ```

   Or use VS Code's **Live Server** extension for a smoother dev experience.

That's it — no build step, no dependencies!

---

## 📁 Project Structure

```
taskflow/
├── index.html          # Main HTML — app shell and markup
├── css/
│   └── style.css       # Complete styles, design system, CSS variables
├── js/
│   └── app.js          # All application logic, state management, rendering
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

---

## 🎯 Usage

| Action | How |
|---|---|
| Create a task | Click **+ New Task** button |
| Edit a task | Hover over a card → click ✎ |
| Delete a task | Hover over a card → click ✕ |
| Move a task | Hover over a card → click **→ Status** |
| Search tasks | Type in the search bar (top right) |
| Filter by status | Click a category in the left sidebar |
| Save in modal | Click **Save Task** or press `Ctrl + Enter` |
| Close modal | Click **Cancel**, press `Esc`, or click outside |

---

## 🛠 Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript (ES6+) | App logic, DOM manipulation, state |
| localStorage API | Client-side data persistence |
| Google Fonts (Syne + DM Sans) | Typography |
| CSS Custom Properties | Design tokens / theming |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) spec for commit messages.

### Ideas for Contribution
- 🌓 Light/Dark mode toggle
- 🏷️ Tags and labels for tasks
- 📤 Export tasks as CSV or JSON
- 🔔 Due date reminders (Notification API)
- 🖱️ Drag-and-drop between columns
- 👥 Multi-user support via Firebase

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Built with ❤️ as part of the Open Source Software course project.

> *"The strength of open source is that you don't rely on one person to keep the lights on."*
> — Linus Torvalds
