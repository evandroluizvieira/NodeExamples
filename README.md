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
│       ├── main.css
│       └── user-form.css
│
├── source/               # Backend source code
│   ├── database/         # Database client abstraction and implementation
│   │   ├── Client.js
│   │   ├── ClientMongoDB.js
│   │   └── index.js
│   │
│   ├── models/           # User model and database interface
│   │   ├── User.js
│   │   ├── UserBase.js
│   │   └── UserMongoDB.js
│   │
│   ├── routes/           # Route definitions
│   │   ├── home.js
│   │   └── user.js
│   │
│   └── app.js            # App initialization
│
├── views/                # Handlebars templates
│   ├── layouts/          # Main layout templates
│   │   └── main.hbs
│   │
│   ├── pages/            # Page templates
│   │   ├── user-form.hbs
│   │   └── index.hbs
│   │
│   └── partials/         # Reusable partial templates
│       ├── header.hbs
│       └── footer.hbs
│
├── .env                  # Environment variables
├── LICENSE               # Project license
├── package.json          # Project dependencies and scripts
├── README.md             # This README file
├── server.js             # Server entry point, starts Fastify server
└── Structure.txt         # Project structure description
```

---

## Requirements

- Node.js
- npm (Node package manager)
		"handlebars": "^4.7.8",
		"mongodb": "^6.17.0",
		"dotenv": "^17.2.0"
---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/evandroluizvieira/NodeExamples.git
   ```

2. Navigate into the project directory:

   ```bash
   cd NodeExamples
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root with the necessary environment variables. For example:

   ```
   MONGODB_URI=mongodb://localhost:27017/mydatabase
   PORT=3000
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open your browser and go to:

   ```
   http://localhost:3000
   ```

---

