import AxiosInterceptor from "./AxiosInterceptor";

export async function getGradeList(): Promise<any> {
  return AxiosInterceptor.get("Grade/list");
}

export async function getSubjectByGradeId(gradeId: any): Promise<any> {
  return AxiosInterceptor.get(`Subject/list?gradeId=${gradeId}`);
}

export async function getOpenBatchListbyTeacherId(
  teacherId: any,
  statusId: number
): Promise<any> {
  return AxiosInterceptor.get(
    `Batch/BatchListbyTeacherId?teacherId=${teacherId}&statusId=${statusId}`
  );
}

export async function addBatch(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post("Batch/Add", reqPayload);
}
