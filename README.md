# NodeExamples

Example Node.js server project using Fastify and Handlebars (hbs) structure.

---

## Project Structure
```bash
NodeExamples/             # Project root folder
├── public/               # Frontend assets (static files)
│   ├── scripts/          # JavaScript files
│   │   ├── footer.js
│   │   ├── header.js
│   │   └── main.js
│   │
│   └── style/            # CSS stylesheets
│       ├── footer.css
│       ├── header.css
│       └── main.css
│
├── source/               # Backend source code
│   ├── routes/           # Route definitions
│   │   └── home.js
│   │
│   └── app.js
│
├── views/                # Handlebars templates
│   ├── layouts/          # Main layout templates
│   │   └── main.hbs
│   │
│   ├── partials/         # Reusable partial templates
│   │   ├── header.hbs
│   │   └── footer.hbs
│   │
│   └── index.hbs
│
├── package.json          # Project dependencies and scripts
├── README.md             # This README file
├── server.js             # Server entry point, starts Fastify server
└── Structure.txt         # Project structure description
```

---

## Requirements

- Node.js
- npm (Node package manager)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/evandroluizvieira/NodeExamples
```
