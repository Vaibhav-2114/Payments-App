import express from "express";
import cors from "cors";
import { connecttoMongoDB } from "./database/db.js";
import userRouter from "./routes/userRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import friendRouter from "./routes/friendsRoutes.js";

export function createApp(getBindings) {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("hii there");
  });

  app.use("/api", async (req, res, next) => {
    const { MONGODB_URI, JWT_SECRET } = getBindings();

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    try {
      await connecttoMongoDB(MONGODB_URI);
      req.app.locals.JWT_SECRET = JWT_SECRET;
      next();
    } catch (error) {
      console.error("Database initialization failed:", error);
      res.status(503).json({ message: "Database unavailable" });
    }
  });

  app.use("/api/user", userRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/friends", friendRouter);

  return app;
}
