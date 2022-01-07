// Import modules
import express, { Application } from 'express';
import cors from 'cors';
import * as path from 'path';
import session from 'express-session';

import { Database } from './Database';

// Import models
import { AlbumModel } from './models/AlbumModel';
import { ClubModel } from './models/ClubModel';
import { MemberModel } from './models/MemberModel';
import { RoundModel } from './models/RoundModel';

import RoundThumbnailManager from './RoundThumbnailManager';

// Import routes
import albumRoutes from './routes/album_routes';
import clubRoutes from './routes/club_routes';
import memberRoutes from './routes/member_routes';
import memberMatchRoutes from './routes/member_match_routes';
import roundRoutes from './routes/round_routes';
import authRoutes from './routes/auth_routes';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
ClubModel.setup();
MemberModel.setup();
RoundModel.setup();

RoundThumbnailManager.setup();

// Define Express server
const expressApp: Application = express();

// Add middleware to server
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(session({ secret: 'woo', resave: false, saveUninitialized: false }));

// Add routes to server
expressApp.use(albumRoutes);
expressApp.use(clubRoutes);
expressApp.use(memberRoutes);
expressApp.use(memberMatchRoutes);
expressApp.use(roundRoutes);
expressApp.use(authRoutes);

expressApp.get('/', (req, res) => {
  res.send('Hello! API is available at api/');
});

// Have server listen for requests
expressApp.listen(process.env.PORT || 80);

// tslint:disable-next-line:no-console
console.log("Server running on port 80");
