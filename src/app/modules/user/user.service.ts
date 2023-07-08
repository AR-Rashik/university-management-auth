/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { SortOrder } from "mongoose";

const createUser = async (payload: IUser): Promise<IUser | null> => {
  const result = await User.create(payload);
  return result;
};

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

// Get single user
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

// Update user
const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  // User exist or not?
  const isExist = await User.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // we have to destructure the embedded field such as name.
  const { name, ...UserData } = payload;

  const updatedUserData: Partial<IUser> = { ...UserData }; // copy of User data

  // dynamically handling if one data is updated and another is not on embedded object

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.firstName`
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ id }, updatedUserData, {
    // it should be id cause it is updated via custom id not mongodb _id. // id: id -> id
    new: true,
  });
  return result;
};

// Delete management department
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
};

// export default { createUser };
