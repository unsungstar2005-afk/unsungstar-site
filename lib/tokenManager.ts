import fs from "fs/promises";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "tokens.json");

type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export async function getValidAccessToken(): Promise<string> {
  let tokens: Tokens | null = null;
  try {
    const data = await fs.readFile(TOKEN_PATH, "utf-8");
    tokens = JSON.parse(data);
  } catch {
    // ファイルがない場合
  }

  if (!tokens) {
    throw new Error("ログインが必要です。 http://127.0.0.1:3000/login からログインしてください。");
  }

  // 現在時刻（秒）
  const now = Math.floor(Date.now() / 1000);
  
  // ▼デバッグログ（必ずターミナルに出ます）
  console.log("---------------------------------");
  console.log("現在時刻:", now);
  console.log("有効期限:", tokens.expires_at);
  console.log("残り時間:", Math.floor(tokens.expires_at - now), "秒");
  
  // 期限切れチェック（残り60秒以下なら更新）
  if (tokens.expires_at > now + 60) {
    console.log("✅ トークンは有効です。そのまま使います。");
    console.log("---------------------------------");
    return tokens.access_token;
  }

  console.log("⚠️ トークン期限切れ（または不正）のため、自動更新を試みます...");
  console.log("---------------------------------");

  // ここで更新処理
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.BASE_CLIENT_ID!,
    client_secret: process.env.BASE_CLIENT_SECRET!,
    refresh_token: tokens.refresh_token,
    redirect_uri: process.env.BASE_CALLBACK_URL!,
  });

  const response = await fetch("https://api.thebase.in/1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    // ★ここが重要！本当のエラー理由を表示する
    const errorJson = await response.json();
    console.error("❌ BASE更新エラー詳細:", JSON.stringify(errorJson, null, 2));
    throw new Error(`トークン更新失敗: ${errorJson.error_description || errorJson.error || "不明なエラー"}`);
  }

  const newTokens = await response.json();

  // 更新後の保存処理（保険付き）
  const savedData: Tokens = {
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token,
    // expires_in が取れない場合は 7200秒（2時間）とみなす
    expires_at: now + (newTokens.expires_in || 7200),
  };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(savedData, null, 2));
  
  console.log("✨ トークンを更新して保存しました！");
  return savedData.access_token;
}

// 最初のログイン時に保存する関数
export async function saveInitialTokens(data: any) {
  const now = Math.floor(Date.now() / 1000);
  const savedData: Tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    // ここも保険付き：expires_in がない場合は2時間後にする
    expires_at: now + (data.expires_in || 7200),
  };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(savedData, null, 2));
  console.log("📝 初期トークンを保存しました。期限:", savedData.expires_at);
}