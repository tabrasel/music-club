// Import modules
import express, { Application } from 'express';

import { Database } from './Database';

// Import models
import { AlbumModel } from './models/AlbumModel';
import { MemberModel } from './models/MemberModel';

// Import routes
import albumRoutes from './routes/album_routes';

// Connect to the database
Database.connect();

// Set up models
AlbumModel.setup();
MemberModel.setup();

// Set up and start Express server

const expressApp = express();

expressApp.use(albumRoutes);

expressApp.listen(process.env.PORT || 80);

// tslint:disable-next-line:no-console
console.log("Server running on port 80");
