import { PageHeader } from "@/components/dashboard/PageHeader"
import { UserPlus, Search } from "lucide-react"

const customers = [
  { id: "USR-001", name: "Sarah Johnson",  email: "sarah@example.com",   location: "New York, US",     orders: 12, spent: "$1,429.88", joined: "Jan 14, 2025", verified: true  },
  { id: "USR-002", name: "Michael Chen",   email: "mchen@example.com",   location: "San Francisco, US", orders: 8,  spent: "$987.50",   joined: "Feb 3, 2025",  verified: true  },
  { id: "USR-003", name: "Emma Davis",     email: "emma.d@example.com",  location: "London, UK",       orders: 24, spent: "$3,201.40", joined: "Oct 22, 2024", verified: true  },
  { id: "USR-004", name: "James Wilson",   email: "jwilson@example.com", location: "Chicago, US",      orders: 4,  spent: "$245.00",   joined: "Mar 18, 2025", verified: false },
  { id: "USR-005", name: "Lisa Brown",     email: "lisa.b@example.com",  location: "Toronto, CA",      orders: 16, spent: "$2,115.75", joined: "Nov 5, 2024",  verified: true  },
  { id: "USR-006", name: "David Lee",      email: "dlee@example.com",    location: "Seoul, KR",        orders: 31, spent: "$4,782.20", joined: "Sep 1, 2024",  verified: true  },
  { id: "USR-007", name: "Anna Kim",       email: "anna.k@example.com",  location: "Sydney, AU",       orders: 6,  spent: "$612.30",   joined: "Apr 2, 2025",  verified: false },
  { id: "USR-008", name: "Robert Taylor",  email: "rtaylor@example.com", location: "Berlin, DE",       orders: 9,  spent: "$1,089.45", joined: "Dec 10, 2024", verified: true  },
]

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase()

const avatarColors = [
  "bg-indigo-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500",
  "bg-purple-500", "bg-rose-500", "bg-cyan-500", "bg-orange-500",
]

export default function CustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your customer base"
        action={
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            <UserPlus className="size-3.5" />
            Add Customer
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Orders</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Total Spent</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Verified</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer, i) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                        {initials(customer.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                        <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">{customer.location}</td>
                  <td className="px-5 py-3.5 text-gray-600 tabular-nums hidden sm:table-cell">{customer.orders}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 tabular-nums">{customer.spent}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{customer.joined}</td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {customer.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                        <span className="size-1.5 rounded-full bg-gray-300" />
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing 8 of 8,472 customers</p>
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
