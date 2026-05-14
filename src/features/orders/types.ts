export interface Order {
  IssueNo: string
  IssueDate: string
  PlantCode: string
  StoreCode: string
  MovementId: string
  CustomerCode: string
  OrderNo: string
  VehicleNo: string
  Period: string
  Posted: string
  Mushok: string
  Returned: string
  GatePass: string
  SendMail: string | null
  CreateBy: string
  CreateDate: string
  EditBy: string
  EditDate: string | null
  VatChallanNo: string
  VatChallanDate: string | null
  OrderStatusId: number
  Status: string
}

export interface OrderListResponse {
  page: number
  limit: number
  total: number
  totalPage: number
  data: Order[]
}

export interface OrderListParams {
  page: number
  limit: number
}

export interface DeliveryMan {
  UserId: string
  RoleId: number
  UserName: string
  JoiningDate: string
  Designation: string
  email: string
  Active: string
}

export interface DeliveryManListResponse {
  data: DeliveryMan[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

export interface UpdateOrderStatusPayload {
  issue_no: string
  status_id: number
  delivery_man_id?: string | number | null
}

export interface OrderTrackingItem {
  ProductCode: string
  ProductName: string
  VariantId: number
  SKU: string
  BarCode: string
  UnitPrice: number
  Net: number
  Quantity?: number
}

export interface OrderTrackingBillingAddress {
  full_name: string
  mobile: string
  address: string
}

export interface OrderTrackingData {
  IssueNo: string
  IssueDate: string
  CustomerCode: string
  OrderStatus: string
  ShippingCost: number
  PaymentMethodId: number
  BillingAddress: OrderTrackingBillingAddress
  Items: OrderTrackingItem[]
}

export interface OrderTrackingResponse {
  statusCode: number
  message: string
  data: OrderTrackingData
}
