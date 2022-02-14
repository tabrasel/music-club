// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { RoundModel } from '../models/RoundModel';

const router: Router = Router();

// Create a round
router.post('/api/round', async (req: Request, res: Response): Promise<void> => {
  const createdRound: any = await RoundModel.create(
    req.body.number,
    req.body.description,
    req.body.participantIds,
    req.body.startDate,
    req.body.endDate,
    req.body.picksPerParticipant
  );
  res.json(createdRound);
});

// Update a round
router.put('/api/round', async (req: Request, res: Response): Promise<void> => {
  const updatedRound: any = await RoundModel.update(String(req.query.id), req.body);
  res.json(updatedRound);
});

// Delete a round
router.delete('/api/round', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  const deletedRound: any = await RoundModel.delete(String(req.query.id));
  res.json(deletedRound);
});

// Get a round
router.get('/api/round', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  const foundRound: any = await RoundModel.get(String(req.query.id));
  res.json(foundRound);
});

// Get all rounds
router.get('/api/rounds', async (req: Request, res: Response): Promise<void> => {
  const allRounds: any[] = await RoundModel.getAll();
  res.json(allRounds);
});


export default router;
