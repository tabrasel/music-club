// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { MemberModel } from '../models/MemberModel';

const router: Router = Router();

// Create a member
router.post('/api/member', async (req: Request, res: Response): Promise<void> => {
  const createdMember: any = await MemberModel.create(req.body.firstName, req.body.lastName, req.body.color);
  res.json(createdMember);
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
