import { Request, Response } from 'express';
import { TriageService } from '../application/triage.service';

const triageService = new TriageService();

export async function triageHandler(req: Request, res: Response) {
  try {
    const input = req.body;

    const result = await triageService.triage(input);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      error: 'Unable to triage alert',
      details: error?.message || 'Unexpected error'
    });
  }
}