#!/bin/bash

echo "🌸 ジブリ風結婚式画像ジェネレーター セットアップ 🌸"
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 環境変数ファイルを作成しています..."
    cp .env.local.example .env.local
    echo "✅ .env.local ファイルが作成されました"
    echo "⚠️  重要: .env.local ファイルにOpenAI APIキーを設定してください"
    echo "   OPENAI_API_KEY=your_api_key_here"
    echo ""
    echo "📌 APIキーは以下から取得できます:"
    echo "   https://platform.openai.com/api-keys"
else
    echo "✅ .env.local ファイルは既に存在します"
fi

echo ""
echo "🚀 開発サーバーを起動しています..."
echo "   http://localhost:3000 でアクセスできます"
echo ""

npm run dev