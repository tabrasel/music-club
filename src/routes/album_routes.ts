// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { AlbumModel } from '../models/AlbumModel';

const router: Router = Router();

// Create a new album
router.post('/api/album', (req: Request, res: Response): void => {
  if (!('spotifyId' in req.body)) {
    res.status(400);
    res.send('Bad request. Missing arg: spotifyId');
    return;
  }

  if (!('posterId' in req.body)) {
    res.status(400);
    res.send('Bad request. Missing arg: posterId');
    return;
  }

  AlbumModel.create(req.body.spotifyId, req.body.posterId)
    .then((createdAlbum: any) => {
      res.json(createdAlbum);
    })
    .catch((err: any): void => {
      res.status(err.response.status || 500).send({
        error: {
          status: err.response.status || 500,
          message: err.response.statusText || 'Internal server error',
        }
      });
    });
});

// Update an existing album
router.put('/api/album', (req: Request, res: Response) => {
  return AlbumModel.updateAlbum(req, res);
});

// Delete an existing album
router.delete('/api/album', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return AlbumModel.deleteAlbum(req, res);
});

// Get an album
router.get('/api/album', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return AlbumModel.getAlbum(req, res);
});

export default router;
