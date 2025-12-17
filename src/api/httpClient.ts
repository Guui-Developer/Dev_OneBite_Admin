import type { AxiosRequestConfig, AxiosError, AxiosInstance } from "axios";
import { publicAxiosInstance, adminAxiosInstance } from "./axiosInstance";
import { ApiError } from "./ApiError";
import type { FailureResponse } from "./model/public/response/common";

type Mapper<T> = (json: unknown) => T;

function wrapError(e: unknown): never {
    const error = e as AxiosError<FailureResponse>;
    const status = error?.response?.status;

    const errorData = error?.response?.data?.error;
    const code = errorData?.code;
    const msg = errorData?.message || error?.message || "Request failed";

    throw new ApiError(msg, { status, code, details: error?.response?.data });
}

function createHttpClient(instance: AxiosInstance) {
    return {
        async get<T>(url: string, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
            try {
                const res = await instance.get(url, config);
                return mapper(res.data);
            } catch (e) {
                wrapError(e);
            }
        },
        async getList<T>(url: string, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T[]> {
            try {
                const res = await instance.get(url, config);
                const arr = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
                return arr.map(mapper);
            } catch (e) {
                wrapError(e);
            }
        },
        async post<T>(url: string, body: unknown, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
            try {
                const res = await instance.post(url, body, config);
                return mapper(res.data);
            } catch (e) {
                wrapError(e);
            }
        },
        async put<T>(url: string, body: unknown, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
            try {
                const res = await instance.put(url, body, config);
                return mapper(res.data);
            } catch (e) {
                wrapError(e);
            }
        },
        async patch<T>(url: string, body: unknown, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
            try {
                const res = await instance.patch(url, body, config);
                return mapper(res.data);
            } catch (e) {
                wrapError(e);
            }
        },
        async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
            try {
                await instance.delete(url, config);
            } catch (e) {
                wrapError(e);
            }
        },
    };
}

export const publicHttpClient = createHttpClient(publicAxiosInstance);
export const adminHttpClient = createHttpClient(adminAxiosInstance);