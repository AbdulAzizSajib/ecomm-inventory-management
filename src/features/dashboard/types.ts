export interface DashboardSummary {
  MonthlySales: number
  MonthlyOrders: number
  TotalCustomers: number
  TotalProducts: number
  TodayOrders: number
  PendingOrders: number
}

export interface SalesPoint {
  date: string
  sales: number
}

export interface OrderStatusCount {
  Status: string
  total: number
}

export interface TopProduct {
  ProductName: string
  qty: number
  revenue: number
}

export interface LowStockItem {
  ProductName: string
  stock: number
}

export interface RecentOrder {
  IssueNo: string
  IssueDate: string
  Mobile: string
  NetAmount: number
  Status: string
}

export interface DashboardData {
  summary: DashboardSummary
  salesChart: SalesPoint[]
  orderStatus: OrderStatusCount[]
  topProducts: TopProduct[]
  lowStock: LowStockItem[]
  recentOrders: RecentOrder[]
}

export interface DashboardEnvelope {
  statusCode: number
  data: DashboardData
}
