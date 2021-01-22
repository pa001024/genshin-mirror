import express from "express";
import bodyParser from "body-parser";

// Require API routes
import user from "./routes/user";

require("dotenv").config();

// Create express instance
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Import API Routes
app.use(user);

// error handle
app.use(function (err: any, _req: any, res: any, _next: any) {
  // res.header("Access-Control-Allow-Origin", "*");

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ code: 401, message: "unauthorized" });
  }
});

// Export express app
export default app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}
