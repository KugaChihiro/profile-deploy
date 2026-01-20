import { FC } from "react";
import { FolderKanban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectInfo, ProjectMember } from "@/types/project_management";
import { EmployeeOut } from "@/types/employee";

interface ProjectTabProps {
  managementProjects: ProjectInfo[];
  projectMembers: ProjectMember[];
  employees: EmployeeOut | null;
}

export const ProjectTab: FC<ProjectTabProps> = ({
  managementProjects,
  projectMembers,
  employees,
}) => {
  console.log('ProfessionalTab - managementProjects:', managementProjects);
  console.log('ProfessionalTab - projectMembers:', projectMembers);
  console.log('ProfessionalTab - employees:', employees);

  const handleProjectClick = (projectId: number) => {
    // 元のコードと同じ認証フローを使用
    const targetUrl = `https://black-sea-021879300.1.azurestaticapps.net/${projectId}?tab=structure`;
    const authUrl = `https://black-sea-021879300.1.azurestaticapps.net/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(targetUrl)}`;
    window.open(authUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FolderKanban className="h-6 w-6" />
          参画プロジェクト
        </h2>
        {managementProjects.length > 0 ? (
          managementProjects.map((project, idx) => (
            <div className="space-y-4 gap-3 mb-5" key={idx}>
              <Card
                className="border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <Badge className="bg-gray-500">
                      {project.start_date ?? "不明"} - {project.end_date ?? "不明"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm text-slate-600 mb-3">
                    <p className="font-medium text-slate-700">業界分類:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.industry_categories && Array.isArray(project.industry_categories)
                        ? project.industry_categories.map((category, catIndex) => (
                            <Badge key={catIndex} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))
                        : project.industry_categories
                          ? <span>{JSON.stringify(project.industry_categories)}</span>
                          : "情報なし"
                      }
                    </div>

                    <p className="font-medium text-slate-700">プロジェクト種別:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.type_categories && Array.isArray(project.type_categories)
                        ? project.type_categories.map((type, typeIndex) => (
                            <Badge key={typeIndex} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))
                        : project.type_categories
                          ? <span>{JSON.stringify(project.type_categories)}</span>
                          : "情報なし"
                      }
                    </div>
                  </div>

                  {/* チームメンバー表示 */}
                  {projectMembers
                    .filter(member => member.project_id === project.id)
                    .map(member => (
                      <div key={member.project_id} className="mt-2">
                        <p className="text-xs text-slate-500">チームメンバー:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.member_names.split(',').map((name, nameIndex) => (
                            <Badge
                              key={nameIndex}
                              variant="outline"
                              className={`text-xs ${
                                name.trim() === employees?.name
                                  ? 'bg-yellow-200 border-yellow-400'
                                  : ''
                              }`}
                            >
                              {name.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  }
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-slate-500">
            <FolderKanban className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>参画プロジェクト情報が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
};
