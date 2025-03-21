const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); 
const cors = require("cors"); // ✅ Import CORS
const { connect } = require("./config/database");
const { isLogin } = require("./middlewares/isLogin"); 

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());  
app.use(cookieParser());  

// ✅ Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies/auth headers
}));

// ✅ Allow credentials (fixes CORS errors)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// ✅ Connect to MongoDB
connect();

// ✅ Import Routes
const authRegister = require("./routes/authUser");
const messageRouter = require("./routes/messageRoute");
const userRouter = require("./routes/userRoute");

// ✅ Use Routes
app.use("/api/user", authRegister);
app.use("/api/message", isLogin, messageRouter);
app.use("/api/user", isLogin, userRouter);

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("Server is working");
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;  // Changed default to 4000
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
