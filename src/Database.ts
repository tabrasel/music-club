import { Connection, connect, connection } from 'mongoose';

class Database {

  private static DATABASE_URI: string = 'mongodb+srv://tatebrasel:7hQfLPox7nZ6jB9T@cluster1.m1uha.mongodb.net/music-share?retryWrites=true&w=majority';

  static connect(): void {
    connection.once('open', () => {
      // tslint:disable-next-line:no-console
      console.log('Connected to database');
    });

    connection.on('error', () => {
      // tslint:disable-next-line:no-console
      console.error.bind(console, 'connection error:')
    });

    connect(this.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true});
  }

}

export { Database };
