import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Trash2, Plus, Edit, X, Loader2} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { EmployeeCreate,EmployeeOut } from "@/types/employee"

type EditingStep = "employee_id" | "name" | "done"

export type Employee = EmployeeCreate & {
  id: number
  selected: boolean
  editingStep: EditingStep
  readOnly: boolean
}

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  const employeeIdRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const nameRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // フォーカス用エフェクト
  useEffect(() => {
    const last = employees[employees.length - 1]
    if (last?.editingStep === "employee_id") {
      setTimeout(() => employeeIdRefs.current[last.id]?.focus(), 0)
    }
  }, [employees])




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

  const isAnyIncomplete = employees.some(
    (e) =>
      !e.readOnly &&
      ((e.editingStep === "employee_id" && e.employee_id === null) ||
        (e.editingStep === "name" && (e.name ?? "").trim() === ""))
  )

  const handleEditComplete = async (id: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== id) return emp

        if (emp.editingStep === "employee_id" && emp.employee_id !== null) {
          return { ...emp, editingStep: "name" }
        }
        if (emp.editingStep === "name" && (emp.name ?? "").trim() !== "") {
          return { ...emp, editingStep: "done" }
        }
        return emp
      })
    )

    const emp = employees.find((e) => e.id === id)
    if (!emp) return

    if (
      emp.employee_id !== null &&
      emp.editingStep === "name" &&
      (emp.name ?? "").trim() !== ""
    ) {
      const isUnique = await checkEmployeeIdUnique(emp.employee_id)
      if (isUnique) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === id ? { ...e, readOnly: true } : e))
        )
        alert("登録されました")
        await addNewEmployeeToDatabase(emp)
        await reloadEmployeeList()
      } else {
        alert("社員番号が重複しています")
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, employee_id: null, editingStep: "employee_id" } : e
          )
        )
        setTimeout(() => employeeIdRefs.current[id]?.focus(), 0)
      }
    } else if (emp.editingStep === "employee_id") {
      setTimeout(() => nameRefs.current[id]?.focus(), 0)
    }
  }

const addNewEmployeeToDatabase = async (emp: Employee) => {
  const payload_name: EmployeeCreate = {
    employee_id: emp.employee_id,
    name: emp.name ?? null,
  }

  const payload = {
    employee_id: emp.employee_id,
  }

  try {
    console.log("payload for private_info:", payload)

    // 複数のリクエストを順番に実行（失敗したら例外を投げる）
    await api.post("/employees/", payload_name, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/employment_history/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/project_info/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/skill_info/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/insight_info/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/private_info/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/related_info/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    await api.post("/operation_logs/", payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("すべての更新に成功しました");
  } catch (err) {
    console.error("更新に失敗しました:", err);
  }
};


  const reloadEmployeeList = async () => {
    try {
      const res = await api.get("/employees/");
      const loadedEmployees: Employee[] = res.data.map((emp: EmployeeOut ) => ({
        ...emp,
        selected: false,
        editingStep: "done",
        readOnly: true,
        photo_url: emp.photo_url ?? "/placeholder.svg?height=200&width=200",
      }))
      setEmployees(loadedEmployees)
      setIsLoading(false)
      console.log("社員リストを取得しました")
    } catch (err) {
      console.error("社員リストの取得に失敗しました:", err)
    }
  }

  useEffect(() => {
    reloadEmployeeList()
  }, [])

  const checkEmployeeIdUnique = async (id: number): Promise<boolean> => {
    const existingIds = employees.filter((e) => e.readOnly).map((e) => e.employee_id)
    return !existingIds.includes(id)
  }

  const handleCancel = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleEditComplete(id)
    }
  }

  const handleBlur = (id: number) => {
    handleEditComplete(id)
  }

  const toggleSelect = (id: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, selected: !emp.selected } : emp))
    )
  }

  const deleteSelected = async (id: number) => {
    const selectedEmployees = employees.filter((emp) => emp.selected && emp.readOnly)
    for (const emp of selectedEmployees) {
      try {
          await api.delete(`/employment_history/${emp.id}`, {
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/project_info/${emp.id}`, {
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/skill_info/${emp.id}`, {
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/insight_info/${emp.id}` ,{
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/private_info/${emp.id}`,{
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/related_info/${emp.id}`,{
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/operation_logs/${emp.id}`,  {
            headers: { "Content-Type": "application/json" },
          });

          await api.delete(`/employees/${emp.id}`, {
            headers: { "Content-Type": "application/json" },
          });

          console.log("削除に成功しました");
        } catch (err) {
          console.error("削除に失敗しました:", err);
        }
    }

    setEmployees((prev) => prev.filter((emp) => !(emp.selected && emp.readOnly)))
  }



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
              <div
                key={employee.employee_id}
                className="bg-white rounded-lg shadow-md overflow-hidden relative"
              >
                {/* チェックボックス */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={employee.selected}
                    onChange={() => toggleSelect(employee.id)}
                    className="h-5 w-5"
                    disabled={isAnyIncomplete}
                  />
                </div>

                {/* 中断ボタン */}
                {!employee.readOnly && (
                  <button
                    onClick={() => handleCancel(employee.id)}
                    className="absolute top-3 right-3 z-10 text-gray-500 hover:text-red-600"
                  >
                    <div className="flex gap-2 items-center">
                      <p className="text-sm">追加を中断</p>
                      <X />
                    </div>
                  </button>
                )}

                <div className="w-full h-48 relative">
                  <Image
                    src={employee.photo_url}
                    alt={employee.name || "写真"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <input
                    ref={(el) => {
                      employeeIdRefs.current[employee.id] = el;
                    }}
                    className="w-full px-2 py-1 rounded text-sm flex items-end"
                    placeholder="5桁の社員番号を入力"

                    value={
                      employee.readOnly
                        ? String(employee.employee_id ?? "").padStart(5, "0")
                        : employee.employee_id ?? ""
                    }
                    readOnly={employee.readOnly || employee.editingStep !== "employee_id"}

                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length > 5) {
                        alert("社員番号は5桁以内で入力してください。");
                        return;
                      }
                      const numVal =
                        val === "" ? null : isNaN(Number(val)) ? null : Number(val);
                      setEmployees((prev) =>
                        prev.map((emp) =>
                          emp.id === employee.id ? { ...emp, employee_id: numVal } : emp
                        )
                      );
                    }}

                    onKeyDown={(e) => handleKeyDown(e, employee.id)}
                    onBlur={() => handleBlur(employee.id)}
                  />
                  {employee.editingStep !== "employee_id" && (
                    <input
                      ref={(el) => {
                        nameRefs.current[employee.id] = el
                      }}
                      className="w-full px-2 py-1 rounded pt-0"
                      placeholder="名前を入力"
                      value={employee.name ?? ""}
                      readOnly={employee.readOnly || employee.editingStep !== "name"}
                      onChange={(e) => {
                        const val = e.target.value
                        setEmployees((prev) =>
                          prev.map((emp) =>
                            emp.id === employee.id ? { ...emp, name: val } : emp
                          )
                        )
                      }}
                      onKeyDown={(e) => handleKeyDown(e, employee.id)}
                      onBlur={() => handleBlur(employee.id)}
                    />
                  )}

                  {employee.readOnly && (
                    <button
                      onClick={() => goToDetail(employee.id)}
                      disabled={isAnyIncomplete}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                      <Edit size={16} />
                      詳細を見る
                    </button>
                  )}
                </div>
              </div>
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
        {isLoading && (<div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 shadow-lg rounded-lg border z-50">
          <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
          <span className="text-sm">データ取得中…<br/>少々お待ちください</span>
        </div>)}
      </div>
  )
}

export default EmployeeDirectory
