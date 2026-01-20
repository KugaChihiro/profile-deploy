import { useRef, useEffect } from "react"
import { Employee } from "@/lib/employee-api"

type UseEmployeeFormProps = {
  employees: Employee[]
  updateEmployee: (id: number, updates: Partial<Employee>) => void
  checkEmployeeIdUnique: (id: number) => Promise<boolean>
  registerEmployee: (emp: Employee) => Promise<void>
}

export const useEmployeeForm = ({
  employees,
  updateEmployee,
  checkEmployeeIdUnique,
  registerEmployee,
}: UseEmployeeFormProps) => {
  const employeeIdRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const nameRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // 新規追加時に社員番号フィールドへフォーカス
  useEffect(() => {
    const last = employees[employees.length - 1]
    if (last?.editingStep === "employee_id") {
      setTimeout(() => employeeIdRefs.current[last.id]?.focus(), 0)
    }
  }, [employees])

  /**
   * 編集完了処理（Enter or blur時）
   */
  const handleEditComplete = async (id: number) => {
    const emp = employees.find((e) => e.id === id)
    if (!emp) return

    // 社員番号入力完了 → 名前入力へ
    if (emp.editingStep === "employee_id" && emp.employee_id !== null) {
      updateEmployee(id, { editingStep: "name" })
      setTimeout(() => nameRefs.current[id]?.focus(), 0)
      return
    }

    // 名前入力完了 → 登録処理
    if (
      emp.editingStep === "name" &&
      (emp.name ?? "").trim() !== "" &&
      emp.employee_id !== null
    ) {
      const isUnique = await checkEmployeeIdUnique(emp.employee_id)
      
      if (isUnique) {
        updateEmployee(id, { readOnly: true, editingStep: "done" })
        try {
          await registerEmployee(emp)
        } catch (err) {
          console.error("登録処理でエラーが発生:", err)
          alert("登録に失敗しました")
          updateEmployee(id, { readOnly: false, editingStep: "name" })
        }
      } else {
        alert("社員番号が重複しています")
        updateEmployee(id, { employee_id: null, editingStep: "employee_id" })
        setTimeout(() => employeeIdRefs.current[id]?.focus(), 0)
      }
    }
  }

  /**
   * キーダウン処理（Enterキー）
   */
  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleEditComplete(id)
    }
  }

  /**
   * ブラー処理
   */
  const handleBlur = (id: number) => {
    handleEditComplete(id)
  }

  /**
   * 社員番号の変更処理
   */
  const handleEmployeeIdChange = (id: number, value: string) => {
    if (value.length > 5) {
      alert("社員番号は5桁以内で入力してください。")
      return
    }
    const numVal = value === "" ? null : isNaN(Number(value)) ? null : Number(value)
    updateEmployee(id, { employee_id: numVal })
  }

  /**
   * 名前の変更処理
   */
  const handleNameChange = (id: number, value: string) => {
    updateEmployee(id, { name: value })
  }

  return {
    employeeIdRefs,
    nameRefs,
    handleKeyDown,
    handleBlur,
    handleEmployeeIdChange,
    handleNameChange,
  }
}
