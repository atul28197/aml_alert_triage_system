import express from "express";
import amlRoutes from "./modules/api/triage.routes";
export const app = express();


app.use(express.json({ limit: '1mb' }));


app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

// Register AML routes
app.use('/api', amlRoutes);