import { Database } from '../Database';

import IAlbum from '../interfaces/IAlbum';
import IMember from '../interfaces/IMember';
import IRound from '../interfaces/IRound';

import { AlbumModel } from '../models/AlbumModel';
import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';

async function sortRoundAlbums(): Promise<void> {
  try {
    const rounds: IRound[] = await RoundModel.getModel().find({}).exec();

    // Update albums of each round
    const updatePromises = rounds.map(async (round: IRound) => {
      try {

        // Get albums
        const albums = await AlbumModel.getModel().find({ 'id': { $in: round.albumIds }}).exec();

        // Sort participant IDs
        const sortedParticipantIds = await MemberModel.sortMemberIds(round.participantIds);

        // Sort albums by sorted poster ID
        albums.sort((a: IAlbum, b: IAlbum) => {
          const aIndex: number = sortedParticipantIds.indexOf(a.posterId);
          const bIndex: number = sortedParticipantIds.indexOf(b.posterId);
          return aIndex - bIndex;
        });

        // Update round with sorted participants
        const sortedAlbumIds: string[] = albums.map((album: IAlbum) => album.id);
        const update = { albumIds: sortedAlbumIds };
        await RoundModel.getModel().findOneAndUpdate({ id: round.id }, update).exec();

        return Promise.resolve();
      } catch(err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        process.exit(1);
      }
    });

    // Wait for all updates to process
    await Promise.all(updatePromises);

    // Exit
    process.exit(0);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
  }
}

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
MemberModel.setup();
RoundModel.setup();

sortRoundAlbums();
