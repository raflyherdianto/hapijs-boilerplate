# 🚀 Backend Capstone Project

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Hapi.js-F58220?style=for-the-badge&logo=hapi&logoColor=white" alt="Hapi.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

<div align="center">
  <h3>🛍️ A Modern E-commerce Backend API built with Hapi.js</h3>
  <p>Complete REST API for managing users, items, and transactions with authentication & authorization</p>
</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#️-configuration)
- [📊 Database](#-database)
- [🔐 Authentication](#-authentication)
- [📡 API Endpoints](#-api-endpoints)
- [🔧 Available Scripts](#-available-scripts)
- [🐳 Development](#-development)
- [📝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

This is a comprehensive backend API for an e-commerce platform built with **Hapi.js** framework. The application provides complete CRUD operations for users, items, and transactions with robust authentication and authorization mechanisms.

### Key Highlights:
- 🔒 **Secure Authentication** with JWT tokens
- 👥 **Role-based Authorization** (Admin/User)
- 🛒 **Complete E-commerce Features** (Items, Transactions, Users)
- 🗄️ **PostgreSQL Database** with Sequelize ORM
- 🚀 **RESTful API Design** with proper HTTP methods
- 📝 **Comprehensive Logging** and error handling
- 🔄 **Database Migrations & Seeders**

## ✨ Features

### 👤 User Management
- ✅ User registration and login
- ✅ Profile management
- ✅ Role-based access control
- ✅ Secure password hashing

### 🛍️ Item Management
- ✅ Create, read, update, delete items
- ✅ Public item listing
- ✅ Admin-only item management
- ✅ Detailed item information

### 💳 Transaction System
- ✅ Checkout and transaction creation
- ✅ Transaction status management
- ✅ Transaction history
- ✅ Admin transaction oversight

### 🔐 Security Features
- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ CORS configuration
- ✅ Role-based route protection

## 🏗️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | Latest LTS |
| **Hapi.js** | Web Framework | ^21.4.0 |
| **PostgreSQL** | Database | ^8.16.0 |
| **Sequelize** | ORM | ^6.37.7 |
| **JWT** | Authentication | ^9.0.2 |
| **bcryptjs** | Password Hashing | ^3.0.2 |
| **dotenv** | Environment Variables | ^16.5.0 |

## 📁 Project Structure

```
backend-capstone/
├── 📁 config/                 # Configuration files
│   └── index.js              # Main app configuration
├── 📁 controllers/           # Route handlers
│   ├── AuthController.js     # Authentication logic
│   ├── UserController.js     # User management
│   ├── ItemController.js     # Item management
│   └── TransactionController.js # Transaction logic
├── 📁 middleware/            # Custom middleware
│   └── auth.js              # Authentication middleware
├── 📁 models/               # Database models
│   └── index.js            # Sequelize initialization
├── 📁 routes/              # API routes
│   ├── index.js           # Route aggregator
│   ├── authRoutes.js      # Authentication routes
│   ├── userRoutes.js      # User routes
│   ├── itemRoutes.js      # Item routes
│   └── transactionRoutes.js # Transaction routes
├── 📁 migrations/          # Database migrations
├── 📁 seeders/            # Database seeders
├── 📄 server.js           # Application entry point
├── 📄 package.json        # Dependencies & scripts
└── 📄 .env.example        # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- 📦 **Node.js** (v16+ recommended)
- 🐘 **PostgreSQL** (v12+ recommended)
- 📦 **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-capstone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create database**
   ```bash
   npm run db:create
   ```

5. **Run migrations and seeders**
   ```bash
   npm run db:migrate
   npm run db:seed:specific
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

🎉 **Server will be running at** `http://localhost:3000`

## ⚙️ Configuration

Configure your application by setting these environment variables in your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=backend_capstone
DB_HOST=127.0.0.1
DB_PORT=5433
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h
```

## 📊 Database

The application uses **PostgreSQL** with **Sequelize ORM** for data management.

### Available Database Commands:

```bash
# Create database
npm run db:create

# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:undo

# Run seeders
npm run db:seed:specific

# Fresh database setup
npm run db:fresh

# Reset database
npm run db:reset
```

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication:

1. **Register** or **Login** to get a JWT token
2. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### User Roles:
- 👤 **User**: Can manage own profile and create transactions
- 👑 **Admin**: Full access to all resources

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new user | ❌ |
| `POST` | `/login` | User login | ❌ |
| `POST` | `/logout` | User logout | ❌ |

### 👤 Users
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `GET` | `/users` | Get all users | ✅ | ✅ |
| `POST` | `/users` | Create user | ✅ | ✅ |
| `GET` | `/users/{id}` | Get user by ID | ✅ | ❌ |
| `PUT` | `/users/{id}` | Update user | ✅ | ❌ |
| `DELETE` | `/users/{id}` | Delete user | ✅ | ✅ |

### 🛍️ Items
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `GET` | `/items` | Get all items | ❌ | ❌ |
| `POST` | `/items` | Create item | ✅ | ✅ |
| `GET` | `/items/{id}` | Get item by ID | ❌ | ❌ |
| `PUT` | `/items/{id}` | Update item | ✅ | ✅ |
| `DELETE` | `/items/{id}` | Delete item | ✅ | ✅ |

### 💳 Transactions
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `GET` | `/transactions` | Get all transactions | ✅ | ❌ |
| `POST` | `/transactions` | Create transaction (checkout) | ✅ | ❌ |
| `GET` | `/transactions/{id}` | Get transaction by ID | ✅ | ❌ |
| `PUT` | `/transactions/{id}/status` | Update transaction status | ✅ | ✅ |

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Run database seeders |
| `npm run db:fresh` | Fresh database setup |
| `npm run db:reset` | Reset database |
| `npm run make:resource` | Generate new resource |

## 🐳 Development

### Development Workflow:

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make changes** to your code
3. **Server automatically restarts** thanks to nodemon
4. **Test your endpoints** using tools like Postman or curl

### Creating New Resources:

```bash
npm run make:resource ResourceName
```

This will generate controller, model, routes, and migration files for your new resource.

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔁 **Open** a Pull Request

### Development Guidelines:
- ✅ Follow existing code style
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Ensure all tests pass

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by <strong>Backend Capstone Team</strong></p>
  <p>
    <a href="#-table-of-contents">⬆️ Back to Top</a>
  </p>
</div>
