import UserModel from "../models/user.model";
import logger from "../config/logger";

/**
 * A method responsible for creating user
 * @param {*} param0 
 * @returns 
 */
export const createUser = async ({ firstName, lastName, email, userName }) => {
    try {
        return await constructCreateUserEntity(firstName, lastName, email, userName);

    } catch (error) {
        logger.error("CreateUser failed", error);

        if (error.name === "MongoServerError" && error.code === 11000 && error.keyPattern.userName === 1) {
            return {
                status: false,
                message: "User name already in use",
                data: null
            };
        }

        if (error.name === "MongoServerError" && error.code === 11000 && error.keyPattern['contact.email'] === 1) {
            return {
                status: false,
                message: "Email already in use",
                data: null
            };
        }

        return {
            status: false,
            message: 'Error creating user',
            data: null
        };

    }
}

/**
 * A method that construct create user entity
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} email 
 * @param {*} userName 
 * @returns 
 */
async function constructCreateUserEntity(firstName, lastName, email, userName) {
    const user = new UserModel({
        contact: {
            firstName,
            lastName,
            email
        },
        userName
    });

    const userResult = await user.save();

    return {
        status: true,
        message: "User created successfully",
        data: userResult
    };
}


/**
 * A method that is responsible for fetching all users with pagination and can search
 * @param {*} search 
 * @param {*} page 
 * @param {*} limit 
 * @returns 
 */
export const getUsersPaginatedAndSearch = async (search, page, limit) => {
    try {
        page = !page || isNaN(page) ? 1 : Number(page);

        const searchQueries = {
            $or: [
                { userName: { $regex: search, $options: 'ig' } },
                { "contact.firstName": { $regex: search, $options: 'g' } },
                { "contact.lastName": { $regex: search, $options: 'g' } },
                { "contact.email": { $regex: search, $options: 'g' } }
            ]
        };

        page = page < 1 ? 1 : Number(page);

        limit = !limit || isNaN(limit) ? 5 : Number(limit);

        let query = search ? searchQueries : {};

        const count = await UserModel.countDocuments(query);

        let totalPages = Math.ceil(count / limit);
        page = page > totalPages ? totalPages : page;

        return await constructFetchUsersEntity(query, limit, page, totalPages, count);

    } catch (error) {
        logger.error("GetUsersPaginatedAndSearch failed", error);

        if (error.name === "MongoServerError" && error.code === 51024) {
            return {
                status: false,
                message: "No user found",
                data: null
            };
        }
        return {
            status: false,
            message: 'Error fetching users',
            data: null
        };
    }
}

/**
 * A method that construct fetch users entity
 * @param {*} query 
 * @param {*} limit 
 * @param {*} page 
 * @param {*} totalPages 
 * @param {*} count 
 * @returns 
 */
async function constructFetchUsersEntity(query, limit, page, totalPages, count) {
    const user = await UserModel.find(query, { isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    return {
        status: true,
        message: 'Users fetched successfully',
        data: user,
        meta: {
            totalPages: totalPages,
            currentPage: page,
            totalUsers: count,
        },
    };
}


/**
 * A method responsible for fetching a single user by id
 * @param {*} id 
 * @returns 
 */
export const getUser = async (id) => {
    try {
        const user = await UserModel.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return {
                status: false,
                message: 'User not found',
                data: null
            };
        }

        return {
            status: true,
            message: 'User fetched successfully',
            data: user
        };

    } catch (error) {
        logger.error("GetUser failed", error);

        return {
            status: false,
            message: 'Error fetching user',
            data: null
        };
    }
}

/**
 * A method that is responsible for updating user by id and its input
 * @param {*} id 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} email 
 * @param {*} userName 
 * @returns 
 */
export const updateUser = async (id, firstName, lastName, email, userName) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                $set: {
                    "contact.firstName": firstName,
                    "contact.lastName": lastName,
                    "contact.email": email,
                    userName: userName
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        return {
            status: true,
            message: 'User updated successfully',
            data: user
        };

    } catch (error) {
        logger.error("updateUser failed", error);

        return {
            status: false,
            message: 'Error updating user',
            data: null
        };
    }
}


/** A method responsible for soft delete of users
 * @param {*} id 
 * @returns 
 */
export const softDeleteUser = async (id) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                $set: {
                    isDeleted: true,
                    deletedBy: id
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        return {
            status: true,
            message: "User deleted successfully!",
            data: user
        };

    } catch (error) {
        logger.error("softDeleteUser failed", error);
        
        return {
            status: false,
            message: 'Error deleteing user',
            data: null
        };
    }
}