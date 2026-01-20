"use client"

import Image from "next/image"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEmployeeList } from "@/hooks/use-employee-list"
import { useEmployeeForm } from "@/hooks/use-employee-form"
import { EmployeeCard } from "./EmployeeCard"

const EmployeeDirectory = () => {
  const router = useRouter()
  
  const {
    employees,
    isLoading,
    addEmployee,
    toggleSelect,
    deleteSelected,
    checkEmployeeIdUnique,
    cancelAdd,
    updateEmployee,
    registerEmployee,
    isAnyIncomplete,
  } = useEmployeeList()

  const {
    employeeIdRefs,
    nameRefs,
    handleKeyDown,
    handleBlur,
    handleEmployeeIdChange,
    handleNameChange,
  } = useEmployeeForm({
    employees,
    updateEmployee,
    checkEmployeeIdUnique,
    registerEmployee,
  })

  const goToDetail = (id: number) => {
    router.push(`/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto my-0 px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">プロフィール情報</h1>
          <div className="w-12 h-12 relative">
            <Image
              src="/iconimage.png?height=48&width=48"
              alt="Company Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...employees]
            .sort((a, b) => (a.employee_id ?? 0) - (b.employee_id ?? 0))
            .map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                isAnyIncomplete={isAnyIncomplete}
                employeeIdRef={(el) => {
                  employeeIdRefs.current[employee.id] = el
                }}
                nameRef={(el) => {
                  nameRefs.current[employee.id] = el
                }}
                onToggleSelect={() => toggleSelect(employee.id)}
                onCancel={() => cancelAdd(employee.id)}
                onEmployeeIdChange={(value) =>
                  handleEmployeeIdChange(employee.id, value)
                }
                onNameChange={(value) => handleNameChange(employee.id, value)}
                onKeyDown={(e) => handleKeyDown(e, employee.id)}
                onBlur={() => handleBlur(employee.id)}
                onViewDetail={() => goToDetail(employee.id)}
              />
            ))}
        </div>
      </main>

      {/* 追加ボタン */}
      <div className="fixed bottom-8 inset-x-0 flex justify-center pointer-events-none">
        <button
          onClick={addEmployee}
          disabled={isAnyIncomplete}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto"
        >
          <Plus size={20} />
          メンバーを追加
        </button>
      </div>

      {/* 削除ボタン */}
      {employees.some((emp) => emp.selected) && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={deleteSelected}
            disabled={isAnyIncomplete}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          >
            <Trash2 size={20} />
            削除
          </button>
        </div>
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 shadow-lg rounded-lg border z-50">
          <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
          <span className="text-sm">
            データ取得中…
            <br />
            少々お待ちください
          </span>
        </div>
      )}
    </div>
  )
}

export default EmployeeDirectory
