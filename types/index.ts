// types/index.ts

// 必ず "export" をつけて定義します
export type BaseItem = {
  item_id: number;
  title: string;
  detail: string | null;
  price: number;
  img1_origin: string | null;
  img2_origin: string | null;
  img3_origin: string | null;
  img4_origin: string | null;
  img5_origin: string | null;
  stock: number;
  // その他、APIから返ってくる可能性のあるデータ
  modified?: number;
  shop_id?: string;
};