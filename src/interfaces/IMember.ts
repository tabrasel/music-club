interface IMember {
  id: string,
  firstName: string,
  lastName: string,
  color: string,
  participatedRoundIds: string[],
  postedAlbumIds: string[],
}

export default IMember;
