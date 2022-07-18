import { createUser, getUsersPaginatedAndSearch, getUser, updateUser, softDeleteUser } from "../services/user.service";
import { createdResponse, badRequestResponse, successfulResponse, notFoundResponse, serverErrorResponse, deletedResponse } from "../utils/response";
import catchAsync from "../utils/catchAsync";

export const createUserHandler = catchAsync(async (req, res) => {

    const { firstName, lastName, email, userName } = req.body;
    const { status, message, data } = await createUser({ firstName, lastName, email, userName });

    if (!status) {
        return badRequestResponse({ res, message, data })
    }

    return createdResponse({ res, message, data });

})

export const fetchUsersHandler = catchAsync(async (req, res) => {
    
    const { search, page, limit } = req.query;

    const { status, message, data, meta } = await getUsersPaginatedAndSearch(search, page, limit);

    if (!status) {
        return badRequestResponse({ res, message, data })
    }

    return successfulResponse({ res, message, data, meta })
})

export const fetchUserHandler = catchAsync(async (req, res) => {

    const { id } = req.params;

    const { status, message, data } = await getUser(id);

    if (!status) {
        return notFoundResponse({ res, message, data })
    }

    return successfulResponse({ res, message, data })
})

export const updateUserHandler = catchAsync(async (req, res) => {

    const { id } = req.params;

    const { firstName, lastName, email, userName } = req.body;

    const { status, message, data } = await updateUser(id, firstName, lastName, email, userName);

    if (!status) {
        return serverErrorResponse({ res, message, data })
    }

    return successfulResponse({ res, message, data })
})

export const softDeleteUserHandler = catchAsync(async (req, res) => {

    const { id } = req.params;


    const { status, message, data } = await softDeleteUser(id);

    if (!status) {
        return serverErrorResponse({ res, message, data })
    }

    return deletedResponse({ res, message, data });
})

