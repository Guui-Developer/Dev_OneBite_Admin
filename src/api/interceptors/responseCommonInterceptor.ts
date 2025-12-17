import type { AxiosInstance, AxiosResponse } from "axios";
import type { ApiResponse } from "../model/public/response/common";

export function responseCommonInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use(
        (res: AxiosResponse) => {
            const d = res.data;

            if (d && typeof d === "object" && "success" in d) {
                const apiResponse = d as ApiResponse<unknown>;

                // 실패 응답 처리
                if (apiResponse.success === false) {
                    return Promise.reject({
                        response: {
                            status: res.status,
                            data: apiResponse
                        },
                        message: apiResponse.error?.message || 'Request failed'
                    });
                }

                // 성공 응답 처리 - data 필드만 반환
                if (apiResponse.success === true) {
                    res.data = apiResponse.data;
                    return res;
                }
            }

            return res;
        },
        (e) => Promise.reject(e)
    );
}