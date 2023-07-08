import { MongoServerError } from "mongodb";
import { IGenericErrorResponse } from "../interfaces/common";
import { IGenericErrorMessage } from "../interfaces/error";

const handleMongoServerError = (
  error: MongoServerError
): IGenericErrorResponse => {
  const firstKey = Object.keys(error.keyPattern)[0];
  const errors: IGenericErrorMessage[] = [
    {
      path: firstKey,
      message: error.message,
    },
  ];
  // const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  const statusCode = 500;
  return {
    // status: 'false',
    statusCode,
    message: error.message,
    errorMessages: errors,
  };
};

export default handleMongoServerError;
