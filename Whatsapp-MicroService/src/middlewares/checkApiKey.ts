import { ClientError } from "../utils/errors";
import { apikeys } from "../databases/mongodb";

export default async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) return next(new ClientError('You are not an admin!', 400))
  const found = await apikeys.findOneAndUpdate({ api_key: apiKey }, { $inc: { total_requests: 1 } })
  if (!found) return next(new ClientError('Api key inválida!', 400))
  return next();
};

