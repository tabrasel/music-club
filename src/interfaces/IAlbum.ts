interface IAlbum {
  id: string,
  spotifyId: string,
  title: string,
  artists: string[],
  artistGenres: string[],
  trackCount: number,
  releaseDate: string,
  imageUrl: string,
  posterId: string,
  pickedTracks: {
    title: string,
    trackNumber: number,
    pickerIds: string[]
  }[],
  tracks: {
    title: string,
    diskNumber: number,
    trackNumber: number,
    duration: number,
    audioFeatures: {
      tempo: number,
      timeSignature: string,
      key: string,
      mode: string,
      acousticness: number,
      energy: number,
      danceability: number,
      instrumentalness: number,
      liveness: number,
      speechiness: number,
      valence: number
    }[],
    pickerIds: string[]
  },
  topDiskNumber: number,
  topTrackNumber: number
}

export default IAlbum;
