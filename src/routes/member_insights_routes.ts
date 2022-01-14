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

router.get('/api/shared-votes', async (req: any, res: Response) => {
  // Check arguments
  if (!('memberId' in req.query && 'clubId' in req.query)) {
    res.status(400);
    res.json('Missing one or more required parameters: [memberId], [clubId]');
    return;
  }

  const sharedVotes: any[] = await countSharedClubVotes(req.query.memberId, req.query.clubId);
  res.json(sharedVotes);
});

/**
 * Count the number of votes shared between a given member and each other member of a club.
 * @param memberId ID of the member to match against
 * @param clubId   ID of the club with members to match against
 */
async function countSharedClubVotes(memberId: string, clubId: string): Promise<any[]> {
  // Fetch club
  const club: any = await ClubModel.getModel().findOne({ 'id': clubId }).exec();

  // Initialize shared votes counts
  const sharedVotesMap = new Map<string, number>();
  club.participantIds.forEach((id: string) => { if (id !== memberId) sharedVotesMap.set(id, 0); });

  // Initialize shared rounds counts
  const sharedRoundsMap = new Map<string, number>();
  club.participantIds.forEach((id: string) => { if (id !== memberId) sharedRoundsMap.set(id, 0); });

  // Count how many votes the given member shares with every other club member
  const member: IMember = await MemberModel.getModel().findOne({ 'id': memberId });
  const participatedRounds: IRound[] = await RoundModel.getModel().find({ 'id': { $in: member.participatedRoundIds } });

  for (const round of participatedRounds) {
    const albums: IAlbum[] = await AlbumModel.getModel().find({ 'id': { $in: round.albumIds } });

    // Increment the number of rounds shared with each other member
    round.participantIds.forEach((id: string) => {
      if (sharedRoundsMap.has(id)) sharedRoundsMap.set(id, sharedRoundsMap.get(id) + 1)
    });

    for (const album of albums) {
      for (const pickedTrack of album.pickedTracks) {
        if (!pickedTrack.pickerIds.includes(memberId)) continue;
        for (const pickerId of pickedTrack.pickerIds) {
          if (pickerId !== memberId) sharedVotesMap.set(pickerId, sharedVotesMap.get(pickerId) + 1);
        }
      }
    }
  }

  // If a member never participated in a round with the given member, set their shared votes count to -1
  sharedRoundsMap.forEach((count: number, id: string) => { if (count === 0) sharedVotesMap.set(id, -1) });

  // Convert shared votes map to array
  const sharedVotes: any[] = Array.from(sharedVotesMap, ([id, count]) => ({ 'member': id, 'sharedVotesCount': count }));

  // Include all member info
  const members: IMember[] = await MemberModel.getModel().find({ 'id': { $in: club.participantIds } });
  const memberMap = new Map<string, IMember>();
  members.forEach((m: IMember) => { memberMap.set(m.id, m) });
  sharedVotes.forEach((voteMatch) => { voteMatch.member = memberMap.get(voteMatch.member); });

  // Sort by descending shared votes count
  sharedVotes.sort((a: any, b: any) => b.sharedVotesCount - a.sharedVotesCount);

  return sharedVotes;
}

export default router;
