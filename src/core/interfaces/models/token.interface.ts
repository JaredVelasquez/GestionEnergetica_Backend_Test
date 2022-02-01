export interface token {
  exp: Date,
  data: {
    UserID: number,
    UserNAME: string,
    Role: number
  }
}
