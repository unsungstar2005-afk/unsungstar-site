import Image from "next/image";
import { getItems } from "@/lib/baseApi";
import DraggableLogo from "../components/DraggableLogo";

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white bg-black relative">
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
    <main className="min-h-screen p-8 pb-24 bg-black text-white relative">
      <div className="relative z-10">
        
        {/* ▼ 修正: ロゴを囲むdivを追加し、scale-[2.5] で2.5倍に拡大 */}
        {/* margin-top/bottom も増やして、拡大したロゴが商品と重ならないように調整 */}
        <div className="flex justify-center mt-20 mb-32 transform scale-[2.5] origin-center">
          <DraggableLogo />
        </div>
        
        {/* ロゴ下の余白（念のためさらに広めに確保） */}
        <div className="mb-48"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-6xl mx-auto px-4">
          {items.map((item) => (
            <div key={item.item_id} className="group relative z-0">
              {item.img1_origin ? (
                <a 
                  href={`https://${SHOP_DOMAIN}/items/${item.item_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full aspect-[3/4] mb-4 overflow-hidden transition-opacity hover:opacity-80"
                >
                  <img
                    src={item.img1_origin}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <div className="relative w-full aspect-[3/4] bg-gray-900 mb-4 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              
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