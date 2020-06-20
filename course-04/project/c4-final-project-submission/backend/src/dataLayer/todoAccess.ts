import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('todos')

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIdIndex = process.env.TODOID_INDEX
    ) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all groups')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todoIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      },
    }).promise()
    logger.info("Finish DB query")
  
    return result.Items as TodoItem[]
    
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
 
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()  

    return todoItem
  }

  async deleteTodo(userId: string, todoId: string) {
    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todoIdIndex,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
      }
    }).promise()

    const key = {
        userId: userId,
        createdAt: result.Items[0].createdAt
    }
    console.log("key = ", key)
    
    await this.docClient.delete({
        TableName: this.todosTable,
        Key: key
    }).promise();
  }   

  async updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todoIdIndex,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
      }
    }).promise()
  
    // if (result.Count === 0) {
    //   return {
    //     statusCode: 404,
    //     headers: {
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     body: ''
    //   }
    // }
  
    const updatedItem = {
      userId: userId,
      createdAt: result.Items[0].createdAt,
      todoId: todoId,
      ...updatedTodo,
      attachmentUrl: result.Items[0].attachmentUrl
    }
    console.log(updatedItem)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: updatedItem
    }).promise()
  
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
