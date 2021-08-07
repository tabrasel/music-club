// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { MemberModel } from '../models/MemberModel';

const router: Router = Router();

// Create a new member
router.post('/api/member', (req: Request, res: Response) => {
  return MemberModel.createMember(req, res);
});

// Update an existing member
router.put('/api/member', (req: any, res: Response) => {
  return MemberModel.updateMember(req, res);
});

// Delete an existing member
router.delete('/api/member', (req: any, res: Response) => {
  return MemberModel.deleteMember(req, res);
});

// Get a member
router.get('/api/member', (req: any, res: Response) => {
  if ('id' in req.query || ('firstName' in req.query && 'lastName' in req.query)) {
    return MemberModel.getMember(req, res);
  }

  res.status(400);
  res.json('Missing required args: [id] or [firstName] & [lastName]');
});

export default router;
