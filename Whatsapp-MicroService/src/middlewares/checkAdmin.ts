import { ClientError } from "../utils/errors";

export default async (req, res, next) => {
    const { role } = req.user;
    const isAdmin = role === 'admin'; 
    if (!isAdmin) return next(new ClientError('You are not an admin!', 400))
    return next();
  };
  