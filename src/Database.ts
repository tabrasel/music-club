import * as dotenv from 'dotenv';
dotenv.config({ path: './.env'});

import mongoose from 'mongoose';

class Database {

  static connect(): void {
    mongoose.connection.once('open', () => {
      // tslint:disable-next-line:no-console
      console.log('Connected to database');
    });

    mongoose.connection.on('error', () => {
      // tslint:disable-next-line:no-console
      console.error.bind(console, 'connection error:')
    });

    mongoose.connect(process.env.MONGO_URI);
  }

  static disconnect(): void {
    mongoose.disconnect();
  }

}

export { Database };
