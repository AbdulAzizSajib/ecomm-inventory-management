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
  ImagePath?: string | null
  Remarks?: string | null
}
