import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";


export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODOS_TABLE) {
    }

    async deleteTodoItem(todoId: string, userId: string) {
        console.log("Delete Item with ID: ", todoId);
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                todoId: todoId,
                userId: userId
            }
        }).promise();
    }

    async getAllTodoItem(userId: string): Promise<TodoItem[]> {

        console.log('New incoming query');
        console.log('Querying all todos from DynamoDB');        
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: "UserIdIndex",
            KeyConditionExpression: ' userId= :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        console.log(`Results: ${items.length} - Items: ${JSON.stringify(items)}`);
        console.log('Sending results...');
        return items as TodoItem[]
    }

    async updateTodoItem(todoId: string, todoUpdate: TodoUpdate, userId: string): Promise<TodoUpdate> {
        console.log('Updating Todo using ID: ', todoId)

        const todoItem = await this.docClient.update({
            TableName: this.todoTable,
            Key: {"todoId": todoId, "userId": userId},
            UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
            ExpressionAttributeValues: {
                ":a": todoUpdate.name,
                ":b": todoUpdate.dueDate,
                ":c": todoUpdate.done
            },
            ExpressionAttributeNames: {
                "#n": "name",
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
        console.log(todoItem, 'TODOITEM UPDATEED');
        console.log('Updating Todo using ID: ', todoId)
        return ;
    }

    async createTodoItem(todo: TodoItem): Promise<TodoItem> {
        console.log('New incoming request');
        console.log('Creating Todo Item from data: ', JSON.stringify(todo)); 
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()

        return todo
    }

    async s3FileUpload(todoId: string, imageId: string, userId: string) {
        console.log('New incoming Upload');
        console.log('Uploading data to S3 Bucket'); 
        const bucket = process.env.S3_BUCKET
        const url_exp = process.env.SIGNED_URL_EXPIRATION

        const s3 = new AWS.S3({
            signatureVersion: 'v4'
        });

        const url = s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: imageId,
            Expires: url_exp
        });
        console.log('Getting Signed URL: ', url)
        const imageUrl = `https://${bucket}.s3.amazonaws.com/${imageId}`;
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {todoId: todoId, userId: userId},
            UpdateExpression: "set attachmentUrl = :a",
            ExpressionAttributeValues: {
                ":a": imageUrl
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        return {
            imageUrl: imageUrl,
            uploadUrl: url
        }


    }

}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}