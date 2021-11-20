import * as dotenv from 'dotenv';
dotenv.config({ path: './.env'});

import S3 from 'aws-sdk/clients/s3';

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  region: bucketRegion
});

function uploadImageBuffer(buffer: any, key: string, contentType: string) {
  const params = {
    Bucket: bucketName,
    Body: buffer,
    Key: key,
    ContentType: contentType
  };

  return s3.upload(params).promise();
}

function deleteFile(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  return s3.deleteObject(params).promise();
}

export { uploadImageBuffer };
