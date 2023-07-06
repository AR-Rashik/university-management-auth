import mongoose, { SortOrder } from "mongoose";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { IStudent } from "../student/student.interface";
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import { Student } from "../student/student.model";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";

// Get all faculty with pagination, search and filters.
const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    // .populate("student")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Create student as user
const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }

  // set role
  user.role = "student";

  // get academic semester to create student id with year and code.
  const academicSemester = await AcademicSemester.findById(
    student.academicSemester
  );

  let newUserAllData = null;

  // start session on mongoose
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // start transaction
    const id = await generateStudentId(academicSemester); // auto generated student id
    user.id = id;
    student.id = id;

    // newStudent is the value of student and it's an array
    const newStudent = await Student.create([student], { session });

    // If student isn't found
    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create student!");
    }

    // set student --> _id into user.student
    user.student = newStudent[0]._id;

    const newUser = await User.create([user], { session });

    // if user isn't found
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    newUserAllData = newUser[0]; // all data of new user

    await session.commitTransaction(); // commit transaction
    await session.endSession(); // end session
  } catch (error) {
    await session.abortTransaction(); // abort transaction if any error happened then end session // rollback
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: "student",
      populate: [
        {
          path: "academicSemester",
        },
        {
          path: "academicDepartment",
        },
        {
          path: "academicFaculty",
        },
      ],
    });
  }

  return newUserAllData;
};

export const UserService = {
  getAllUsers,
  createStudent,
};

// export default { createUser };
