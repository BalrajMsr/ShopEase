# ShopEase E-commerce Platform

ShopEase is a modern, full-featured e-commerce application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless shopping experience for users and a comprehensive dashboard for administrators.

## 🚀 Features

### User Features
- **Authentication**: Secure user registration and login with JWT.
- **Product Browsing**: Browse products with filtering and search capabilities.
- **Product Details**: View detailed product information, images, and reviews.
- **Shopping Cart**: Add items to cart, update quantities, and manage cart contents.
- **Wishlist**: Save favorite items for later.
- **Checkout**: Streamlined checkout process with shipping address management.
- **Order History**: View past orders and their status.
- **User Profile**: Manage personal information and password.

### Admin Features
- **Dashboard**: Overview of sales, orders, and user statistics.
- **Product Management**: Add, edit, and delete products.
- **Order Management**: View and update order statuses (Processing, Shipped, Delivered).
- **User Management**: View and manage users.

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Tailwind CSS, Vite.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Authentication**: JSON Web Tokens (JWT), bcryptjs.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/shopease.git
cd shopease
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Start the React development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or the port specified by Vite), and the server at `http://localhost:5000`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
