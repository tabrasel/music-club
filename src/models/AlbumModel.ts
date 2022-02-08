// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import IAlbum from '../interfaces/IAlbum';

import {
  fetchSpotifyAlbum,
  fetchSpotifyArtist,
  fetchSpotifyAlbumTracks,
  fetchSpotifyAudioFeatures
} from '../routes/spotify_routes';

class AlbumModel {

  private static model: mongoose.Model<IAlbum>;

  public static setup(): void {
    // Define album schema
    const schema: mongoose.Schema = new mongoose.Schema(
      {
        id: String,
        spotifyId: String,
        title: String,
        artists: [String],
        artistGenres: [String],
        trackCount: Number,
        releaseDate: String,
        imageUrl: String,
        posterId: String,
        pickedTracks: [{
          title: String,
          trackNumber: Number,
          pickerIds: [String]
        }],
        tracks: [{
          spotifyId: String,
          title: String,
          diskNumber: Number,
          trackNumber: Number,
          duration: Number,
          audioFeatures: {
            tempo: Number,
            timeSignature: String,
            key: String,
            mode: String,
            acousticness: Number,
            energy: Number,
            danceability: Number,
            instrumentalness: Number,
            liveness: Number,
            speechiness: Number,
            valence: Number
          },
          pickerIds: [String]
        }],
        topDiskNumber: Number,
        topTrackNumber: Number
      },
      { collection: 'albums' }
    );

    // Compile album model
    this.model = mongoose.model<IAlbum>('Album', schema);
  }

  /**
   * Creates a new album in the database.
   * @param spotifyAlbumId Spotify ID of the album
   * @param posterId       member ID of the album poster
   * @return the created album document
   */
  public static async create(spotifyAlbumId: string, posterId: string): Promise<any> {
    try {
      // Fetch album data
      const albumData: any = await AlbumModel.fetchSpotifyAlbumData(spotifyAlbumId);

      // Define post data
      const postData: any = {
        posterId,
        topDiskNumber: null,
        topTrackNumber: null,
        tracks: albumData.tracks.map((track: any): any => { return { ...track, pickerIds: [] }; })
      };

      // Define album document
      const albumDoc: any = {
        id: uuidv4(),
        ...albumData,
        ...postData
      };

      // Save document to database
      const createdAlbum: any = this.model.create(albumDoc);
      return Promise.resolve(createdAlbum);
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Update an existing album.
   */
  public static updateAlbum(req: any, res: Response): any {
    const filter: any = { id: req.query.id };
    const updatedData: any = req.body;

    const query = this.model.findOneAndUpdate(
      filter,
      updatedData,
      { new: true, useFindAndModify: false }
    );

    query.exec((err: NativeError, updatedAlbum) => {
      if (err) {
        res.json("Failed to update album");
      } else {
        res.json(updatedAlbum);
      }
    });
  }

  /**
   * Deletes an album from the database.
   * @param id ID of the album
   * @return the deleted album
   */
  public static async delete(id: string): Promise<any> {
    try {
      const query: any = this.model.findOneAndDelete({ id });
      const deletedAlbum: any = query.exec();

      return Promise.resolve(deletedAlbum);
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get a specified album.
   */
  public static getAlbum(req: any, res: Response): void {
    const query: any = this.model.findOne(req.query);
    query.exec((err: NativeError, album: Document) => {
      if (err) {
        res.json("Failed to get album");
      } else {
        res.json(album);
      }
    });
  }

  public static getModel() {
    return this.model;
  }

  /**
   * Fetches data for an album on Spotify.
   * @param spotifyAlbumId Spotify ID of the album
   */
  private static async fetchSpotifyAlbumData(spotifyAlbumId: string): Promise<any> {
    // Fetch album from Spotify
    const spotifyAlbumResult: any = await fetchSpotifyAlbum(spotifyAlbumId);
    const spotifyAlbum: any = spotifyAlbumResult.data;

    // Fetch album's artists and their associated genres from Spotify
    const artists: string[] = [];
    const artistGenres: string[] = [];
    for (const artist of spotifyAlbum.artists) {
      const spotifyArtistResult: any = await fetchSpotifyArtist(artist.id);
      const spotifyArtist: any = spotifyArtistResult.data;
      artists.push(spotifyArtist.name);
      artistGenres.push(...spotifyArtist.genres);
    }

    // Fetch album's tracks from Spotify
    const spotifyTracksResult: any = await fetchSpotifyAlbumTracks(spotifyAlbum.id);
    const spotifyTracks: any = spotifyTracksResult.data.items;

    const pitchNotations: string[] = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];

    const trackPromises = spotifyTracks.map(async (track: any) => {
      // Fetch tracks' audio features from Spotify
      let audioFeatures: any = null;

      try {
        const spotifyAudioFeaturesResult: any = await fetchSpotifyAudioFeatures(track.id);
        const spotifyAudioFeatures = spotifyAudioFeaturesResult.data;

        const timeSignature: string = spotifyAudioFeatures.time_signature + '/4';
        const mode: string = (spotifyAudioFeatures.mode === 1) ? 'major' : 'minor';
        const key: string = (spotifyAudioFeatures.key === -1) ? 'N/A' : pitchNotations[spotifyAudioFeatures.key];

        audioFeatures = {
          tempo:            spotifyAudioFeatures.tempo,
          timeSignature,
          key,
          mode,
          acousticness:     spotifyAudioFeatures.acousticness,
          energy:           spotifyAudioFeatures.energy,
          danceability:     spotifyAudioFeatures.danceability,
          instrumentalness: spotifyAudioFeatures.instrumentalness,
          liveness:         spotifyAudioFeatures.liveness,
          speechiness:      spotifyAudioFeatures.speechiness,
          valence:          spotifyAudioFeatures.valence
        };
      } catch (err: any) {
        // Ignore errors
      }

      return Promise.resolve({
        title:       track.name,
        diskNumber:  track.disc_number,
        trackNumber: track.track_number,
        duration:    track.duration_ms,
        audioFeatures
      });
    });

    const tracks: any = await Promise.all(trackPromises);

    // Consolidate album data
    const albumData: any = {
      spotifyId:    spotifyAlbum.id,
      title:        spotifyAlbum.name,
      artists,
      artistGenres,
      trackCount:   spotifyAlbum.total_tracks,
      releaseDate:  spotifyAlbum.release_date,
      imageUrl:     spotifyAlbum.images[1].url,
      tracks
    }

    return Promise.resolve(albumData);
  }

}

export { AlbumModel };
