import express from "express";
import fileUpload from "express-fileupload";
import authRoutes from "./routes/authRoute";
import adminRoutes from "./routes/adminRoute";
import connectDB from "./utils/connectDB";
import dotenv from "dotenv";

dotenv.config(); // Load env first

const app = express();

// Middleware
app.use(express.json());

// Enable file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });

export default app;
