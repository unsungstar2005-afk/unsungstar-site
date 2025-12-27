import { BaseItem } from "@/types";
// ▼ TokenManagerを使う形に戻します
import { getValidAccessToken } from "@/lib/tokenManager"; 

export async function getItems(): Promise<BaseItem[]> {
  const token = await getValidAccessToken();

  if (!token) return [];

  const response = await fetch("https://api.thebase.in/1/items?limit=20&sort=order", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", 
  });

  if (!response.ok) return [];

  const data = await response.json();
  return data.items || [];
}