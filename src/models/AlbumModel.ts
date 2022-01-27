// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import IAlbum from '../interfaces/IAlbum';

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
   * Create a new album document.
   */
  public static createAlbum(req: any, res: Response): void {
    // Define a document for the album
    const albumInfo = req.body;
    const albumDoc: IAlbum = {
      id: uuidv4(),
      spotifyId: albumInfo.spotifyId,
      title: albumInfo.title,
      artists: albumInfo.artists,
      artistGenres: albumInfo.artistGenres,
      trackCount: albumInfo.trackCount,
      releaseDate: albumInfo.releaseDate,
      imageUrl: albumInfo.imageUrl,
      posterId: albumInfo.posterId,
      pickedTracks: [],
      tracks: albumInfo.tracks,
      topDiskNumber: null,
      topTrackNumber: null
    }

    // Create the album document in the database
    this.model.create(albumDoc, (err: NativeError, album: Document) => {
      if (err) {
        res.json("Failed to create album");
      } else {
        res.json(album);
      }
    });
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

  public static deleteAlbum(req: any, res: Response): any {
    const query: any = this.model.findOneAndDelete(req.query);

    query.exec((err: NativeError, album: Document) => {
      if (err) {
        res.json("Failed to delete album");
      } else {
        res.json(album);
      }
    });
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

}

export { AlbumModel };
