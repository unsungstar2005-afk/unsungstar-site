import { NextResponse } from "next/server";
import { saveTokensToKV } from "@/lib/tokenManager";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code" });

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.BASE_CLIENT_ID!);
  params.append("client_secret", process.env.BASE_CLIENT_SECRET!);
  params.append("code", code);
  params.append("redirect_uri", process.env.BASE_REDIRECT_URI!);

  const res = await fetch("https://api.thebase.in/1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await res.json();

  if (data.access_token) {
    // ▼ ここでデータベースに保存されます！
    await saveTokensToKV(data);
    return NextResponse.json({ message: "認証成功！データベースに保存しました。サイトに戻ってください。" });
  }

  return NextResponse.json(data);
}