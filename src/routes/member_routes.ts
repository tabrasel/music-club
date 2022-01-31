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
router.put('/api/member', (req: Request, res: Response) => {
  return MemberModel.updateMember(req, res);
});

// Delete an existing member
router.delete('/api/member', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return MemberModel.deleteMember(req, res);
});

// Get a member
router.get('/api/member', (req: Request, res: Response) => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  return MemberModel.getMember(req, res);
});

// Get all members
router.get('/api/members', (req: Request, res: Response) => {
  return MemberModel.getAllMembers(res);
});

export default router;
