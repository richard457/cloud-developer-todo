import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodos } from '../../helpers/todos'

export const handler = middy(
  async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return getTodos();
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
