import { Database } from '../Database';

import IMember from '../interfaces/IMember';
import IRound from '../interfaces/IRound';

import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';

async function sortRoundParticipants(): Promise<void> {
  try {
    const rounds: IRound[] = await RoundModel.getModel().find({}).exec();

    // Update participants of each round
    const updatePromises = rounds.map(async (round: IRound) => {
      try {
        // Sort participant IDs
        const sortedParticipantIds = await MemberModel.sortMemberIds(round.participantIds);

        // Update round with sorted participants
        const update = { participantIds: sortedParticipantIds };
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
MemberModel.setup();
RoundModel.setup();

sortRoundParticipants();
