import { FC } from "react";

interface ProjectTabFormProps {
  // 現在はプロジェクト管理ツールへのリンクのみ
}

export const ProjectTabForm: FC<ProjectTabFormProps> = () => {
  return (
    <div>
      <a
        href="https://black-sea-021879300.1.azurestaticapps.net/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
      >
        プロジェクト管理ツールへ →
      </a>
    </div>
  );
};
