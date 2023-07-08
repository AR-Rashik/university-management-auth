import { Model } from "mongoose";

export type IUser = {
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  role?: string;
  password?: string;
  phoneNumber?: string;
};
