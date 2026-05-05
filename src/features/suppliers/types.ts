export type SupplierActive = 0 | 1 | "0" | "1"

export interface Supplier {
  SupplierCode: string
  SupplierName: string
  Address: string
  MobileNo: string
  Active: SupplierActive
}

export interface CreateSupplierRequest {
  SupplierCode: string
  SupplierName: string
  Address: string
  MobileNo: string
  Active: 0 | 1
}

export interface UpdateSupplierRequest {
  SupplierName: string
  Address: string
  MobileNo: string
  Active: 0 | 1
}
