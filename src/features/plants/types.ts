export type ActiveFlag = "0" | "1"

export interface Plant {
  PlantCode: string
  PlantName: string
  PlantAddress: string
  PlantEmail: string
  PlantPhone: string
  Active: ActiveFlag
  UpdateUndeliverd?: string | null
  ProductionReceive?: string | null
  DepotCode?: string | null
  MM_PlantId?: number | string | null
}

export interface PlantRequest {
  PlantCode: string
  PlantName: string
  PlantAddress: string
  PlantEmail: string
  PlantPhone: string
  Active: 0 | 1
}

export type CreatePlantRequest = PlantRequest
export type UpdatePlantRequest = Omit<PlantRequest, "PlantCode">
