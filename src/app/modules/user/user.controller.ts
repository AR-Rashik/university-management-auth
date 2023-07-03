import { Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IUser } from "./user.interface";

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req.body;
    const result = await UserService.createUser(user);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user created successfully!",
      data: result,
    });
    // next();

    // res.status(200).json({
    //   success: true,
    //   statusCode: 200,
    //   message: "User created successfully",
    //   data: result,
    // });
  }
);

// old concept
// const createUser: RequestHandler = async (req, res, next) => {
//   try {
//     const { user } = req.body;
//     const result = await UserService.createUser(user);
//     res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: "User created successfully",
//       data: result,
//     });
//   } catch (error) {
//     // res.status(400).json({
//     //   success: false,
//     //   message: "Failed to create user",
//     // });
//     next(error);
//   }
// };

export const UserController = { createUser };
