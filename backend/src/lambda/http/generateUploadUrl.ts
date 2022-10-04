import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const client = new S3Client({ region: 'us-east-1' });
    const Key = `${todoId}${(Math.random() + 1).toString(36).substring(2)}`
    const { url } = await createPresignedPost(client, {
      Bucket: 'serverless-c4-todo-images-dev',
      Key,
      Expires: 3600,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          url
        },
        null,
        2
      ),
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
