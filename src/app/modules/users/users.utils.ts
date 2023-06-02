import { User } from "./users.model";

export const findLastUserId = async () => {
  const lastUser = await User.findOne({}, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastUser?.id;
};

export const generateUSerId = async () => {
  const currentId = (await findLastUserId()) || (0).toString().padStart(5, "0"); // 00000

  // Increment by one cause the first id is now 00000
  const incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");

  return incrementedId;

  // lastUSerId++
  // return String(lastUSerId).padStart(5, '0')
};
