import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {createTodo} from "../../businessLogic/todos";
import {getUserId} from "../utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  if (newTodo.name) {
    const item = await createTodo(newTodo, getUserId(event));

    return {
      statusCode: 201,
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({item})
    }
  } else {
    return {
      statusCode: 400,
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify('You must enter a name for a TO-DO item')
    }
  }
}