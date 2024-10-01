import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import path from 'path'
import { randomId } from '@/utils/helpers'
import { MultipartFile } from '@fastify/multipart'

const s3 = new S3Client({ region: process.env.AWS_REGION })

export const uploadImage = async (data: MultipartFile) => {
  const uniqueId = randomId()
  const ext = path.extname(data.filename)
  const id = uniqueId + ext

  try {
    // Create the upload instance with S3Client and multipart upload for streaming files
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.S3_BUCKET_NAME, // Your S3 bucket name
        Key: id, // File name (S3 key)
        Body: data.file, // File stream (Body)
        ContentType: data.mimetype // MIME type of the file
      }
    })

    // Wait for the upload to complete
    await upload.done()

    // Construct and return the public URL for the uploaded object
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${id}`
    return url
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error('Error uploading file to S3')
  }
}
