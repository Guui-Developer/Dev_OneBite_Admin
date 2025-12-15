import axios, {type AxiosInstance} from "axios";
import { PUBLIC_API_BASE_URL, ADMIN_API_BASE_URL, API_TIMEOUT_MS } from "./config";
import { installLoggingInterceptor } from "./interceptors/loggingInterceptor";
import { installRetryInterceptor } from "./interceptors/retryInterceptor";
import { responseCommonInterceptor } from "./interceptors/responseCommonInterceptor.ts";
import { installAuthInterceptor } from "./interceptors/authInterceptor";

function createAxiosInstance(baseURL: string, requiresAuth: boolean = false): AxiosInstance {
    const instance = axios.create({ baseURL, timeout: API_TIMEOUT_MS });

    instance.interceptors.request.use((c) => {
        c.headers["Accept"] = "application/json";
        return c;
    });

    console.log(`[axios] created baseURL is ${baseURL}`);

    responseCommonInterceptor(instance);
    installRetryInterceptor(instance);
    installLoggingInterceptor(instance);

    if (requiresAuth) {
        installAuthInterceptor(instance);
    }

    return instance;
}

const publicAxiosInstance = createAxiosInstance(PUBLIC_API_BASE_URL, false);
const adminAxiosInstance = createAxiosInstance(ADMIN_API_BASE_URL, true);

export { publicAxiosInstance, adminAxiosInstance };
