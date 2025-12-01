import type {AxiosInstance, AxiosResponse} from "axios";

export function responseCommonInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use(
        (res: AxiosResponse) => {
            const d = res.data;

            if (d && typeof d === "object") {
                if (d.success === false) {
                    return Promise.reject({
                        response: {
                            status: res.status,
                            data: d
                        },
                        message: d.error || d.message || 'Request failed'
                    });
                }

                if ("data" in d) {
                    res.data = d.data;
                    return res;
                }
            }

            return res;
        },
        (e) => Promise.reject(e)
    );
}