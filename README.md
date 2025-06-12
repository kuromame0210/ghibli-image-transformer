# ジブリ風結婚式画像ジェネレーター

スタジオジブリ風の魔法的な結婚式シーンを生成するNext.jsアプリケーションです。

## 特徴

- 📸 写真アップロード機能
- 🎨 カスタマイズ可能な設定（季節、時間帯、色彩、ファンタジー度）
- ✨ AI画像生成（OpenAI DALL-E 3）
- 🎭 スタジオジブリ風のデザインとアニメーション
- 💾 高品質画像のダウンロード機能

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定:
```bash
cp .env.local.example .env.local
```

3. `.env.local`ファイルにOpenAI APIキーを設定:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. 開発サーバーの起動:
```bash
npm run dev
```

## 使用方法

1. カップルの写真をアップロード
2. 季節、時間帯、色彩、ファンタジー度を選択
3. 「ジブリ風画像を生成」ボタンをクリック
4. 生成された画像をダウンロード

## 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- OpenAI DALL-E 3 API
- Lucide React Icons

## API キー取得

OpenAI APIキーは[こちら](https://platform.openai.com/api-keys)から取得できます。

## ライセンス

MIT License