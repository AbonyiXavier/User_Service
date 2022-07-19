
export type createUserConfig = {
    firstName: string, 
    lastName: string,
    email: string,
    userName: string
}

export type pageDtoConfig = {
    search: string,
    page: number,
    limit : number
}

// extending type in type
export type updateUserConfig = createUserConfig & {
    id: string, 
}