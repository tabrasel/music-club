import { DatabaseService } from '../DatabaseService';
import { ISecretService, SecretServiceGCP } from '../SecretService';

import IAlbum from '../interfaces/IAlbum';
import IRound from '../interfaces/IRound';

import { AlbumModel } from '../models/AlbumModel';
import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';


async function run(): Promise<void> {
  const secretService: ISecretService = new SecretServiceGCP();
  await secretService.setup();

  const databaseService: DatabaseService = new DatabaseService();
  await databaseService.setup(secretService);

  databaseService.connect();

  AlbumModel.setup();
  MemberModel.setup();
  RoundModel.setup();

  // Get all rounds
  const rounds: IRound[] = await RoundModel.getModel().find({}).exec();

  const updatePromises = rounds.map(async (round: IRound) => {
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
  });

  // Wait for all updates to process
  await Promise.all(updatePromises);

  // Exit
  process.exit(0);
}

run();
