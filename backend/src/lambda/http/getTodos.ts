import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const handler = middy(
  async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const dynamoDB = new DocumentClient();
    let todos: DocumentClient.ItemList;

    try {
      const result = await dynamoDB
        .query({
          TableName: 'Todos-dev',
          ExpressionAttributeValues: {
            ':refKey': 'todos',
          },
          KeyConditionExpression: 'refKey = :refKey',
          ProjectionExpression: 'todoId, createdAt,userId,done,todoName,dueDate',
        })
        .promise();
      todos = result.Items;
    } catch (error) {
      return {
        statusCode: 222,
        body: JSON.stringify({ error }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
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
