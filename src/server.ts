// Import modules
import express, { Application } from 'express';

import { Database } from './Database';

// Import models
import { AlbumModel } from './models/AlbumModel';
import { MemberModel } from './models/MemberModel';

// Import routes
import albumRoutes from './routes/album_routes';
import memberRoutes from './routes/member_routes';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
MemberModel.setup();

// Define Express server
const expressApp: Application = express();

// Make server use routes
expressApp.use(albumRoutes);
expressApp.use(memberRoutes);

// Make server listen for requests
expressApp.listen(process.env.PORT || 80);

// tslint:disable-next-line:no-console
console.log("Server running on port 80");
