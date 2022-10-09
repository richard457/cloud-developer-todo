import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { generateAttachemnt } from '../../helpers/attachmentUtils'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.queryStringParameters.id

    let imageType = event.queryStringParameters.type
    return generateAttachemnt(id, imageType)
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(
    //     {
    //       id,
    //       imageType
    //     },
    //     null,
    //     2
    //   ),
    // };

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
