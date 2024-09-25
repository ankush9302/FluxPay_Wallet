

---

# **FluxPay - Digital Wallet Application**

**FluxPay** is a full-stack digital wallet application that allows users to manage their finances online. With FluxPay, users can securely deposit funds, transfer money to other users, and keep track of their transaction history. It integrates the Razorpay payment gateway for real-time payments and ensures security with JWT-based authentication.

## **Features**

- **User Authentication**: Secure login and signup with JWT tokens.
- **Deposit Funds**: Users can add funds to their wallets using Razorpay.
- **Transfer Funds**: Users can send money to other registered users in real time.
- **Transaction History**: Complete view of deposits, transfers, and requests.
- **Fund Requests**: Users can request money from others and accept/reject requests.
- **Razorpay Integration**: Real-time payments and payment verification via Razorpay.
- **Secure Payment Verification**: Payment verification using Razorpay signature verification.
- **Atomic Transactions**: Ensuring funds are only transferred when the process is complete.

## **Tech Stack**

- **Frontend**: React, Ant Design
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Payment Gateway**: Razorpay

## **Project Structure**

```
fluxpay/
│
├── client/                     # Frontend code
│   ├── src/
│   │   ├── components/          # Common UI components (e.g., PageTitle)
│   │   ├── pages/               # Pages (e.g., Login, Home, Transactions)
│   │   ├── apicalls/            # Axios calls for backend communication
│   │   ├── redux/               # Redux store for state management
│   │   └── App.js               # Main App component
│   └── public/                  # Public assets (e.g., index.html)
│
├── server/                      # Backend code
│   ├── models/                  # MongoDB schemas (e.g., User, Transaction)
│   ├── routes/                  # API routes (e.g., users, transactions)
│   ├── config/                  # DB and environment configurations
│   └── server.js                # Main Express app
│
└── .env                         # Environment variables (e.g., Razorpay keys, JWT secret)
```

## **Installation**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fluxpay.git
```

2. Navigate to the project directory:

```bash
cd fluxpay
```

3. Install dependencies for both the **client** and **server**:

```bash
# In the root directory, install server dependencies
npm install

# Move into the client directory and install dependencies
cd client
npm install
```

4. Create a `.env` file in the **server** directory and add the following environment variables:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

5. Start the application:

```bash
# Run the backend server
npm run dev

# Run the frontend (in a separate terminal window)
cd client
npm start
```

## **Usage**

### **Depositing Funds**
- Users can deposit funds into their wallet using the integrated Razorpay payment gateway.
- Once payment is processed, the user’s balance is updated and stored in the MongoDB database.

### **Transferring Funds**
- Users can securely transfer money to other registered users.
- Both the sender’s and receiver’s balances are updated using MongoDB’s atomic transactions to ensure the integrity of the transfer.

### **Viewing Transaction History**
- Users can view all of their transactions, including deposits and transfers, with timestamps.

### **Requesting Funds**
- Users can request money from other registered users. The request can either be accepted or rejected by the receiver.

## **API Endpoints**

### **User Routes**
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Log in with email and password

### **Transaction Routes**
- `POST /api/transactions/create-order` - Create a Razorpay order for payment
- `POST /api/transactions/verify-payment` - Verify Razorpay payment and update user balance
- `POST /api/transactions/transfer-funds` - Transfer funds between users
- `POST /api/transactions/get-all-transactions-by-user` - Get all transactions of a user

### **Request Routes**
- `POST /api/requests/create` - Create a new request
- `POST /api/requests/update-status` - Update the status of a request (accept/reject)
- `POST /api/requests/get-all-requests-by-user` - Get all requests of a user

## **Razorpay Integration**

Razorpay is integrated to handle real-time payments:
1. Users initiate a payment through the **deposit** feature.
2. The backend generates an order using Razorpay’s API.
3. After successful payment, Razorpay returns a signature, which is verified in the backend to ensure the payment is legitimate.
4. Once verified, the user’s balance is updated accordingly.

## **Security**

- **JWT Authentication**: JSON Web Tokens are used for secure authentication, ensuring only logged-in users can access certain routes.
- **Password Hashing**: User passwords are securely hashed before being stored in the database using bcrypt.
- **Razorpay Payment Verification**: The backend verifies every transaction using Razorpay’s signature-based verification process.

## **Future Improvements**

- **Enhanced User Experience**: Adding more features like notifications and reports for users to track their spending and earnings.
- **Multi-Currency Support**: Extending the platform to support multiple currencies for a global user base.
- **Mobile App**: Developing a mobile app version of FluxPay for better accessibility.

## **Conclusion**

FluxPay is a secure and efficient digital wallet application that handles payments, fund transfers, and requests in real time. It demonstrates strong skills in **full-stack development**, **payment gateway integration**, and **security practices**. 

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
