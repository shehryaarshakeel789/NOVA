# NOVA E-Commerce Platform 🚀

NOVA is a full-stack, modern E-Commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides a sleek, responsive user experience with real-time features and a powerful admin dashboard.

## 🌟 Features

- **Authentication**: Secure user and admin login/registration with JWT.
- **Product Management**: Browse products by category (Men, Women, Sale, New Arrivals).
- **Shopping Cart**: Add, remove, and manage items in the cart.
- **Order Processing**: Secure checkout process with Stripe integration.
- **Real-Time Support Chat**: Customers can chat directly with admins in real-time using Socket.io.
- **Admin Dashboard**: Comprehensive dashboard for admins to manage users, orders, promos, and handle live customer support chats.
- **Fully Automated Testing**: Robust test coverage across both frontend (Vitest) and backend (Jest).

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS & Shadcn UI
- Socket.io-client (Real-time chat)
- Vitest & React Testing Library (Testing)
- Recharts (Admin statistics)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io (Real-time WebSocket server)
- JWT (Authentication)
- Stripe (Payments)
- Jest & Supertest (Testing)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas URL)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/shehryaarshakeel789/NOVA.git
cd NOVA
```

### 2. Install Dependencies

You need to install dependencies for both the frontend (root directory) and the backend (`api` directory).

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install
cd ..
```

### 3. Environment Variables

You need to set up environment variables for both the frontend and backend. 

#### Backend (`api/.env`)
Create a `.env` file inside the `api` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
# Add other keys like Cloudinary/Email configs if required
```

#### Frontend (`.env`)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Running the Application

You need to run both the frontend and backend servers simultaneously.

**Start the Backend Server (Terminal 1):**
```bash
cd api
npm run dev
```
*The backend API will run on `http://localhost:5000`*

**Start the Frontend Server (Terminal 2):**
```bash
# Make sure you are in the root directory (NOVA/)
npm run dev
```
*The frontend application will be accessible at `http://localhost:5173`*

---

## 🧪 Testing

The project has comprehensive test suites for both frontend and backend.

**Run Frontend Tests (Vitest):**
```bash
npm run test
```

**Run Backend Tests (Jest):**
```bash
cd api
npm run test
```
*(Note: Backend tests use `mongodb-memory-server` to mock the database, so your real data is never affected.)*

---

## 👥 Roles & Permissions
- **User**: Can browse products, add to cart, place orders, and use the real-time chat widget.
- **Admin**: Can access `/admin/dashboard`, manage orders, users, promos, and handle all customer chats. 
