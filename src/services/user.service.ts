import userModel from "../models/user.model";
import logger from "../config/logger";
import { createUserConfig, pageDtoConfig, updateUserConfig } from "./types";

export const createUser = async (props: createUserConfig) => {

  const { firstName, lastName, email, userName } = props;

  try {
    const user = new userModel({
      contact: {
        firstName,
        lastName,
        email,
      },
      userName,
    });

    const userResult = await user.save();

    return userResult;
  } catch (error: any) {
    logger.error("createUser failed", error);
    throw error;
  }
};

export const getUsersPaginatedAndSearch = async (props: pageDtoConfig) => {

  let { search, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    const searchQueries = {
      $or: [
        { userName: { $regex: search, $options: "ig" } },
        { "contact.firstName": { $regex: search, $options: "ig" } },
        { "contact.lastName": { $regex: search, $options: "ig" } },
        { "contact.email": { $regex: search, $options: "ig" } },
      ],
    };

    page = page < 1 ? 1 : Number(page);

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let query = search ? searchQueries : {};

    const count = await userModel.countDocuments(query);

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const user = await userModel
      .find(query, { isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      data: user,
      meta: {
        totalPages: totalPages,
        currentPage: page,
        totalUsers: count,
      },
    };
  } catch (error) {
    logger.error("getUsersPaginatedAndSearch failed", error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await userModel.findOne({ _id: id, isDeleted: false });

    return user;

  } catch (error) {
    logger.error("getUser failed", error);
    throw error;
  }
};

export const updateUser = async (props: updateUserConfig) => {

  const { id, firstName, lastName, email, userName } = props;

  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          "contact.firstName": firstName,
          "contact.lastName": lastName,
          "contact.email": email,
          userName: userName,
        },
      },
      {
        new: true
      }
    );

    return user;

  } catch (error) {
    logger.error("updateUser failed", error);
    throw error;
  }
};

export const softDeleteUser = async (id: string) => {
  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        deleteAt: null,
      },
      {
        $set: {
          isDeleted: true,
          deletedBy: id,
        },
      },
      {
        new: true
      }
    );

    return user;
    
  } catch (error) {
    logger.error("softDeleteUser failed", error);
    throw error;
  }
};
