// Import external modules
import S3 from 'aws-sdk/clients/s3';

// Import internal modules
import { ISecretService } from './SecretService';


/**
 * Interface for services that handle object storage operations.
 */
interface IStorageService {
  /**
   * Sets up the service.
   */
  setup(secretService: ISecretService): Promise<void>;

  /**
   * Saves an object.
   * @param buffer  buffer holding the object's contents
   * @param key     key to identify the object
   * @param type    content type of the object
   */
  saveObject(buffer: Buffer, key: string, type: string): void;

  /**
   * Deletes an object.
   * @param key  key to identify the object
   */
  deleteObject(key: string): void;
}


/**
 * Storage service implementation using AWS S3.
 */
class StorageServiceAWS implements IStorageService {
  private s3: S3;
  private bucketName: string;

  public async setup(secretService: ISecretService): Promise<void> {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    const bucketRegion = process.env.AWS_BUCKET_REGION;

    const accessKeyId: string = (process.env.npm_config_env === 'dev')
      ? process.env.AWS_ACCESS_KEY_ID
      : await secretService.getSecret('AWS_Access_Key_ID');

    const secretAccessKey: string = (process.env.npm_config_env === 'dev')
      ? process.env.AWS_SECRET_ACCESS_KEY
      : await secretService.getSecret('AWS_Secret_Access_Key');

    this.s3 = new S3({ accessKeyId, secretAccessKey, region: bucketRegion });
  }

  public saveObject(buffer: Buffer, key: string, type: string): Promise<any> {
    const uploadParams = { Bucket: this.bucketName, Body: buffer, Key: key, ContentType: type };
    return this.s3.upload(uploadParams).promise();
  }

  public deleteObject(key: string): Promise<any> {
    const params = { Bucket: this.bucketName, Key: key };
    return this.s3.deleteObject(params).promise();
  }
}


export { IStorageService, StorageServiceAWS };
