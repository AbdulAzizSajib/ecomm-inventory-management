export interface MonthClosePeriod {
  Period: string
  PlantCode: string
  ManualPeriod: string | null
}

export interface MonthClosePeriodResponse {
  success: boolean
  data: MonthClosePeriod[]
}

export interface CloseMonthPayload {
  plantCode: string
  fromDate: string
  toDate: string
}

export interface CloseMonthResponse {
  success?: boolean
  message?: string
}
