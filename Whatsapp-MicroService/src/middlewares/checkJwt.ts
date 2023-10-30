import { ClientError } from "../utils/errors";
import { decodeToken ,TokenSignature} from "../utils/jwtUtils";


export default  (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token)
      next(new ClientError('Missing token! Authorization=undefined', 400))
    try {
      const decodedToken = decodeToken(token) as TokenSignature
      req.user = decodedToken;
      next();
    } catch (error) {
      next(new ClientError('Token falló al decodificarse!', 400))
    }
  };
  
 
