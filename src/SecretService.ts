import { SecretManagerServiceClient } from '@google-cloud/secret-manager';


/**
 * Interface for services that handle secret management operations.
 */
interface ISecretService {
  /**
   * Prepares to handle secrets.
   */
  setup(): Promise<void>;

  /**
   * Gets a secret.
   * @param name  name of the secret
   */
  getSecret(name: string): Promise<string>;
}


/**
 * Secret service implementation using GCP Secret Manager.
 */
class SecretServiceGCP implements ISecretService {
  private client: SecretManagerServiceClient;
  private projectId: string;

  public async setup(): Promise<void> {
    this.projectId = process.env.GOOGLE_PROJECT_ID;
    this.client = new SecretManagerServiceClient();
  }

  public async getSecret(name: string): Promise<string> {
    try {
      const fullName: string = `projects/${this.projectId}/secrets/${name}/versions/latest`;
      const [response] = await this.client.accessSecretVersion({ name: fullName });
      const responsePayload = response.payload.data.toString();
      return responsePayload;
    }
    catch(ex) {
      console.error(ex.toString());
    }

    return null;
  }
}


export { ISecretService, SecretServiceGCP };
