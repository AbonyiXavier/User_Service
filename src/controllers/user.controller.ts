import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { statusError, statusSuccess } from "../common/constant";
import {
  createUserConfig,
  pageDtoConfig,
  updateUserConfig,
} from "../services/types";
import {
  createUser,
  getUser,
  getUsersPaginatedAndSearch,
  softDeleteUser,
  updateUser,
} from "../services/user.service";

export const createUserHandler = async (req: Request, res: Response) => {
  const { firstName, lastName, email, userName } = req.body;

  const payload = { firstName, lastName, email, userName } as createUserConfig;

  try {

    const user = await createUser(payload);

    return res.status(StatusCodes.CREATED).send({
      status: statusSuccess,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {

    if (
      error.name === "MongoServerError" &&
      error.code === 11000 &&
      error.keyPattern["contact.email"] === 1
    ) {
      return res.status(StatusCodes.CONFLICT).send({
        status: statusError,
        message: "Email already in use",
        data: null,
      });
    }

    if (
      error.name === "MongoServerError" &&
      error.code === 11000 &&
      error.keyPattern.userName === 1
    ) {
      return res.status(StatusCodes.CONFLICT).send({
        status: statusError,
        message: "User name already in use",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error creating user",
      data: null,
    });
  }
};

export const fetchUsersHandler = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const query = { search, page, limit } as unknown as pageDtoConfig;

  try {
    const user = await getUsersPaginatedAndSearch(query);

    return res.status(StatusCodes.OK).send({
      status: statusSuccess,
      message: "Users fetched successfully",
      data: user,
    });
  } catch (error: any) {

    if (error.name === "MongoServerError" && error.code === 51024) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: statusError,
        message: "No user found",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error fetching users",
      data: null,
    });
  }
};

export const fetchUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUser(id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: statusError,
        message: "No user found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: statusSuccess,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error fetching user",
      data: null,
    });
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { firstName, lastName, email, userName } = req.body;

  const payload = {
    id,
    firstName,
    lastName,
    email,
    userName,
  } as updateUserConfig;

  try {
    const user = await updateUser(payload);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: statusError,
        message: "No user found",
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: statusSuccess,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    
    if (
      error.name === "MongoServerError" &&
      error.code === 11000 &&
      error.keyPattern["contact.email"] === 1
    ) {
      return res.status(StatusCodes.CONFLICT).send({
        status: statusError,
        message: "Email already in use",
        data: null,
      });
    }

    if (
      error.name === "MongoServerError" &&
      error.code === 11000 &&
      error.keyPattern.userName === 1
    ) {
      return res.status(StatusCodes.CONFLICT).send({
        status: statusError,
        message: "User name already in use",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error updating user",
      data: null,
    });
  }
};

export const softDeleteUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await softDeleteUser(id);

    return res.status(StatusCodes.OK).send({
      status: statusSuccess,
      message: "User deleted successfully",
      data: user,
    });
    
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error deleting user",
      data: null,
    });
  }
};
