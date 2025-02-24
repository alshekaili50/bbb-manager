import { EC2Client } from '@aws-sdk/client-ec2'

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing AWS environment variables')
}

export const ec2Client = new EC2Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
}) 