import { api } from "@/lib/api"
import { EmployeeCreate } from "@/types/employee"

export type Employee = EmployeeCreate & {
  id: number
  selected: boolean
  editingStep: "employee_id" | "name" | "done"
  readOnly: boolean
}

/**
 * 新規社員を全テーブルに登録
 */
export const addNewEmployeeToDatabase = async (emp: Employee) => {
  const payload_name: EmployeeCreate = {
    employee_id: emp.employee_id,
    name: emp.name ?? null,
  }

  const payload = {
    employee_id: emp.employee_id,
  }

  try {
    console.log("payload for employee:", payload)

    await api.post("/employees/", payload_name, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/employment_history/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/project_info/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/skill_info/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/insight_info/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/private_info/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/related_info/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    await api.post("/operation_logs/", payload, {
      headers: { "Content-Type": "application/json" },
    })

    console.log("すべての登録に成功しました")
  } catch (err) {
    console.error("登録に失敗しました:", err)
    throw err
  }
}

/**
 * 選択された社員を全テーブルから削除
 */
export const deleteEmployeeFromDatabase = async (empId: number) => {
  try {
    await api.delete(`/employment_history/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/project_info/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/skill_info/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/insight_info/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/private_info/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/related_info/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/operation_logs/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    await api.delete(`/employees/${empId}`, {
      headers: { "Content-Type": "application/json" },
    })

    console.log("削除に成功しました")
  } catch (err) {
    console.error("削除に失敗しました:", err)
    throw err
  }
}
