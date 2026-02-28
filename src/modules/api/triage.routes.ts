import { Router } from 'express';
import { triageHandler } from './triage.controller';

const router = Router();

router.post('/triage', triageHandler);

export default router;