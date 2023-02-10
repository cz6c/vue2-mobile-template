import { createPost } from "@utils/request";
import { editAccountType } from "./index.d";

// 修改账户信息
export const editAccount = createPost<editAccountType, never>("/admin/user/updateLoginUser");
