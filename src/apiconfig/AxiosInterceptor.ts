import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import configData from "../../config.json";
import { getUserData } from "../shared/sharedDetails";

const AxiosInterceptor = axios.create({
  baseURL: configData.ApiUrl,
});

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  //   const brandInfo: any = getBrandData();
  const userInfo: any = getUserData("userData");

  if (config.url && config.url.indexOf("Blob") > -1) {
    config.headers["Content-Type"] = "multipart/form-data";
    config.headers["accept"] = "application/json";
  }
  config.headers["Authorization"] = configData.ApiBearer;
  // config.headers['LanguageId'] = brandInfo.languageId ? brandInfo.languageId.toString() : '1';
  //   config.headers["LanguageId"] = userInfo.languageId
  //     ? userInfo.languageId.toString()
  //     : "1";
  //   config.headers["BrandId"] = brandInfo.id ? brandInfo.id.toString() : "1";
  config.headers["Token"] = userInfo.token ? userInfo.token : "null";

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

AxiosInterceptor.interceptors.request.use(onRequest, onRequestError);

export default AxiosInterceptor;
