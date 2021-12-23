// Import modules
import { Request, Response, Router } from 'express';

// Import models
import { AlbumModel } from '../models/AlbumModel';
import { ClubModel } from '../models/ClubModel';
import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';

const router: Router = Router();

// Get a member's match
router.get('/api/member-match', (req: any, res: Response) => {
  if ('memberId' in req.query && 'clubId' in req.query) {
    return getClubMemberMatches(req.query.memberId, req.query.clubId, res);
  }

  res.status(400);
  res.json('Missing one or more required args: [memberId], [clubId]');
});

async function getClubMemberMatches(memberId: string, clubId: string, res: Response): Promise<any> {
  // Initialize vote match map
  const voteMatchMap = new Map<string, number>();
  const club: any = await ClubModel.getModel().findOne({ 'id': clubId }).exec();
  club.participantIds.forEach((id: string) => { if (id !== memberId) voteMatchMap.set(id, 0); });

  // Count how many matched votes each club member has with the given member
  const member: any = await MemberModel.getModel().findOne({ 'id': memberId });
  const participatedRounds: any[] = await RoundModel.getModel().find({ 'id': { $in: member.participatedRoundIds } });
  for (const round of participatedRounds) {
    const albums: any[] = await AlbumModel.getModel().find({ 'id': { $in: round.albumIds } });
    for (const album of albums) {
      for (const pickedTrack of album.pickedTracks) {
        if (!pickedTrack.pickerIds.includes(memberId)) continue;
        for (const pickerId of pickedTrack.pickerIds) {
          if (pickerId === memberId) continue;
          voteMatchMap.set(pickerId, voteMatchMap.get(pickerId) + 1);
        }
      }
    }
  }

  // Convert map to array
  const voteMatches: any[] = Array.from(voteMatchMap, ([id, count]) => ({ 'member': id, 'matchCount': count }));

  // Include all member info
  const members: any[] = await MemberModel.getModel().find({ 'id': { $in: club.participantIds } });
  const memberMap = new Map<string, any>();
  members.forEach((m: any) => { memberMap.set(m.id, m) });
  voteMatches.forEach((voteMatch) => { voteMatch.member = memberMap.get(voteMatch.member); });

  // Sort by descending match count
  voteMatches.sort((a: any, b: any) => b.matchCount - a.matchCount);

  res.json(voteMatches);
}

export default router;
