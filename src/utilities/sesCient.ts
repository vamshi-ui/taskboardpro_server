import { SESClient } from "@aws-sdk/client-ses";
const REGION = "ap-south-1";

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export { sesClient };
