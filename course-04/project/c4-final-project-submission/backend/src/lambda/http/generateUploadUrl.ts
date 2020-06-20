import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { generateUploadUrl } from '../../businessLogic/todos'

const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(event)
  const userId = getUserId(event)

  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const uploadUrl = await generateUploadUrl(userId, todoId)

  if (uploadUrl.length == 0) {
    return {
      statusCode: 404,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },      
    body: JSON.stringify({
        uploadUrl: uploadUrl
    })
  }
}
