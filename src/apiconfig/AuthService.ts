import AxiosInterceptor from "./AxiosInterceptor";

export async function userLogin(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post("User/login", reqPayload);
}

export async function getBrandInfo() {
  return AxiosInterceptor.get("Brand/list/1");
}

export async function userForgetPassowrd(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post("User/reset-password", reqPayload);
}

export async function userChangePassword(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post("User/change-password", reqPayload);
}

export async function upsertUser(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post("User/Upsert", reqPayload);
}
