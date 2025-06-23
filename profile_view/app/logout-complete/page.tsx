import Link from 'next/link';

export default function LogoutCompletePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-xl font-bold text-gray-800">
          ログアウト及びサインアウトが完了しました
        </h1>
        <p className="mb-6 text-gray-600">
          セッションを終了いたします。<br/>
          ご利用いただき、ありがとうございました。
        </p>
        <Link
          href="/.auth/login/aad"
          className="inline-block rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          ログインページへ戻る
        </Link>
      </div>
    </div>
  );
}