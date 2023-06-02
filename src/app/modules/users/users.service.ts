import config from "../../../config";
import { IUser } from "./users.interface";
import { User } from "./users.model";
import { generateUSerId } from "./users.utils";

const createUser = async (user: IUser): Promise<IUser | null> => {
  // auto generated incremental
  const id = await generateUSerId();

  user.id = id;

  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  const createdUser = await User.create(user);

  if (!createUser) {
    throw new Error("Failed to create user");
  }

  return createdUser;
};

export default { createUser };
