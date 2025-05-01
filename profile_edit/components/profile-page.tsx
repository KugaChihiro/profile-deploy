"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Briefcase,
  Heart,
  Film,
  GraduationCap,
  MapPin,
  Calendar,
  Code,
  Lightbulb,
  FolderKanban,
  Users,
  Building,
  Music,
  Dumbbell,
  Coffee,
  CircleUser,
  Pizza,
  Palmtree,
  Tv,
} from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic")

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <Card className="shadow-lg border-none">
        <CardContent className="p-0">
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-t-lg"></div>
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="プロフィール写真" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">基本情報</span>
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">業務情報</span>
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">プライベート情報</span>
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  <span className="hidden sm:inline">関連情報</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">プロフィール</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">氏名</p>
                          <p className="font-medium">山田 太郎</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">フリガナ</p>
                          <p className="font-medium">ヤマダ タロウ</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">生年月日</p>
                          <p className="font-medium">1990年1月1日</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">出身地</p>
                          <p className="font-medium">東京都</p>
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
                          <p className="font-medium">東京都立 桜小学校</p>
                          <p className="text-sm text-slate-500">2002年4月 - 2008年3月</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">中学校</p>
                          <p className="font-medium">東京都立 桜中学校</p>
                          <p className="text-sm text-slate-500">2008年4月 - 2011年3月</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">高等学校</p>
                          <p className="font-medium">東京都立 桜高等学校</p>
                          <p className="text-sm text-slate-500">2011年4月 - 2014年3月</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">大学</p>
                          <p className="font-medium">東京大学 工学部 情報工学科</p>
                          <p className="text-sm text-slate-500">2014年4月 - 2018年3月</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">職歴</h2>
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">株式会社テクノロジー</h3>
                        <p className="text-sm text-slate-500">2018年4月 - 2021年3月</p>
                      </div>
                      <p className="text-slate-700 mb-3">フロントエンドエンジニア</p>
                      <p className="text-sm text-slate-600 mb-2">業務内容:</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 mb-3 ml-2">
                        <li>Reactを用いたWebアプリケーション開発</li>
                        <li>UIコンポーネントライブラリの設計と実装</li>
                        <li>パフォーマンス最適化</li>
                      </ul>
                      <p className="text-sm text-slate-600 mb-2">獲得した知見・強み:</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 ml-2">
                        <li>モダンなフロントエンド開発フレームワークの習得</li>
                        <li>コンポーネント設計のベストプラクティス</li>
                        <li>チーム開発におけるコミュニケーション能力</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">株式会社デジタルソリューションズ</h3>
                        <p className="text-sm text-slate-500">2021年4月 - 現在</p>
                      </div>
                      <p className="text-slate-700 mb-3">フルスタックエンジニア</p>
                      <p className="text-sm text-slate-600 mb-2">業務内容:</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 mb-3 ml-2">
                        <li>Next.jsを用いたWebアプリケーション開発</li>
                        <li>バックエンドAPIの設計と実装（Node.js, Express）</li>
                        <li>データベース設計と最適化（MongoDB, PostgreSQL）</li>
                      </ul>
                      <p className="text-sm text-slate-600 mb-2">獲得した知見・強み:</p>
                      <ul className="list-disc list-inside text-sm text-slate-600 ml-2">
                        <li>フルスタック開発の経験と知識</li>
                        <li>マイクロサービスアーキテクチャの理解</li>
                        <li>プロジェクトマネジメントスキル</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    獲得スキル
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-blue-500">JavaScript</Badge>
                    <Badge className="bg-blue-500">TypeScript</Badge>
                    <Badge className="bg-blue-500">React</Badge>
                    <Badge className="bg-blue-500">Next.js</Badge>
                    <Badge className="bg-blue-500">Node.js</Badge>
                    <Badge className="bg-blue-500">Express</Badge>
                    <Badge className="bg-blue-500">MongoDB</Badge>
                    <Badge className="bg-blue-500">PostgreSQL</Badge>
                    <Badge className="bg-blue-500">GraphQL</Badge>
                    <Badge className="bg-blue-500">Docker</Badge>
                    <Badge className="bg-blue-500">AWS</Badge>
                    <Badge className="bg-blue-500">Git</Badge>
                    <Badge className="bg-blue-500">CI/CD</Badge>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6" />
                    獲得知見
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">フロントエンド開発</h3>
                        <p className="text-sm text-slate-600">
                          モダンなフロントエンド開発フレームワークを使用したSPA/SSRアプリケーションの設計と実装。
                          パフォーマンス最適化、アクセシビリティ、SEOに配慮した開発手法。
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">バックエンド開発</h3>
                        <p className="text-sm text-slate-600">
                          RESTful APIの設計と実装、データベース設計、認証・認可システムの構築。
                          マイクロサービスアーキテクチャの理解と実装経験。
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">プロジェクト管理</h3>
                        <p className="text-sm text-slate-600">
                          アジャイル開発手法（スクラム）の実践、チームリーダーとしての経験。
                          要件定義から納品までの一連のプロセス管理。
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">DevOps</h3>
                        <p className="text-sm text-slate-600">
                          CI/CDパイプラインの構築、コンテナ化技術の活用、クラウドインフラの設計と運用。
                          自動テストとデプロイの効率化。
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FolderKanban className="h-6 w-6" />
                    参画プロジェクト
                  </h2>
                  <div className="space-y-4">
                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">ECサイトリニューアル</h3>
                          <Badge>2019-2020</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          大手アパレルブランドのECサイトをモノリシックなシステムからマイクロフロントエンドアーキテクチャへ刷新。
                          ReactとNext.jsを用いたフロントエンド開発を担当。
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            React
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Next.js
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            GraphQL
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">社内管理システム開発</h3>
                          <Badge>2020-2021</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          従業員管理、勤怠管理、経費精算などの機能を持つ社内管理システムの開発。
                          フロントエンドからバックエンド、インフラ構築まで幅広く担当。
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            TypeScript
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            React
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Node.js
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            PostgreSQL
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">AIチャットボット開発</h3>
                          <Badge>2021-現在</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          自然言語処理技術を活用したカスタマーサポート向けAIチャットボットの開発。
                          フロントエンド開発とAPI連携を担当。
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            React
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            TypeScript
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Node.js
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            OpenAI API
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      家族・背景
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">家族構成</p>
                          <p className="font-medium">父、母、姉、本人</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">親の職業</p>
                          <p className="font-medium">父：会社員（エンジニア）</p>
                          <p className="font-medium">母：小学校教師</p>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                      <Music className="h-6 w-6" />
                      活動歴
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Music className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">習い事</p>
                          <p className="font-medium">ピアノ（6歳〜15歳）</p>
                          <p className="font-medium">英会話（10歳〜18歳）</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Dumbbell className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">部活</p>
                          <p className="font-medium">中学：サッカー部</p>
                          <p className="font-medium">高校：コンピュータ部</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Coffee className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">アルバイト</p>
                          <p className="font-medium">カフェスタッフ（大学1年〜3年）</p>
                          <p className="font-medium">プログラミング講師（大学3年〜4年）</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CircleUser className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">サークル</p>
                          <p className="font-medium">プログラミングサークル</p>
                          <p className="font-medium">軽音楽サークル</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Heart className="h-6 w-6" />
                      趣味・好み
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">趣味</p>
                          <p className="font-medium">ギター演奏</p>
                          <p className="font-medium">登山</p>
                          <p className="font-medium">プログラミング（個人開発）</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Pizza className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きな食べ物</p>
                          <p className="font-medium">ラーメン</p>
                          <p className="font-medium">イタリアン</p>
                          <p className="font-medium">和菓子</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Palmtree className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">休日の過ごし方</p>
                          <p className="font-medium">カフェでプログラミング</p>
                          <p className="font-medium">友人とのアウトドア活動</p>
                          <p className="font-medium">技術書を読む</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Tv className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">好きな芸能人</p>
                          <p className="font-medium">佐藤健</p>
                          <p className="font-medium">新垣結衣</p>
                          <p className="font-medium">星野源</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">プロフィール動画</h2>
                  <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <Film className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-500">プロフィール動画がここに表示されます</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">セミナー動画</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <Film className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">Webフロントエンド最新動向</p>
                        <p className="text-sm text-slate-400">2023年5月</p>
                      </div>
                    </div>

                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <Film className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">React Hooksの活用法</p>
                        <p className="text-sm text-slate-400">2023年8月</p>
                      </div>
                    </div>

                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <Film className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">マイクロフロントエンド入門</p>
                        <p className="text-sm text-slate-400">2023年11月</p>
                      </div>
                    </div>

                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <Film className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">Next.js 14の新機能解説</p>
                        <p className="text-sm text-slate-400">2024年2月</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
