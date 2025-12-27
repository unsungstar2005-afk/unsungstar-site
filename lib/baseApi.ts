import { BaseItem } from "@/types";
// ↓ 下の行を削除しました（これが諸悪の根源でした）
// import { getValidAccessToken } from "@/lib/tokenManager"; 

export async function getItems(): Promise<BaseItem[]> {
  // 自動更新ファイルの代わりに、Vercelの環境変数から直接読み込みます
  const token = process.env.BASE_ACCESS_TOKEN;

  // もしトークンが空っぽだったらエラーにする
  if (!token) {
    console.error("BASE_ACCESS_TOKEN is missing.");
    // エラーで止まらないように空配列を返すか、必要ならエラーを投げてください
    return []; 
  }

  const response = await fetch("https://api.thebase.in/1/items?limit=20&sort=order", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", 
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("API Error:", errorBody);
    // エラー時は空配列を返してサイトを落とさないようにするのが安全です
    return [];
  }

  const data = await response.json();
  return data.items || []; // itemsがない場合に備えて || [] を追加
}