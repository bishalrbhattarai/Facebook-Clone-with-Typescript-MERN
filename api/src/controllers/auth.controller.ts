import { NextFunction, Request, Response } from "express";
import userModel, { UserDocument } from "../models/user.model";
import { z } from "zod";
import jwt from "jsonwebtoken";
import mongoose, { MongooseError } from "mongoose";
const JWT_SECRET = "secret_key";

const SignUpSchema = z.object({
  firstName: z.string({
    required_error: "First Name is Required for SIGN UP",
  }),
  lastName: z.string({
    required_error: "Last Name is Required for SIGN UP",
  }),
  gender: z.enum(["male", "female"], {}),
  email: z
    .string({
      required_error: "Email is Required for SIGN UP",
    })
    .email("It needs to be a VALID EMAIL"),
  password: z.string({
    required_error: "Password is Required for SIGN UP",
  }),
});

const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is Required for LOGIN ",
    })
    .email("It needs to be a VALID EMAIL"),
  password: z.string({
    required_error: "Password is Required for LOGIN",
  }),
});

/*


*/

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Yo chai login controller ma clg ho hai token ko value");
  // console.log(req.cookies.token);  mfrfnffffnqepfnfd

  // console.log(token);

  try {
    // console.log("object");
    const body = LoginSchema.parse(req.body);
    const user = await userModel.findOne(
      { email: body.email },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );
    // console.log("the user is: " + user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please Register First to LOGIN",
      });
    }

    const isValid = await user.comparePassword(body.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Please Enter Valid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET!,
      {
        expiresIn: "10d",
      }
    );

    const expiryDate = 10 * 24 * 60 * 60 * 1000;

    const { password, ...userObject } = user.toObject();
    // const User = user.toObject();

    // Send token in an HTTP-only cookie
    res.cookie("token", token, {
      maxAge: expiryDate,
      // sameSite: "none",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      user: userObject,
      token,
    });
  } catch (error: any) {
    console.log(error);
    if (error instanceof MongooseError) console.log(error);
    next(error);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = SignUpSchema.parse({ ...req.body });
    const userExists = await userModel.exists({ email: body.email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    await userModel.create(body);
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error: any) {
    if (error instanceof MongooseError) console.log(error);
    next(error);
  }
};
