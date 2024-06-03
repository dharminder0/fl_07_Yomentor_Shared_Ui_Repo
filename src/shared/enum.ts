export enum Days {
  S = 0,
  M = 1,
  T = 2,
  W = 3,
  Th = 4,
  F = 5,
  Sa = 6,
}

export enum UserType {
  Teacher = 1,
  Parent = 2,
  Student = 3,
}

export enum BatchStatus {
  Open = 1,
  Active = 2,
  Close = 3,
  Aborted = 4,
}

export enum FeeType {
  Hour = 0,
  Day = 1,
  Week = 2,
  Month = 3,
}

export enum Enrollmentstatus {
  Pending = 0,
  Enrolled = 1,
  Accepted = 2,
  Rejected = 3,
  Withdrawn = 4,
}

export enum AttendanceStatus {
  Present = 1,
  Absent = 0,
}

export enum MediaEntityType {
  None = 0,
  Assignment = 1,
  Assessment = 2,
  Users = 3,
  Book = 4,
}

export enum MediaType {
  None = 0,
  Image = 1,
  Video = 2,
  Pdf = 4,
}

export enum FavouriteEntityType {
  None = 0,
  Batch = 1,
  Teacher = 2,
}

export enum TaskStatus {
  Assign = 1,
  Complete = 2,
}

export enum BookExchangeStatus {
  Requested = 1,
  Accepted = 2,
  Declined = 3,
  Delivered = 4,
  Cancelled = 5,
}

export enum QuizStatus {
  Pending = 0,
  Complete = 1,
  Failed = 2,
}

export enum Language {
  HINDI = 1,
  ENGLISH = 2,
  URDU = 3,
  PUNJABI = 4,
  SANSKRIT = 5,
}

export enum ComplexityLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3,
  Advanced = 4
}

export enum Category {
  Academic = 1,
  Competitive_Exams = 2
}
