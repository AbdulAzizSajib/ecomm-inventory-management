export const endpoints = {
  auth: {
    login: "/admin/auth/login",
  },
  category: {
    base: "/category",
    all: "/category/all-category",
    byId: (id: string | number) => `/category/${id}`,
  },
  brand: {
    base: "/brand",
    byId: (id: string | number) => `/brand/${id}`,
  },
  attribute: {
    base: "/attribute",
    byId: (id: string | number) => `/attribute/${id}`,
  },
  product: {
    base: "/product",
    byId: (code: string) => `/product/${code}`,
    variants: (code: string) => `/product/variants/${code}`,
  },
  plant: {
    base: "/plant",
    byCode: (code: string) => `/plant/${code}`,
  },
  banner: {
    base: "/banner",
    byId: (id: number | string) => `/banner/${id}`,
  },
  supplier: {
    base: "/supplier",
    byId: (id: string) => `/supplier/${id}`,
  },
  receive: {
    base: "/receive",
    byId: (id: string) => `/receive/${id}`,
    search: "/receive/search",
    notReleased: "/receive/not-released",
    notReleasedItems: (id: string) => `/receive/not-release-items/${id}`,
  },
  release: {
    base: "/release",
  },
  stock: {
    statement: "/stock/stock-statement",
    current: "/stock/current-stock",
  },
  order: {
    base: "/order",
    byId: (id: string) => `/order/${id}`,
    deliveryMen: "/order/delivery-man-list",
    statusUpdate: "/order/order-status-update",
  },
} as const
