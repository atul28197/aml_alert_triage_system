import { Router } from "express";
import { triageHandler } from "./triage.controller";

const router = Router();
console.log("Triage routes file loaded");

router.post("/triage", triageHandler);

export default router;