import { useState } from "react"
import Image from "next/image"
import { Trash2, Plus, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

// Define employee type
interface Employee {
  id: string
  name: string
  role: string
  photoUrl: string
  selected: boolean
}

export default function EmployeeDirectory() {
  // Sample employee data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "001",
      name: "新規 社員",
      role: "不明",
      photoUrl: "/placeholder.svg?height=200&width=200",
      selected: false,
    },
  ])

  // Toggle employee selection
  const toggleSelect = (id: string) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, selected: !emp.selected } : emp)))
  }

  // Delete selected employees
  const deleteSelected = () => {
    setEmployees(employees.filter((emp) => !emp.selected))
  }

  // Add new employee (placeholder function)
  const addEmployee = () => {
    const newId = `${String(employees.length + 1).padStart(3, "0")}`
    const newEmployee: Employee = {
      id: newId,
      name: "新規 社員",
      role: "不明",
      photoUrl: "/placeholder.svg?height=200&width=200",
      selected: false,
    }
    setEmployees([...employees, newEmployee])
  }

  const router = useRouter()

  const goToDetail = () => {
    router.replace("../view")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">プロフィール情報</h1>
          <div className="w-12 h-12 relative">
            <Image src="/placeholder.svg?height=48&width=48" alt="Company Logo" fill className="object-contain" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Employee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              {/* Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={employee.selected}
                  onChange={() => toggleSelect(employee.id)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Employee Photo */}
              <div className="w-full h-48 relative">
                <Image
                  src={employee.photoUrl || "/placeholder.svg"}
                  alt={employee.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Employee Details */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{employee.id}</p>
                <h3 className="font-semibold text-lg mb-1">{employee.name}</h3>
                <p className="text-gray-600">{employee.role}</p>

                {/* Show Button */}
                <button className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" onClick={goToDetail}>
                  <Edit size={16} />
                  <span>詳細を見る</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-8 inset-x-0 flex justify-center">
        <button
          onClick={addEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>メンバーを追加</span>
        </button>
      </div>

      {/* Delete Button */}
      {employees.some((emp) => emp.selected) && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={deleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={20} />
            <span>削除</span>
          </button>
        </div>
      )}
    </div>
  )
}
