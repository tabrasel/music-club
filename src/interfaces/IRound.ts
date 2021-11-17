interface IRound {
  id: string,
  number: number,
  description: string,
  participantIds: string[],
  albumIds: string[],
  startDate: string,
  endDate: string,
  picksPerParticipant: number
}

export default IRound;
