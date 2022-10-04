import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const dynamoDB = new DocumentClient();
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    try {
      await dynamoDB
        .put({
          TableName: 'Todos-dev',
          Item: newTodo,
        })
        .promise(); // to return a promise instead
    } catch (error) {
      // console.error(error);
      return {
        statusCode: 222,
        body: JSON.stringify({ error }),
      };
    }


    return {
      statusCode: 201,
      body: JSON.stringify(newTodo),
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)
