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

// Update a member
router.put('/api/member', async (req: Request, res: Response): Promise<void> => {
  const updatedMember: any = await MemberModel.update(String(req.query.id), req.body);
  res.json(updatedMember);
});

// Delete a member
router.delete('/api/member', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  const deletedMember: any = await MemberModel.delete(String(req.query.id));
  res.json(deletedMember);
});

// Get a member
router.get('/api/member', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  const foundMember: any = await MemberModel.get(String(req.query.id));
  res.json(foundMember);
});

// Get all members
router.get('/api/members', async (req: Request, res: Response): Promise<void> => {
  const allMembers: any[] = await MemberModel.getAll();
  res.json(allMembers);
});

export default router;
