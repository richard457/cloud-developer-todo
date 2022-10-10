import * as AWS from "aws-sdk";
import { updateTodo } from "../businessLogic/businessLogic";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";
import { getSingleTodo } from "./todos";
const logger = createLogger('TodosAccess')

export const generateAttachemnt = async (id: string, imageType: string) => {
    logger.info("generating attachement")
    const s3 = new AWS.S3({ region: 'us-east-1' });
    const tod = `${id}`
    const url = s3.getSignedUrl('putObject', {
        Bucket: 'attachementseou7xk8j16a4',
        Key: tod,
        Expires: 3600,
        ContentType: imageType,
        ACL: 'public-read',
    });
    let fileUrl: string = "https://attachementseou7xk8j16a4.s3.amazonaws.com/" + id
    let item = await getSingleTodo(id)
    await updateTodo(item as UpdateTodoRequest, id, fileUrl)
    let itemu = await getSingleTodo(id)
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                url,
                itemu
            },
            null,
            2
        ),
    };
}