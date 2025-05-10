# Next.js ナビゲーションブロックとルーティングイベント検知デモ

このプロジェクトは、Next.js の App Router 環境において、ナビゲーションブロック（ページ離脱防止）を実装し、ルーティングイベントを検知する方法を示すデモンストレーションです。

カスタムフック `useNavigationBlock` を用いたページ離脱防止機能の実現例と、クライアントサイドで各種ルーティングイベントを捕捉する仕組みを紹介します。

## 主な機能

- **ナビゲーションブロック**:
  - `useNavigationBlock` フックを利用して、ページ遷移の試みをインターセプトします。
  - ユーザーが未保存の変更があるページを離れようとしたり、特定の条件下でページを移動しようとしたりする際に、確認ダイアログを表示します。
  - ユーザーにページ離脱の意思を確認することで、データの損失を防ぎます。
- **ルーティングイベント検知 (クライアントサイド)**:
  - Next.js のルーターイベントを活用し、クライアントサイドでナビゲーションイベントを検知します。
  - ナビゲーションの開始、完了など、関連するルーティングのライフサイクルイベントの追跡を可能にします。
  - 特定のナビゲーションパターンやページ遷移に基づいて、クライアントサイドでカスタムロジックの実行を可能にします。

## ユースケース

- **フォームデータの保護**: ユーザーがページを離れる前に確認を促すことで、未保存のフォームデータが誤って失われるのを防ぎます。
- **条件付きナビゲーション**: アプリケーションの状態やユーザーの権限に基づいて、ナビゲーションを許可またはブロックするカスタムロジックを実装します。

## 動作の仕組み（概念）

### ナビゲーションブロック (`useNavigationBlock`)

`useNavigationBlock` フックは、一般的に以下の手順で動作します。

1.  Next.js のルーターイベント（例: `beforeunload` やルート変更開始イベント）に対するリスナーを登録します。
2.  ナビゲーションイベントが検知されると、ブロックが必要かどうか（例: フォームの `isDirty` 状態などに基づいて）を判断します。
3.  ブロックが必要な場合、デフォルトのナビゲーション処理を中断し、ユーザーに確認ダイアログを表示します。
4.  ユーザーの選択（遷移を続行するか、現在のページに留まるか）によって、その後の処理が決定されます。

### コード例

#### 1. `useBlockNavigation` フックの使用例

このフックは、フォームを持つページなどで、ユーザーが入力内容を保存せずに離脱しようとした場合に警告を出すのに役立ちます。

```tsx
// app/some-form-page/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useBlockNavigation } from "@/hooks/use-block-navigation"; 

export default function SomeFormPage() {
  const [text, setText] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // フォームの内容が変更されたら isDirty を true にする
  useEffect(() => {
    if (text !== "") {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [text]);


  useBlockNavigation({
    shouldBlock: isDirty,
    message: "変更が保存されていません。本当にこのページを離れますか？",
  });

  return (
    <div>
      <h1>フォームページ</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="何か入力してください..."
        rows={5}
        style={{ width: "100%", border: "1px solid black" }}
      />
      <p>{isDirty ? "編集中です" : "変更はありません"}</p>
      <button onClick={() => setIsDirty(false)}>変更を破棄（デモ用）</button>
    </div>
  );
}
```

#### 2. `useEffect` と `window.addEventListener` を使用した基本的な例

Next.js の App Router 環境では、クライアントサイドのナビゲーションイベントを直接 `window.addEventListener` で詳細に（例: `beforeRouterPush` のように）捕捉する標準的な方法は提供されていません。しかし、ページのアンロード (`beforeunload`) やブラウザの履歴変更 (`popstate`) はリッスンできます。

以下は、`beforeunload` イベントを使用してページ離脱を防ぐ基本的な例です。

```tsx
// app/another-page/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function AnotherPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        // 標準のブラウザ確認ダイアログが表示される
        // メッセージのカスタマイズはブラウザによって制限される場合がある
        event.returnValue = "変更が保存されていません。本当に離れますか？";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <div>
      <h1>別のページ</h1>
      <p>このページには、基本的な離脱防止機能があります。</p>
      <button onClick={() => setHasUnsavedChanges(true)}>変更ありにする</button>
      <button onClick={() => setHasUnsavedChanges(false)}>
        変更なしにする
      </button>
      {hasUnsavedChanges && (
        <p style={{ color: "red" }}>未保存の変更があります！</p>
      )}
    </div>
  );
}
```

`beforeunload` イベントはブラウザ標準の機能であり、ユーザーがページから離れようとする際に警告を表示する基本的な手段として利用できます。
より複雑なクライアントサイドルーティングの制御や、特定の条件下でのみブロックを有効にしたい場合は、`useBlockNavigation` のようなカスタムフックの利用が推奨されます。

## コードの探索

- ナビゲーションブロック機能のフックの実装については、`app/lib/hooks/useNavigationBlock.ts` (または類似のパス) を確認してください。
- `useNavigationBlock` フックがどのように各ページで使用されているかについては、`app/` ディレクトリ内の各ページを参照してください。

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
