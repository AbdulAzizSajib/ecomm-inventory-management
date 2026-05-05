export interface Attribute {
  AttributeId: number
  Name: string
}

export interface CreateAttributeRequest {
  name: string
}

export type UpdateAttributeRequest = CreateAttributeRequest
