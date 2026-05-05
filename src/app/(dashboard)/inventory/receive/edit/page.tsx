import { Suspense } from "react"
import { Loader2 } from "lucide-react"

import { EditReceiveForm } from "./EditReceiveForm"

export default function EditReceivePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading…
        </div>
      }
    >
      <EditReceiveForm />
    </Suspense>
  )
}
