// Import modules
import { Request, Response, Router } from 'express';

// Import interfaces
import IAlbum from '../interfaces/IAlbum';
import IMember from '../interfaces/IMember';
import IRound from '../interfaces/IRound';

// Import models
import { AlbumModel } from '../models/AlbumModel';
import { ClubModel } from '../models/ClubModel';
import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';

const router: Router = Router();

// TODO: /api/shared-votes (requires memberId, then otherMemberId or clubId)
// TODO: /api/shared-rounds (requires memberId, then otherMemberId or clubId)

// Get a member's match
router.get('/api/member-match', (req: any, res: Response) => {
  if ('memberId' in req.query && 'clubId' in req.query) {
    return getClubMemberMatches(req.query.memberId, req.query.clubId, res);
  }

  res.status(400);
  res.json('Missing one or more required args: [memberId], [clubId]');
});

/**
 * Count the number of votes shared between a given club member and each other member
 */
async function getClubMemberMatches(memberId: string, clubId: string, res: Response): Promise<any> {
  // Fetch club
  const club: any = await ClubModel.getModel().findOne({ 'id': clubId }).exec();

  // Initialize vote matches
  const voteMatchMap = new Map<string, number>();
  club.participantIds.forEach((id: string) => { if (id !== memberId) voteMatchMap.set(id, 0); });

  // Initialize round matches
  const roundMatchMap = new Map<string, number>();
  club.participantIds.forEach((id: string) => { if (id !== memberId) roundMatchMap.set(id, 0); });

  // Count how many votes the given member shares with every other club member
  const member: IMember = await MemberModel.getModel().findOne({ 'id': memberId });
  const participatedRounds: IRound[] = await RoundModel.getModel().find({ 'id': { $in: member.participatedRoundIds } });

  for (const round of participatedRounds) {
    const albums: IAlbum[] = await AlbumModel.getModel().find({ 'id': { $in: round.albumIds } });

    // Update the number of shared rounds with each participant
    round.participantIds.forEach((id: string) => {
      if (roundMatchMap.has(id)) roundMatchMap.set(id, roundMatchMap.get(id) + 1)
    });

    for (const album of albums) {
      for (const pickedTrack of album.pickedTracks) {
        if (!pickedTrack.pickerIds.includes(memberId)) continue;
        for (const pickerId of pickedTrack.pickerIds) {
          if (pickerId !== memberId) voteMatchMap.set(pickerId, voteMatchMap.get(pickerId) + 1);
        }
      }
    }
  }

  // If a member never participated in a round with the given member, set their matched vote count to -1
  roundMatchMap.forEach((count: number, id: string) => { if (count === 0) voteMatchMap.set(id, -1) });

  // Convert map to array
  const voteMatches: any[] = Array.from(voteMatchMap, ([id, count]) => ({ 'member': id, 'matchCount': count }));

  // Include all member info
  const members: IMember[] = await MemberModel.getModel().find({ 'id': { $in: club.participantIds } });
  const memberMap = new Map<string, IMember>();
  members.forEach((m: IMember) => { memberMap.set(m.id, m) });
  voteMatches.forEach((voteMatch) => { voteMatch.member = memberMap.get(voteMatch.member); });

  // Sort by descending match count
  voteMatches.sort((a: any, b: any) => b.matchCount - a.matchCount);

  res.json(voteMatches);
}

export default router;
