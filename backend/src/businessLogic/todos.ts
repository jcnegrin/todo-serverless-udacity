import * as uuid from 'uuid';
import {TodoItem} from "../models/TodoItem";
import {TodoAccess} from "../dataLayer/todoAccess";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";

const todoAccess = new TodoAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodoItem(userId);
}

export async function createTodo(
    createGroupRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4();
    return await todoAccess.createTodoItem({
        todoId: todoId,
        userId: userId,
        name: createGroupRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: createGroupRequest.dueDate,
        done: false,
        attachmentUrl: null
    })
}

export async function updateTodo(todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
    return await todoAccess.updateTodoItem(todoId, todoUpdate);
}

export async function deleteTodoItem(todoId: string) {
    return await todoAccess.deleteTodoItem(todoId)
}

export async function uploadAttachment(todoId: string) {
    const imageId = uuid.v4();
    return await todoAccess.s3FileUpload(todoId, imageId)
}