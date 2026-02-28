# DevHub GraphQL API

A production-grade GraphQL backend for a developer social platform. This API enables authentication, developer profiles, project management, and social interactions such as following developers and starring projects.

Built with Node.js, Express, Apollo Server, MongoDB, and modern GraphQL architecture practices including modular schema design and DataLoader optimization.

---

## Tech Stack

* Node.js
* Express 5
* Apollo Server 5
* GraphQL
* MongoDB with Mongoose
* JWT Authentication
* DataLoader for N+1 query optimization

### Key Libraries

* `@apollo/server`
* `@as-integrations/express5`
* `graphql`
* `mongoose`
* `jsonwebtoken`
* `bcrypt`
* `dataloader`
* `dotenv`
* `helmet`
* `cookie-parser`

---

## Features

### Authentication

* JWT-based authentication
* Signup and login
* Secure password hashing using bcrypt
* Authenticated context injection

### Developer Module

* Developer profile management
* Follow and unfollow developers
* Retrieve followers and following lists
* Fetch developer projects

### Project Module

* Create, update, and delete projects
* Star and unstar projects
* Fetch projects globally or by developer
* Resolve project owner and starred developers

### Performance Optimization

* DataLoader integration to eliminate N+1 query problem
* Batched and cached database access

---

## Architecture

The application follows a modular GraphQL architecture.

```
src/
│
├── modules/
│   ├── auth/
│   ├── developer/
│   └── project/
│
├── graphql/
│   ├── typeDefs.js
│   └── resolvers.js
│
│
├── config/
│
├── app.js
└── server.js
```

Each module contains:

* typeDefs
* resolvers
* model
* loader

This structure ensures scalability and separation of concerns.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd devhub-graphql-api
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/devhub
ACCESS_TOKEN_SECRET=your_secret_key
```

---

## Running the Server

```bash
npm start
```

Server runs at:

```
http://localhost:4000/graphql
```

---

## Database Seeding

Run seed script:

```bash
npm run seed
```

This creates sample developers, projects, follows, and stars.

---

## Example Queries

Fetch developers and projects:

```graphql
query {
  developers {
    id
    name
    projects {
      id
      title
    }
  }
}
```

Create project:

```graphql
mutation {
  createProject(input: {
    title: "GraphQL API"
    description: "Backend service"
  }) {
    id
    title
  }
}
```

---

## Security

* Password hashing with bcrypt
* JWT authentication with token rotation
* Helmet for HTTP security headers

---

## Performance

* DataLoader batching prevents redundant database queries
* Efficient resolver design
* Optimized MongoDB querying

---

## API Design Principles

* Modular schema structure
* Separation of concerns
* Scalable resolver architecture
* Optimized database access patterns

---

## License

MIT License
