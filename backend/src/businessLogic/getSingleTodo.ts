import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";

const logger = createLogger('TodosAccess')

export const getSingleTodo = async (todoId: string) => {
    logger.info("get single todo")
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