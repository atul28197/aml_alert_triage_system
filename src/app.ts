import express from "express";
import amlRoutes from './modules/api/triage.routes';
export const app = express();


app.use(express.json({ limit: '1mb' }));



// 👇 ADD DEBUG MIDDLEWARE HERE
// app.use((req, _res, next) => {
//   console.log("Incoming:", req.method, req.url);
//   next();
// });


app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

// console.log("amlRoutes:", amlRoutes);
// console.log("Mounting AML Routes");

// Register AML routes
app.use('/api', amlRoutes);