
import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {updateTodo as updateTodoFunction} from "../../businessLogic/todos";
import { getUserId} from "../utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    console.log(updatedTodo)
    const result = await updateTodoFunction(todoId, updatedTodo, userId);
    console.log(result)
    return {
        statusCode: 202,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(updatedTodo)
    }
}