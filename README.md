# Next.js ナビゲーションブロックとルーティングイベント検知デモ

このプロジェクトは、Next.js の App Router 環境において、ナビゲーションブロック（ページ離脱防止）を実装し、ルーティングイベントを検知する方法を示すデモンストレーションです。

カスタムフック `useNavigationBlock` を用いたページ離脱防止機能の実現例と、Web API を介して各種ルーティングイベントを捕捉する仕組みを紹介します。

## 主な機能

- **ナビゲーションブロック**:
  - `useNavigationBlock` フックを利用して、ページ遷移の試みをインターセプトします。
  - ユーザーが未保存の変更があるページを離れようとしたり、特定の条件下でページを移動しようとしたりする際に、確認ダイアログを表示します。
  - ユーザーにページ離脱の意思を確認することで、データの損失を防ぎます。
- **ルーティングイベント検知**:
  - ルーティングイベントを受信し処理するための Web API エンドポイントを提供します。
  - ナビゲーションの開始、完了、その他関連するルーティングのライフサイクルイベントの追跡を可能にします。
  - 特定のナビゲーションパターンやページ遷移に基づいて、カスタムロジックの実行を可能にします。

## ユースケース

- **フォームデータの保護**: ユーザーがページを離れる前に確認を促すことで、未保存のフォームデータが誤って失われるのを防ぎます。
- **分析とトラッキング**: ユーザーの行動分析やページの A/B テストのために、詳細なルーティング情報を収集します。
- **条件付きナビゲーション**: アプリケーションの状態やユーザーの権限に基づいて、ナビゲーションを許可またはブロックするカスタムロジックを実装します。
- **ユーザーエクスペリエンスの向上**: ナビゲーション中にスムーズな遷移を提供し、状況に応じたガイダンスを表示します。

## 動作の仕組み（概念）

### ナビゲーションブロック (`useNavigationBlock`)

`useNavigationBlock` フックは、一般的に以下の手順で動作します。

1.  Next.js のルーターイベント（例: `beforeunload` やルート変更開始イベント）に対するリスナーを登録します。
2.  ナビゲーションイベントが検知されると、ブロックが必要かどうか（例: フォームの `isDirty` 状態などに基づいて）を判断します。
3.  ブロックが必要な場合、デフォルトのナビゲーション処理を中断し、ユーザーに確認ダイアログを表示します。
4.  ユーザーの選択（遷移を続行するか、現在のページに留まるか）によって、その後の処理が決定されます。

### ルーティングイベント検知 (Web API)

ルーティングイベントの検知は、以下のように実装できます。

1.  API ルートを作成します（例: `/api/tracking/route-change-start`, `/api/tracking/route-change-complete`）。
2.  クライアントサイドのコードで Next.js のルーターイベントが発生した際に、関連するデータ（例: 現在のパス、遷移先のパス）を添えて、対応する API エンドポイントにリクエストを送信します。
3.  API ルート側では、受信した情報をログに記録したり、他のプロセスをトリガーしたり、データベースに保存したりすることができます。

## コードの探索

- ナビゲーションブロック機能のフックの実装については、`app/lib/hooks/useNavigationBlock.ts` (または類似のパス) を確認してください。
- `useNavigationBlock` フックがどのように各ページで使用されているかについては、`app/` ディレクトリ内の各ページを参照してください。
- ルーティングイベントの検知を処理する API ルートについては、`app/api/` ディレクトリ内を確認してください。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
