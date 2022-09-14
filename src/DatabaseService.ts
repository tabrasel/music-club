// Import external modules
import mongoose from 'mongoose';

// Import internal modules
import { ISecretService } from './SecretService';


/**
 * Interface for services that handle database operations.
 */
interface IDataBaseService {
  /**
   * Sets up the service.
   */
  setup(secretService: ISecretService): Promise<void>;

  /**
   * Connects to the database.
   */
  connect(): void;

  /**
   * Disconnects from the database.
   */
  disconnect(): void;
}


/**
 * Database service implementation using MongoDB.
 */
class DatabaseService implements IDataBaseService {
  private readonly MONGO_URI_SECRET_NAME = 'Mongo_URI';

  private secretService: ISecretService;
  private mongoUri: string;

  public async setup(secretService: ISecretService): Promise<void> {
    this.secretService = secretService;

    mongoose.connection.once('open', () => {
      console.log('Connected to database');
    });

    mongoose.connection.on('error', () => {
      console.error.bind(console, 'Connection error:')
    });

    this.mongoUri = await this.secretService.getSecret(this.MONGO_URI_SECRET_NAME);
  }

  public connect(): void {
    mongoose.connect(this.mongoUri);
  }

  public disconnect(): void {
    mongoose.disconnect();
  }
}

export { DatabaseService };
