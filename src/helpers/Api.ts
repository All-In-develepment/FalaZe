import AppError from "../errors/AppError";
import Setting from "../models/Setting";

export const getApiToken = async (): Promise<Setting> => {
  const token = await Setting.findOne({
    where: { key: "userApiToken" }
  });

  if (!token) throw new AppError("ERR_NO_TOKEN_FOUND", 404);

  return token;
};
