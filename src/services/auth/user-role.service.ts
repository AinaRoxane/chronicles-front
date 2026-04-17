import CrudBaseHttpClient from "@/services/crud.service";

export interface UserRole {
    id: number;
    code: string;
}

class UserRoleService extends CrudBaseHttpClient<UserRole> {
    constructor() {
        super("public/user-roles");
    }
}

export const userRoleService = new UserRoleService();
