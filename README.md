# Blog API

## Description
A RESTful API for a blogging platform, allowing users to create, read, update, and delete blog posts and comments.

## Features
- Authentication
- CRUD operations
- MongoDB Integration

## Installation & Usage
```bash
# Clone the repository
- git clone https://github.com/WelldoneEsu/blog-api.git

# Navigate into the folder
- cd blog-api

# Install dependencies
- npm install

# Start development server
- npm run dev

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

## Author
- Welldone Esu


---

## ** 6. Frist Commit and push
```bash
- git add .
- git commit -m "feat: initial project setup with folder structure and README"
- git branch -M main
- git remote add origin https://github.com/WelldoneEsu/blog-api.git
- git push -u origin main

## Security
- Helmet for HTTP headers
- Rate limiting (300 req / 15 min / IP)
- XSS clean + Mongo sanitize
- CORS enabled
- Request validation via express-validator

## Endpoints

### Auth
- POST /api/auth/register – Register
- POST /api/auth/login – Login

### Posts
- GET /api/posts – Public list (pagination & filtering)
  - Query: page, limit, author, tags (comma-separated), from, to
  - Example: /api/posts?page=2&limit=5&tags=nodejs,express&from=2025-01-01
- GET /api/posts/:id – Public single
- POST /api/posts – Create (Auth)
- PUT /api/posts/:id – Update (Owner/Admin)
- DELETE /api/posts/:id – Delete (Owner/Admin)

### Comments
- POST /api/comments – Add comment (Auth) – body: { content, postId }
- GET /api/comments/post/:postId – List comments by post (Public)
- DELETE /api/comments/:id – Delete (Owner/Admin)

### Auth
- Send token in header: Authorization: Bearer <jwt>
-
