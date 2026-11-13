import { createApp } from "./app.js";

const port = process.env.PORT || 3000;
const app = createApp(() => process.env);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
