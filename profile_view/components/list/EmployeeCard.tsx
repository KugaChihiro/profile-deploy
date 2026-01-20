import Image from "next/image"
import { Edit, X } from "lucide-react"
import { Employee } from "@/lib/employee-api"

type EmployeeCardProps = {
  employee: Employee
  isAnyIncomplete: boolean
  employeeIdRef: (el: HTMLInputElement | null) => void
  nameRef: (el: HTMLInputElement | null) => void
  onToggleSelect: () => void
  onCancel: () => void
  onEmployeeIdChange: (value: string) => void
  onNameChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onBlur: () => void
  onViewDetail: () => void
}

export const EmployeeCard = ({
  employee,
  isAnyIncomplete,
  employeeIdRef,
  nameRef,
  onToggleSelect,
  onCancel,
  onEmployeeIdChange,
  onNameChange,
  onKeyDown,
  onBlur,
  onViewDetail,
}: EmployeeCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      {/* チェックボックス */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={employee.selected}
          onChange={onToggleSelect}
          className="h-5 w-5"
          disabled={isAnyIncomplete}
        />
      </div>

      {/* 中断ボタン */}
      {!employee.readOnly && (
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-red-600"
        >
          <div className="flex gap-2 items-center">
            <p className="text-sm">追加を中断</p>
            <X />
          </div>
        </button>
      )}

      {/* プロフィール写真 */}
      <div className="w-full h-48 relative">
        <Image
          src={employee.photo_url || "/placeholder.svg?height=200&width=200"}
          alt={employee.name || "写真"}
          fill
          className="object-cover"
        />
      </div>

      {/* 入力フィールド */}
      <div className="p-4 space-y-2">
        <input
          ref={employeeIdRef}
          className="w-full px-2 py-1 rounded text-sm flex items-end"
          placeholder="5桁の社員番号を入力"
          value={
            employee.readOnly
              ? String(employee.employee_id ?? "").padStart(5, "0")
              : employee.employee_id ?? ""
          }
          readOnly={employee.readOnly || employee.editingStep !== "employee_id"}
          onChange={(e) => onEmployeeIdChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />

        {employee.editingStep !== "employee_id" && (
          <input
            ref={nameRef}
            className="w-full px-2 py-1 rounded pt-0"
            placeholder="名前を入力"
            value={employee.name ?? ""}
            readOnly={employee.readOnly || employee.editingStep !== "name"}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
        )}

        {employee.readOnly && (
          <button
            onClick={onViewDetail}
            disabled={isAnyIncomplete}
            className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Edit size={16} />
            詳細を見る
          </button>
        )}
      </div>
    </div>
  )
}
