import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.BASE_CLIENT_ID;
  const redirectUri = process.env.BASE_REDIRECT_URI; // .envで設定したコールバックURL

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "環境変数が設定されていません" });
  }

  // BASEのログイン画面へ飛ばすURLを作る
  const url = `https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=read_items`;

  // そこへ転送する
  return NextResponse.redirect(url);
}