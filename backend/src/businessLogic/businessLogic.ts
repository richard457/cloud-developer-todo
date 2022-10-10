import { APIGatewayProxyEvent } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { getUserId } from "../lambda/utils";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";

const logger = createLogger('TodosAccess')

export const deleteTodo = async (todoId: string) => {
    logger.info("deleting todo")
    const dynamoDB = new DocumentClient();
    const params = {
        TableName: 'Todos-dev',
        Key: { 'todoId': todoId, 'refKey': 'todos' },
    };

    try {
        await dynamoDB.delete(params).promise();
    } catch (error) {
        console.error(error);
        return {
            statusCode: 222,
            body: JSON.stringify(error),
        }
    }


    return {
        statusCode: 200,
        body: JSON.stringify({ "deleted": true }),
    }
}


export const updateTodo = async (todo: UpdateTodoRequest, todoId: string, attachmentUrl: string) => {
    logger.info("updating todo")
    const dynamoDB = new DocumentClient();

    const { name, done } = todo;
    const updatedAttributes = [];
    const expressionAttributeValues = {};

    if (name) {
        updatedAttributes.push(`name = :name`);
        expressionAttributeValues[':name'] = name;
    }
    if (attachmentUrl) {
        updatedAttributes.push(`attachmentUrl = :attachmentUrl`);
        expressionAttributeValues[':attachmentUrl'] = attachmentUrl;
    }

    if (done !== undefined) {
        updatedAttributes.push(`done = :done`);
        expressionAttributeValues[':done'] = !!done;
    }


    const updateExpression = `set ${updatedAttributes.join(', ')}`;
    const params = {
        TableName: 'Todos-dev',
        Key: { "todoId": todoId, 'refKey': 'todos' },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues
        // ReturnValues: 'ALL_NEW',
    };

    let updatedTodo;

    try {
        const result = await dynamoDB.update(params).promise();
        updatedTodo = result.Attributes;
    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify(error),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedTodo),
    };
}

export const createTodo = async (event: APIGatewayProxyEvent) => {
    logger.info('creating todo')
    const dynamoDB = new DocumentClient();
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    newTodo.refKey = "todos";
    newTodo.userId = getUserId(event)
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
