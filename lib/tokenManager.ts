import { kv } from "@vercel/kv";

const KV_KEY = "base_tokens";

type BaseTokens = {
  access_token: string;
  refresh_token: string;
  created_at: number;
  expires_in: number;
};

// 1. 有効なトークンを取り出す（なければ更新する）
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await kv.get<BaseTokens>(KV_KEY);

  // まだデータベースが空っぽの場合（最初の1回など）
  if (!tokens) {
    console.log("⚠️ KVが空です。環境変数(BASE_ACCESS_TOKEN)を確認します。");
    return process.env.BASE_ACCESS_TOKEN || null;
  }

  // 期限切れチェック
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = tokens.created_at + tokens.expires_in;

  // 期限切れ5分前なら更新
  if (now >= expirationTime - 300) {
    console.log("🔄 トークン更新中...");
    return await refreshAccessToken(tokens.refresh_token);
  }

  return tokens.access_token;
}

// 2. トークンを更新してデータベースに保存
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.BASE_CLIENT_ID!);
  params.append("client_secret", process.env.BASE_CLIENT_SECRET!);
  params.append("refresh_token", refreshToken);
  params.append("redirect_uri", process.env.BASE_REDIRECT_URI!);

  try {
    const res = await fetch("https://api.thebase.in/1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await res.json();
    if (!data.access_token) return null;

    await saveTokensToKV(data);
    return data.access_token;
  } catch (error) {
    console.error("更新エラー:", error);
    return null;
  }
}

// 3. 保存処理
export async function saveTokensToKV(data: any) {
  const tokens: BaseTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    created_at: Math.floor(Date.now() / 1000),
    expires_in: data.expires_in,
  };
  await kv.set(KV_KEY, tokens);
}