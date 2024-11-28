import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = "secret_key";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

interface TokenPayload {
  id: string;
  email: string;
}

export const auth = (
  req: Request,

  res: Response,
  next: NextFunction
) => {
  // to get the cookie from the header
  const token = req.cookies.token;
  // console.log("The Token is available");
  if (!token) {
    res.status(401).json({
      message: "You are not Authenticated.",
    });
    return;
  }

  const payload = jwt.verify(token, JWT_SECRET!) as TokenPayload;

  req.user = {
    id: payload.id,
    email: payload.email,
  };

  // console.log("the data from the token is: ");
  // console.log(payload);
  next();
};
