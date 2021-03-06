import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getAllTodos(userId)
}

export async function createTodo(
  userId: string,
  newTodo: CreateTodoRequest
): Promise<TodoItem> {

  const todoId = uuid.v4()

  const timestamp = new Date().toISOString()
   
  const newItem = {
    userId: userId,
    createdAt: timestamp,
    todoId: todoId,
    ...newTodo,
    done: false
  }

  return await todoAccess.createTodo(newItem)
}

export async function deleteTodo(userId: string, todoId: string) {
  await todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
  await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {
  return await todoAccess.generateUploadUrl(userId, todoId)
}

