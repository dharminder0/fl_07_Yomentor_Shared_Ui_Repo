import AxiosInterceptor from "./AxiosInterceptor";

export async function getGradeList(): Promise<any> {
  return AxiosInterceptor.get("Grade/list");
}

export async function getUsersList(payload: any): Promise<any> {
  return AxiosInterceptor.post("User/UserSearch", payload);
}

export async function getSubjectByGradeId(gradeId: any): Promise<any> {
  return AxiosInterceptor.get(`Subject/list?gradeId=${gradeId}`);
}

export async function getOpenBatchListbyTeacherId(
  reqPayload: any
): Promise<any> {
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

export async function getAssignStudentAssignments(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Assignments/AssignStudentAssignments`, payload);
}

export async function getAssignStudentAssessments(payload: any): Promise<any> {
  return AxiosInterceptor.post(`Assessments/AssignStudentAssessments`, payload);
}
