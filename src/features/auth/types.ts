export interface AuthUser {
  UserId: string
  UserName: string
  JoiningDate: string
  Designation: string
  email: string
  grpAdd: boolean
  grpSup: boolean
  grpISup: boolean
  grpUser: boolean
  Active: string
  InvoiceFormat: string
  PlantCode: string
  roles: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  token: string
  message: string
  status: string
}
