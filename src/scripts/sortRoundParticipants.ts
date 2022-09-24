import { DatabaseService } from '../services/DatabaseService';
import { ISecretService, SecretServiceGCP } from '../services/SecretService';

import IRound from '../interfaces/IRound';

import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';


async function run(): Promise<void> {
  const secretService: ISecretService = new SecretServiceGCP();
  await secretService.setup();

  const databaseService: DatabaseService = new DatabaseService();
  await databaseService.setup(secretService);

  databaseService.connect();

  MemberModel.setup();
  RoundModel.setup();

  const rounds: IRound[] = await RoundModel.getModel().find({}).exec();

  // Update participants of each round
  const updatePromises = rounds.map(async (round: IRound) => {
    // Sort participant IDs
    const sortedParticipantIds = await MemberModel.sortMemberIds(round.participantIds);

    // Update round with sorted participants
    const update = { participantIds: sortedParticipantIds };
    await RoundModel.getModel().findOneAndUpdate({ id: round.id }, update).exec();

    return Promise.resolve();
  });

  // Wait for all updates to process
  await Promise.all(updatePromises);

  // Exit
  process.exit(0);
}

run();
