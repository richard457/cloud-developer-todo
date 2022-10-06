import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as AWS from 'aws-sdk'
import { getSingleTodo, updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const s3 = new AWS.S3({ region: 'us-east-1' });
    const tod = `${todoId}`
    const url = s3.getSignedUrl('putObject', {
      Bucket: 'richie-app-dev-attachmentsbucket-eou7xk8j16a4',
      Key: tod,
      Expires: 3600,
      ContentType: 'image/png',
      ACL: 'public-read',
    });
    let fileUrl: string = "https://richie-app-dev-attachmentsbucket-eou7xk8j16a4.s3.amazonaws.com/" + todoId
    let item = await getSingleTodo(todoId)
    updateTodo(item as UpdateTodoRequest, todoId, fileUrl)
    let itemu = await getSingleTodo(todoId)
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
