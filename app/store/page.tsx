import Image from "next/image";
import { getItems } from "@/lib/baseApi";
// ▼ 階層が変わったので "../" をつけて読み込みます
import DraggableLogo from "../components/DraggableLogo";
// ↓ 回るカードのコンポーネントはもう使わないので削除（またはコメントアウト）
// import InteractiveProductCard from "../components/InteractiveProductCard"; 
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
      {/* ▼ 背景の星空 */}
      <StarBackground />

      {/* ▼ コンテンツエリア */}
      <div className="relative z-10">
        {/* ロゴ（これは回るまま維持） */}
        <DraggableLogo />
        
        <div className="mb-24"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-6xl mx-auto px-4">
          {items.map((item) => (
            <div key={item.item_id} className="group relative z-0">
              {item.img1_origin ? (
                /* ▼ 修正: InteractiveProductCardをやめて、普通のリンク付き画像にしました */
                <a 
                  href={`https://${SHOP_DOMAIN}/items/${item.item_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-xl border border-gray-800 transition-opacity hover:opacity-80"
                >
                  <img
                    src={item.img1_origin}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <div className="relative w-full aspect-[3/4] bg-gray-900 mb-4 rounded-lg flex items-center justify-center text-gray-500 border border-gray-800 shadow-xl">
                  No Image
                </div>
              )}
              
              {/* テキスト情報 */}
              <div className="text-center mt-6">
                <h2 className="text-lg font-medium text-gray-200 line-clamp-1 tracking-wider">
                  {item.title}
                </h2>
                <p className="text-base text-gray-400 mt-2 font-mono">
                  ¥{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}