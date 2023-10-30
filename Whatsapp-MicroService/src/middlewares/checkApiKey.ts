import { ClientError } from "../utils/errors";

export default async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) return next(new ClientError('You are not an admin!', 400))
  return next();
};

