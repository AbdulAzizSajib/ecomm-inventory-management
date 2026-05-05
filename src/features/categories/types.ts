export type ActiveFlag = "Y" | "N"

export interface Category {
  CategoryCode: number
  CategoryName: string
  Active: ActiveFlag
}

export interface CreateCategoryRequest {
  name: string
  attributes: number[]
}

export type UpdateCategoryRequest = CreateCategoryRequest
