export default function LoginPage() {
  const clientId = process.env.BASE_CLIENT_ID;
  const callbackUrl = process.env.BASE_CALLBACK_URL;

  // 認証画面へのURLを作成
  const authUrl = `https://api.thebase.in/1/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=read_items`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">BASE連携 - unsung star</h1>
      <a
        href={authUrl}
        className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition"
      >
        BASEにログインする
      </a>
    </div>
  );
}

