import AxiosInterceptor from "./AxiosInterceptor";

export async function getGradeList(): Promise<any> {
  return AxiosInterceptor.get("Grade/list");
}

export async function addMediaImage(payload: any): Promise<any> {
  return AxiosInterceptor.post("MediaFile/addMediaImage", payload);
}

export async function deleteMediaFile(payload: any): Promise<any> {
  return AxiosInterceptor.post("MediaFile/DeleteMediaFile", payload);
}

export async function deleteMediaFilev2(payload: any): Promise<any> {
  return AxiosInterceptor.post(`MediaFile/DeleteMediaFileV2?blobLink=${payload.bloblink}&entityId=${payload.entityId}&entityTypeId=${payload.entityTypeId}`, {});
}

export async function getUsersList(payload: any): Promise<any> {
  return AxiosInterceptor.post("User/UserSearch", payload);
}

export async function getUsersDetails(
  userId: number,
  type: number
): Promise<any> {
  return AxiosInterceptor.post(
    `User/UserDetails?userid=${userId}&type=${type}`
  );
}

export async function getSubjectByGradeId(gradeId: any): Promise<any> {
  return AxiosInterceptor.get(`Subject/list?gradeId=${gradeId}`);
}

export async function getBatchListbyUserid(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post(`Batch/BatchListbyUserid`, reqPayload);
}

export async function addBatch(reqPayload: any): Promise<any> {
  return AxiosInterceptor.post("Batch/Add", reqPayload);
}

export async function getStudentsListByBatchId(batchId: number): Promise<any> {
  return AxiosInterceptor.get(`Batch/StudentList/${batchId}`);
}

export async function getAssignmentsListByBatchId(payload: any): Promise<any> {
  return AxiosInterceptor.post(
    `Assignments/GetAssignmentsList/batchId`,
    payload
  );
}

export async function getAssessmentsListByBatchId(payload: any): Promise<any> {
  return AxiosInterceptor.post(
    `Assessments/GetAssessmentsList/batchId`,
    payload
  );
}

export async function getAssignmentDetailsById(id: number): Promise<any> {
  return AxiosInterceptor.get(`Assignments/GetAssignment/${id}`);
}

export async function getAssessmentDetailsById(id: number): Promise<any> {
  return AxiosInterceptor.get(`Assessments/GetAssessments/${id}`);
}

export async function getAssignmentsListByTeacherId(
  payload: any
): Promise<any> {
  return AxiosInterceptor.post(
    `Assignments/GetAssignmentsList/teacherid`,
    payload
  );
}

export async function getAssessmentsListByTeacherId(
  payload: any
): Promise<any> {
  return AxiosInterceptor.post(
    `Assessments/GetAssessmentsList/teacherid`,
    payload
  );
}

export async function getStudentsAttendance(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Attendance/StudentsAttendance`, payload);
}

export async function upsertAssessments(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Assessments/Upsert`, payload);
}

export async function upsertAssignments(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Assignments/Upsert`, payload);
}

export async function upsertAttendanceBulkAdd(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Attendance/Bulk/Add`, payload);
}

export async function getAssignStudentAssignments(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Assignments/AssignStudentAssignments`, payload);
}

export async function getAssignStudentAssessments(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Assessments/AssignStudentAssessments`, payload);
}

export async function getReviews(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Reviews/GetReviews`, payload);
}

export async function upsertReviews(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Reviews/Upsert`, payload);
}

export async function updateBatchStatus(
  batchId: number,
  batchStatus: number
): Promise<any> {
  return AxiosInterceptor.get(
    `Batch/UpdateBatchStatus?batchStatus=${batchStatus}&batchId=${batchId}`
  );
}

export async function assignStudentBatch(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Batch/AssignedStudent`, payload);
}

export async function assignFavouriteBatch(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Batch/AssignedFavouriteBatch`, payload);
}

export async function updateFavouriteStatus(
  userId: number,
  entityId: number
): Promise<any> {
  return AxiosInterceptor.get(
    `Batch/UpdateFavouriteStatus?userId=${userId}&entityId=${entityId}`
  );
}
export async function getBatchListbyEntity(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Batch/BatchListbyEntity`, payload);
}

export async function updateEnrollmentStatus(
  status: number,
  studentId: number,
  batchId: number
): Promise<any> {
  return AxiosInterceptor.get(
    `Batch/UpdateEnrollmentStatus?status=${status}&studentid=${studentId}&batchId=${batchId}`
  );
}

export async function uploadFileToBlob(
  fileData: any,
  mediaEntityType: number = 0
): Promise<any> {
  return AxiosInterceptor.post(
    `MediaFile/Blob/UploadFile?mediaEntityType=${mediaEntityType}`,
    fileData
  );
}

export async function upsertUserInfo(payload: any): Promise<any> {
  return AxiosInterceptor.post(`User/Upsert`, payload);
}

export async function upsertProfileInfo(payload: any): Promise<any> {
  return AxiosInterceptor.post(`User/ProfileUpsert`, payload);
}

export async function getBooksList(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Books/BooKList`, payload);
}

export async function upsertBookDetails(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Books/Upsert`, payload);
}

export async function getBookDetailsById(id:number): Promise<any> {
  return AxiosInterceptor.get(`Books/BookInfo?id=${id}`);
}

export async function deleteBookById(id:number): Promise<any> {
  return AxiosInterceptor.get(`Books/DeleteBook?id=${id}`);
}

export async function upsertBookExchange(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Books/UpsertBookExchange`, payload);
}