import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
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

  const key = {
    todoId: todoId
  }

  await docClient.delete({
      TableName: todosTable,
      Key: key
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },      
    body: ''
  }
}
