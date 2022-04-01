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
      for (const track of album.tracks) {
        if (track.pickerIds.length === 0 || !track.pickerIds.includes(memberId)) continue;
        for (const pickerId of track.pickerIds) {
          if (pickerId !== memberId)
            sharedVotesMap.set(pickerId, sharedVotesMap.get(pickerId) + 1);
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

/**
 * Get a member's top posted album artist genres.
 */
router.get('/api/member-genres', async (req: any, res: Response) => {
  const memberId: string = req.query.memberId;

  // Fetch member
  const member: IMember = await MemberModel.getModel().findOne({ 'id' : memberId });

  // Fetch posted albums
  const albums: IAlbum[] = await AlbumModel.getModel().find({ 'id': { $in: member.postedAlbumIds } });

  // Categorize all posted albums by artist genre
  const genresMap = new Map<string, string[]>();
  for (const album of albums) {
    for (const genre of album.artistGenres) {
      if (!genresMap.has(genre))
        genresMap.set(genre, []);
      genresMap.get(genre).push(album.title);
    }
  }

  // Convert genre map to array
  const genres: any[] = Array.from(genresMap, ([genre, albumTitles]) => ({ genre, albumTitles }));

  // Sort by descending number of albums
  genres.sort((a: any, b: any) => b.albumTitles.length - a.albumTitles.length);

  res.json(genres);
});

router.get('/api/member-release', async (req: any, res: Response) => {
  const memberId: string = req.query.memberId;
  const byDecade: boolean = 'byDecade' in req.query ? req.query.byDecade : false;
  const releaseTimeUnit: string = byDecade ? 'decade' : 'year';

  // Fetch member
  const member: IMember = await MemberModel.getModel().findOne({ 'id' : memberId });

  // Fetch posted albums
  const albums: IAlbum[] = await AlbumModel.getModel().find({ 'id': { $in: member.postedAlbumIds } });

  // Categorize all posted albums by release year
  const releaseMap = new Map<string, string[]>();
  for (const album of albums) {
    const releaseYear: string = album.releaseDate.split('-')[0];
    const releaseTimeLabel: string = byDecade
      ? releaseYear.substring(0, releaseYear.length - 1) + '0'
      : releaseYear;

    if (!releaseMap.has(releaseTimeLabel))
      releaseMap.set(releaseTimeLabel, []);
    releaseMap.get(releaseTimeLabel).push(album.title);
  }

  // Convert release map to array
  let releases: any[] = Array.from(releaseMap, ([releaseTimeLabel, albumTitles]) => ({ releaseTimeLabel, albumTitles }))

  // Sort by release year
  releases.sort((a: any, b: any) => a.releaseTimeLabel - b.releaseTimeLabel);

  // Format decade labels
  if (byDecade) {
    releases = releases.map((x: any) => {
      return {
        releaseTimeLabel: x.releaseTimeLabel + 's',
        albumTitles: x.albumTitles
      }
    });
  }

  res.json({ releaseTimeUnit, releases });
});

export default router;
