
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

export const deleteTodo = async (todoId: string) => {
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

export const getSingleTodo = async (todoId: string) => {
    const dynamoDB = new DocumentClient();
    const result = await dynamoDB
        .query({
            TableName: 'Todos-dev',
            ExpressionAttributeValues: {
                ':todoId': todoId,
                ':refKey': 'todos'
            },
            KeyConditionExpression: 'todoId = :todoId and refKey = :refKey',
            ProjectionExpression: 'todoId, createdAt,userId,done,todoName,dueDate,attachmentUrl',
        })
        .promise();
    return result.Items[0];
}

export const updateTodo = async (todo: UpdateTodoRequest, todoId: string, attachmentUrl: string) => {
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