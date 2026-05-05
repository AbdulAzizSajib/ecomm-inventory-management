import { StatusBadge, type BadgeStatus } from "@/components/dashboard/StatusBadge"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Download, CreditCard, DollarSign, RefreshCw, AlertCircle } from "lucide-react"

const payments: {
  id: string
  order: string
  customer: string
  method: string
  amount: string
  status: BadgeStatus
  date: string
}[] = [
  { id: "PAY-8821", order: "#ORD-1052", customer: "Sarah Johnson",  method: "Visa •••• 4242",       amount: "$129.99", status: "paid",     date: "Apr 28, 2026" },
  { id: "PAY-8820", order: "#ORD-1051", customer: "Michael Chen",   method: "PayPal",                amount: "$249.00", status: "paid",     date: "Apr 27, 2026" },
  { id: "PAY-8819", order: "#ORD-1050", customer: "Emma Davis",     method: "Mastercard •••• 8731",  amount: "$89.95",  status: "pending",  date: "Apr 27, 2026" },
  { id: "PAY-8818", order: "#ORD-1049", customer: "James Wilson",   method: "Visa •••• 5566",        amount: "$64.50",  status: "failed",   date: "Apr 26, 2026" },
  { id: "PAY-8817", order: "#ORD-1048", customer: "Lisa Brown",     method: "Apple Pay",             amount: "$45.00",  status: "refunded", date: "Apr 26, 2026" },
  { id: "PAY-8816", order: "#ORD-1047", customer: "David Lee",      method: "Visa •••• 9012",        amount: "$312.00", status: "paid",     date: "Apr 25, 2026" },
  { id: "PAY-8815", order: "#ORD-1046", customer: "Anna Kim",       method: "Google Pay",            amount: "$78.50",  status: "paid",     date: "Apr 25, 2026" },
  { id: "PAY-8814", order: "#ORD-1045", customer: "Robert Taylor",  method: "Amex •••• 3344",        amount: "$199.99", status: "pending",  date: "Apr 24, 2026" },
]

const summaryCards = [
  { label: "Total Revenue",   value: "$48,295", icon: DollarSign,  color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Successful",      value: "1,218",   icon: CreditCard,  color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Pending",         value: "42",      icon: RefreshCw,   color: "text-amber-600",  bg: "bg-amber-50"  },
  { label: "Failed",          value: "24",      icon: AlertCircle, color: "text-red-600",    bg: "bg-red-50"    },
]

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payments"
        description="Track all payment transactions"
        action={
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="size-3.5" />
            Export
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <div className={`size-7 rounded-md flex items-center justify-center ${bg}`}>
                <Icon className={`size-3.5 ${color}`} />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-900 tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Method</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900 font-mono text-xs">{payment.id}</td>
                  <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{payment.order}</td>
                  <td className="px-5 py-3.5 text-gray-700">{payment.customer}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{payment.method}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{payment.date}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 tabular-nums">{payment.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={payment.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing 8 of 1,284 transactions</p>
          <div className="flex items-center gap-1">
            <button className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors" disabled>
              Previous
            </button>
            <button className="h-7 px-3 rounded-md border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
