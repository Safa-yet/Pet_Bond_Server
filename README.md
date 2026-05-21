# 🐾 Pet Bond Server - Backend API

Backend server for the Pet Bond Pet Adoption Platform built with Express.js, MongoDB, and JWT Authentication.

---


# 🚀 Features

- 🔐 JWT Authentication
- 🍪 HTTPOnly Cookie Support
- 🐶 CRUD Operations for Pets
- 📋 Adoption Request Management
- ✅ Approve & Reject Adoption Requests
- 🔒 Protected Private APIs
- ⚡ MongoDB Aggregation & Filtering
- 🌍 Secure CORS Configuration

---

# 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT
- Cookie Parser
- CORS
- dotenv

---

# 📦 NPM Packages Used

```bash
npm install express
npm install mongodb
npm install cors
npm install dotenv
npm install jsonwebtoken
npm install cookie-parser
```

---

# 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3000
```

---

# 🔐 Authentication System

- JWT Token Generation
- HTTPOnly Cookie Storage
- Token Verification Middleware
- Protected Routes

---

# 📂 API Routes

## Auth Routes

| Method | Route              | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /jwt               | Generate JWT      |
| POST   | /logout            | Clear Cookie      |
| GET    | /api/auth/session  | Get User Session  |

---

## Pet Routes

| Method | Route            | Description       |
| ------ | ---------------- | ----------------- |
| GET    | /allpets         | Get All Pets      |
| GET    | /allpets/:id     | Get Single Pet    |
| POST   | /addpet          | Add New Pet       |
| PATCH  | /updatepet/:id   | Update Pet        |
| DELETE | /deletepet/:id   | Delete Pet        |

---

## Adoption Routes

| Method | Route                         | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | /adopt-request                | Submit Request         |
| GET    | /my-requests                  | Get User Requests      |
| PATCH  | /approve-request/:id          | Approve Request        |
| PATCH  | /reject-request/:id           | Reject Request         |
| DELETE | /cancel-request/:id           | Cancel Request         |

---

# 🔒 Security Features

- Secure MongoDB Credentials
- Protected APIs
- Cookie-Based Authentication
- CORS Protection
- Environment Variables

---

# ⚙️ Installation & Setup

Clone repository:

```bash
git clone https://github.com/your-username/pet-bond-server.git
```

Go to server folder:

```bash
cd pet-bond-server
```

Install packages:

```bash
npm install
```

Run server:

```bash
npm run start
```

For development:

```bash
npm run dev
```

---

# 🌍 Deployment

Frontend: Vercel

Backend: Render / Vercel

Database: MongoDB Atlas

---

# 👨‍💻 Developer

Developed by Safa ❤️
