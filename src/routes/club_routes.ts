// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { ClubModel } from '../models/ClubModel';

const router: Router = Router();

// Create a new club
router.post('/api/club', (req: Request, res: Response) => {
  return ClubModel.createClub(req, res);
});

// Update an existing club
router.put('/api/club', (req: Request, res: Response) => {
  return ClubModel.updateClub(req, res);
});

// Delete an existing club
router.delete('/api/club', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return ClubModel.deleteClub(req, res);
});

// Get a club
router.get('/api/club', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return ClubModel.getClub(req, res);
});

// Get all clubs
router.get('/api/clubs', (req: Request, res: Response) => {
  return ClubModel.getAllClubs(res);
});

export default router;
