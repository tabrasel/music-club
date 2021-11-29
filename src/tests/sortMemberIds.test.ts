import { Database } from '../Database';
import { MemberModel } from '../models/MemberModel';

// Setup
Database.connect();
MemberModel.setup();

test('sorts member IDs by name', async () => {
  const unsortedMemberIds = [
    'a2214742-89a8-4949-8dc7-cadcbdca8131',
    '4559bd4a-0eb3-4f94-8cbc-e1b482cd3af1',
    '96e05653-5e9d-4f86-9b05-fe41ef993587'
  ];

  const result = await MemberModel.sortMemberIds(unsortedMemberIds);

  expect(result).toEqual([
    '4559bd4a-0eb3-4f94-8cbc-e1b482cd3af1',
    '96e05653-5e9d-4f86-9b05-fe41ef993587',
    'a2214742-89a8-4949-8dc7-cadcbdca8131'
  ]);
});

afterAll(done => {
  Database.disconnect();
  done();
});
