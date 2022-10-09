import { APIGatewayProxyEvent } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { createLogger } from "../utils/logger";
const logger = createLogger('TodosAccess')

export const createTodo = async (event: APIGatewayProxyEvent) => {
    logger.info('creating todo')
    const dynamoDB = new DocumentClient();
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    newTodo.refKey = "todos";
    try {
        await dynamoDB
            .put({
                TableName: 'Todos-dev',
                Item: newTodo,
            })
            .promise();
    } catch (error) {
        return {
            statusCode: 222,
            body: JSON.stringify({ error }),
        };
    }
    return {
        statusCode: 201,
        body: JSON.stringify(newTodo),
    };
}

export const getTodos = async () => {
    logger.info("getting all todos")
    const dynamoDB = new DocumentClient();
    let todos: DocumentClient.ItemList;
    try {
        const result = await dynamoDB
            .query({
                TableName: 'Todos-dev',
                ExpressionAttributeValues: {
                    ':refKey': 'todos',
                },
                KeyConditionExpression: 'refKey = :refKey',
                ProjectionExpression: 'todoId, createdAt,userId,done,todoName,dueDate,attachmentUrl',
            })
            .promise();
        todos = result.Items;
    } catch (error) {
        return {
            statusCode: 222,
            body: JSON.stringify({ error }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(todos),
    };
}