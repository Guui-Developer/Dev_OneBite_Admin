import type {AxiosRequestConfig, AxiosError} from "axios";
import {axiosInstance} from "./axiosInstance";
import {ApiError} from "./ApiError";

type Mapper<T> = (json: unknown) => T;

function wrapError(e: unknown): never {
    const error = e as AxiosError<{message?: string}>;
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error?.message || "Request failed";
    throw new ApiError(msg, {status, details: error?.response?.data});
}

export const httpClient = {
    async get<T>(url: string, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.get(url, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async getList<T>(url: string, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T[]> {
        try {
            const res = await axiosInstance.get(url, config);
            const arr = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
            return arr.map(mapper);
        } catch (e) {
            wrapError(e);
        }
    },
    async post<T>(url: string, body: unknown, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.post(url, body, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async put<T>(url: string, body: unknown, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.put(url, body, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async patch<T>(url: string, body: unknown, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.patch(url, body, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
        try {
            await axiosInstance.delete(url, config);
        } catch (e) {
            wrapError(e);
        }
    },
};
