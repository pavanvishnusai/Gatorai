// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { COOKIE_NAME } from "./constants.js";


// export const createToken = (id: string, email: string, expiresIn: any) =>{
//     const payload = {id, email};
//     const token = jwt.sign(payload, process.env.JWT_TOKEN, {
//     expiresIn,

//     });
//     return token;
// }

// export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.signedCookies[`${COOKIE_NAME}`];
//     if (!token || token.trim() === "") {
//         return res.status(401).json({message: "Token Not Received"});
//     }
//     return new Promise<void>((resolve, reject) => {
//         return jwt.verify(token, process.env.JWT_TOKEN, (err, success) => {
//             if (err) {
//                 reject(err.message);
//                 return res.status(401).json({message: "Token Expired"});
//             }else{
//                 resolve();
//                 res.locals.jwtData = success;
//                 return next();
//             }
//         });
//     });
// };

import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// ✅ Create JWT token
export const createToken = (id: string, email: string, expiresIn: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = { id, email };

  // 👇 fix: cast expiresIn to SignOptions['expiresIn'] type
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };

  return jwt.sign(payload, secret as jwt.Secret, options);
};

// ✅ Verify token and attach user data to res.locals
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.signedCookies?.auth_token ||
      req.cookies?.auth_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret as jwt.Secret) as {
      id: string;
      email: string;
    };

    res.locals.jwtData = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
