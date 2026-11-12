import express from "express";
import { connecttoMongoDB } from "./database/db.js";
import userRouter from "./routes/userRoutes.js";
import accountRouter from "./routes/accountRoutes.js"
import cors from "cors";
import friendRouter from "./routes/friendsRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = process.env.PORT || 3000;

await connecttoMongoDB();

app.get("/", (req, res) => {
  res.send("hii there");
});

app.use("/api/user", userRouter);
app.use("/api/account", accountRouter)
app.use("/api/friends", friendRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app };
