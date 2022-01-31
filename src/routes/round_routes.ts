// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { RoundModel } from '../models/RoundModel';

const router: Router = Router();

// Create a new round
router.post('/api/round', (req: Request, res: Response) => {
  return RoundModel.createRound(req, res);
});

// Update an existing round
router.put('/api/round', (req: Request, res: Response) => {
  return RoundModel.updateRound(req, res);
});

// Delete an existing round
router.delete('/api/round', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return RoundModel.deleteRound(req, res);
});

// Get a round
router.get('/api/round', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return RoundModel.getRound(req, res);
});

// Get all rounds
router.get('/api/rounds', (req: Request, res: Response) => {
  return RoundModel.getAllRounds(res);
});

export default router;
