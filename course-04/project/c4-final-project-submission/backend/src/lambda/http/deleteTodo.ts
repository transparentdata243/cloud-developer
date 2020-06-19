import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(event)
  const userId = getUserId(event)

  const todoId = event.pathParameters.todoId
  // DONE: Remove a TODO item by id
  await deleteTodo(userId, todoId)
  console.log('deletion finishes')
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },      
    body: ''
  }
}
