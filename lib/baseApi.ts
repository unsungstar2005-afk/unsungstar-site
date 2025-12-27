import { BaseItem } from "@/types";
import { getValidAccessToken } from "@/lib/tokenManager"; 

export async function getItems(): Promise<BaseItem[]> {
  const token = await getValidAccessToken();

  // もしトークンが空っぽだったらエラーにする
  if (!token) {
    throw new Error("トークンが取得できませんでした（空です）");
  }

  const response = await fetch("https://api.thebase.in/1/items", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", 
  });

  if (!response.ok) {
    // ★ここが修正点：BASEからの詳しいエラー理由を取得する
    const errorBody = await response.text();
    console.error("API Error:", errorBody);
    throw new Error(`データ取得失敗 (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.items;
}