// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { AlbumModel } from '../models/AlbumModel';

const router: Router = Router();

// Create a new album
router.post('/api/album', (req: Request, res: Response) => {
  return AlbumModel.createAlbum(req, res);
});

// Update an existing album
router.put('/api/album', (req: any, res: Response) => {
  return AlbumModel.updateAlbum(req, res);
});

// Get an album
router.get('/api/album', (req: any, res: Response) => {
  if ('id' in req.query || ('title' in req.query && 'artist' in req.query)) {
    return AlbumModel.getAlbum(req, res);
  }

  res.status(400);
  res.json('Missing required args: [id] or [title] & [artist]');
});

export default router;
