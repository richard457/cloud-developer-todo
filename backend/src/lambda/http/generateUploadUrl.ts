import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as AWS from 'aws-sdk'
import { getSingleTodo, updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.queryStringParameters.id

    let imageType = event.queryStringParameters.type

    const s3 = new AWS.S3({ region: 'us-east-1' });
    const tod = `${id}`
    const url = s3.getSignedUrl('putObject', {
      Bucket: 'richie-app-dev-attachmentsbucket-eou7xk8j16a4',
      Key: tod,
      Expires: 3600,
      ContentType: imageType,
      ACL: 'public-read',
    });
    let fileUrl: string = "https://richie-app-dev-attachmentsbucket-eou7xk8j16a4.s3.amazonaws.com/" + id
    let item = await getSingleTodo(id)
    updateTodo(item as UpdateTodoRequest, id, fileUrl)
    let itemu = await getSingleTodo(id)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          url,
          itemu
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
