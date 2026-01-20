import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { EmployeeOut } from "@/types/employee"
import { Employee, addNewEmployeeToDatabase, deleteEmployeeFromDatabase } from "@/lib/employee-api"

export const useEmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * サーバーから社員リストを取得
   */
  const loadEmployeeList = async () => {
    try {
      const res = await api.get("/employees/")
      const loadedEmployees: Employee[] = res.data.map((emp: EmployeeOut) => ({
        ...emp,
        selected: false,
        editingStep: "done" as const,
        readOnly: true,
        photo_url: emp.photo_url ?? "/placeholder.svg?height=200&width=200",
      }))
      setEmployees(loadedEmployees)
      setIsLoading(false)
      console.log("社員リストを取得しました")
    } catch (err) {
      console.error("社員リストの取得に失敗しました:", err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmployeeList()
  }, [])

  /**
   * 新規社員を追加（ローカル状態のみ）
   */
  const addEmployee = () => {
    const newId = employees.length > 0 ? Math.max(...employees.map((emp) => emp.id)) + 1 : 1
    const newEmployee: Employee = {
      id: newId,
      name: "",
      employee_id: null,
      photo_url: "/placeholder.svg?height=200&width=200",
      selected: false,
      editingStep: "employee_id",
      readOnly: false,
    }
    setEmployees([...employees, newEmployee])
  }

  /**
   * 社員の選択状態をトグル
   */
  const toggleSelect = (id: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, selected: !emp.selected } : emp))
    )
  }

  /**
   * 選択された社員を削除
   */
  const deleteSelected = async () => {
    const selectedEmployees = employees.filter((emp) => emp.selected && emp.readOnly)
    
    for (const emp of selectedEmployees) {
      try {
        await deleteEmployeeFromDatabase(emp.id)
      } catch (err) {
        console.error("削除処理でエラーが発生しました:", err)
      }
    }

    setEmployees((prev) => prev.filter((emp) => !(emp.selected && emp.readOnly)))
  }

  /**
   * 社員IDの一意性チェック
   */
  const checkEmployeeIdUnique = async (id: number): Promise<boolean> => {
    const existingIds = employees.filter((e) => e.readOnly).map((e) => e.employee_id)
    return !existingIds.includes(id)
  }

  /**
   * 新規追加をキャンセル
   */
  const cancelAdd = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  /**
   * 社員情報を更新
   */
  const updateEmployee = (id: number, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    )
  }

  /**
   * 社員を登録してリストをリロード
   */
  const registerEmployee = async (emp: Employee) => {
    try {
      await addNewEmployeeToDatabase(emp)
      await loadEmployeeList()
      alert("登録されました")
    } catch (err) {
      throw err
    }
  }

  /**
   * 未完了の入力があるかチェック
   */
  const isAnyIncomplete = employees.some(
    (e) =>
      !e.readOnly &&
      ((e.editingStep === "employee_id" && e.employee_id === null) ||
        (e.editingStep === "name" && (e.name ?? "").trim() === ""))
  )

  return {
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
  }
}
