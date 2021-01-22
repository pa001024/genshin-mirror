import express from "express";

// Require API routes
import users from "./routes/user";

// Create express instance
const app = express();

// Import API Routes
app.use(users);

// Export express app
export default app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}
