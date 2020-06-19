import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
//const nameIndex = process.env.NAME_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(event)

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const result = await docClient.query({
    TableName: todosTable,
    //IndexName: nameIndex,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
        ':todoId': todoId
    }
  }).promise()

  if (result.Count === 0) {
    return {
      statusCode: 404,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }

  console.log('update able to read it out')

  const updatedItem = {
    todoId: todoId,
    createdAt: result.Items[0].timestamp,
    ...updatedTodo,
    attachmentUrl: result.Items[0].attachmentUrl
  }

  await docClient.put({
    TableName: todosTable,
    Item: updatedItem
  }).promise()

  return {
    statusCode: 204,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        updatedItem
    })
  }
}
