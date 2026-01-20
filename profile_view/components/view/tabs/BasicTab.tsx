import { FC } from "react";
import { User, Calendar, MapPin, GraduationCap } from "lucide-react";
import { EmployeeOut } from "@/types/employee";
import { EmploymentHistoryUnit } from "@/lib/profile-utils";

interface BasicTabProps {
  employees: EmployeeOut | null;
  employmentHistory: EmploymentHistoryUnit[];
}

export const BasicTab: FC<BasicTabProps> = ({ employees, employmentHistory }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">プロフィール</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">氏名</p>
                {employees && <p className="font-medium">{employees.name}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">フリガナ</p>
                {employees && <p className="font-medium">{employees.kana}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">生年月日</p>
                {employees && <p className="font-medium">{employees.birthdate}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">出身地</p>
                {employees && <p className="font-medium">{employees.hometown}</p>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">学歴</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">小学校</p>
                {employees && <p className="font-medium">{employees.elementary_school}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">中学校</p>
                {employees && <p className="font-medium">{employees.junior_high_school}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">高等学校</p>
                {employees && <p className="font-medium">{employees.high_school}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500">大学</p>
                {employees && (
                  <p className="font-medium">
                    {employees.university} {employees.faculty}
                  </p>
                )}
              </div>
            </div>

            {employees && employees.graduate_school && (
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">大学院</p>
                  <p className="font-medium">
                    {employees.graduate_school} {employees.major}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-10">職歴</h2>
        <div className="space-y-6">
          {employmentHistory.map((history, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{history.company_name ?? "なし"}</h3>
                <p className="text-sm text-slate-500">
                  {history.start_date ?? "開始不明"} - {history.end_date ?? "終了不明"}
                </p>
              </div>
              <p className="text-slate-700 mb-3">{history.job_title ?? "職種不明"}</p>

              {history.description && (
                <>
                  <p className="text-sm text-slate-600 mb-2">業務内容:</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 mb-3 ml-2">
                    {history.description.split("\n").map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </>
              )}

              {history.knowledge && (
                <>
                  <p className="text-sm text-slate-600 mb-2">獲得した知見・強み:</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 ml-2">
                    {history.knowledge.split("\n").map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
