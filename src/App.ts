import express, { Application } from 'express';

import { Database } from './Database';

import albumRoutes from './routes/album_routes';

class App {

  public expressApp: Application;

  constructor() {
    this.expressApp = express();
    this.expressApp.use(albumRoutes);

    // Connect to the database
    Database.connect();
  }

}

export { App };
