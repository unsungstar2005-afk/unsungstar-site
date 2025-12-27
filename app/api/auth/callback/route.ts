import { NextResponse } from "next/server";
import { saveInitialTokens } from "@/lib/tokenManager";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "認証コードが見つかりませんでした。" }, { status: 400 });
  }

  // 環境変数(.env.local)から値を読み込む
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.BASE_CLIENT_ID!);
  params.append("client_secret", process.env.BASE_CLIENT_SECRET!);
  params.append("code", code);
  params.append("redirect_uri", process.env.BASE_REDIRECT_URI!);

  try {
    const response = await fetch("https://api.thebase.in/1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();

    // エラーチェック
    if (!data.access_token) {
      console.error("❌ BASE Token Error:", data);
      return NextResponse.json(
        { 
          message: "トークンの取得に失敗しました。", 
          detail: data 
        }, 
        { status: 400 }
      );
    }

    // 成功したら保存
    await saveInitialTokens(data);
    
    // トップページへ戻る
    return NextResponse.redirect(new URL("/", request.url));

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}