import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as AWS from 'aws-sdk'
import { getSingleTodo, updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const s3 = new AWS.S3({ region: 'us-east-1', signatureVersion: 'v4' });
    const tod = `${todoId}${(Math.random() + 1).toString(36).substring(2)}`
    const url = s3.getSignedUrl('putObject', {
      Bucket: 'serverless-c4-todo-images-dev',
      Key: tod,
      Expires: 3600,
      ACL: 'public-read',
    });
    // update todo
    let item = await getSingleTodo(todoId)
    updateTodo(item as UpdateTodoRequest, todoId, url)
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
