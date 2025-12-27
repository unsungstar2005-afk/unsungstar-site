import Image from "next/image";
import { getItems } from "@/lib/baseApi";
// ▼ 階層が変わったので "../" をつけて読み込みます
import DraggableLogo from "../components/DraggableLogo";
import InteractiveProductCard from "../components/InteractiveProductCard"; 
// ▼ 追加：星空コンポーネントを読み込む
import StarBackground from "../components/StarBackground";

const SHOP_DOMAIN = "unsungstar.official.ec"; 

type Item = {
  item_id: number;
  title: string;
  price: number;
  img1_origin: string | null;
};

export default async function StorePage() {
  let items: Item[] = [];
  let errorDetail = "";

  try {
    items = await getItems();
  } catch (e: any) {
    console.error(e);
    errorDetail = e.message || "不明なエラー";
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white bg-[#111111] relative">
        {/* エラー画面にも星空を出したい場合はここに追加 */}
        <StarBackground />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-red-400">エラーが発生しました</h2>
          <div className="bg-gray-900 p-4 rounded mb-6 max-w-lg w-full overflow-auto border border-gray-800">
            <p className="font-mono text-sm text-gray-300">詳細: {errorDetail}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-24 bg-[#111111] text-white relative">
      {/* ▼ 追加：背景の星空（コンテンツより背面になるよう配置） */}
      <StarBackground />

      {/* ▼ 既存コンテンツを z-10 で囲み、星空より手前に表示させる */}
      <div className="relative z-10">
        {/* ロゴ */}
        <DraggableLogo />
        
        <div className="mb-24"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-6xl mx-auto px-4">
          {items.map((item) => (
            <div key={item.item_id} className="group relative z-0">
              {item.img1_origin ? (
                <InteractiveProductCard
                  src={item.img1_origin}
                  alt={item.title}
                  itemId={item.item_id}
                  shopDomain={SHOP_DOMAIN}
                />
              ) : (
                <div className="relative w-full aspect-[3/4] bg-gray-900 mb-4 rounded-lg flex items-center justify-center text-gray-500 border border-gray-800 shadow-xl">
                  No Image
                </div>
              )}
              <div className="text-center mt-6">
                <h2 className="text-lg font-medium text-gray-200 line-clamp-1 tracking-wider">{item.title}</h2>
                <p className="text-base text-gray-400 mt-2 font-mono">¥{item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}