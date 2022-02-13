// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { ClubModel } from '../models/ClubModel';

const router: Router = Router();

// Create a club
router.post('/api/club', async (req: Request, res: Response): Promise<void> => {
  const createdClub: any = await ClubModel.create(req.body.name);
  res.json(createdClub);
});

// Update an existing club
router.put('/api/club', (req: Request, res: Response) => {
  return ClubModel.updateClub(req, res);
});

// Delete a club
router.delete('/api/club', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  const deletedClub: any = await ClubModel.delete(String(req.query.id));
  res.json(deletedClub);
});

// Get a club
router.get('/api/club', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  const foundClub: any = await ClubModel.get(String(req.query.id));
  res.json(foundClub);
});

// Get all clubs
router.get('/api/clubs', (req: Request, res: Response) => {
  return ClubModel.getAllClubs(res);
});

export default router;
