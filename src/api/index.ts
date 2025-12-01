// Core
export { axiosInstance } from "./axiosInstance";
export { httpClient } from "./httpClient";
export { ApiError } from "./ApiError";

// API Modules
export { AuthApi } from "./modules/AuthApi";
export { CategoriesApi } from "./modules/CategoriesApi";
export { GroupApi } from "./modules/GroupApi";
export { ContentApi } from "./modules/ContentApi";

// Types - Request
export type * from "./model/request/auth";
export type * from "./model/request/category";
export type * from "./model/request/group";
export type * from "./model/request/content";

// Types - Response
export type * from "./model/response/common";
export type * from "./model/response/auth";
export type * from "./model/response/category";
export type * from "./model/response/content_types";