# Next.js ナビゲーションブロックとルーティングイベント検知デモ

このプロジェクトは、Next.js の App Router 環境において、ナビゲーションブロック（ページ離脱防止）を実装し、ルーティングイベントを検知する方法を示すデモンストレーションです。

カスタムフック `useNavigationBlock` を用いたページ離脱防止機能の実現例と、ソフトナビゲーション（クライアントサイドルーティング）およびハードナビゲーション（ブラウザ操作によるページ遷移）におけるイベントを捕捉する仕組みを紹介します。

## 主な機能

- **ナビゲーションブロック**:
  - `useNavigationBlock` フックを利用して、ページ遷移の試みをインターセプトします。
  - ユーザーが未保存の変更があるページを離れようとしたり、特定の条件下でページを移動しようとしたりする際に、確認ダイアログを表示します。
  - ユーザーにページ離脱の意思を確認することで、データの損失を防ぎます。
- **ルーティングイベント検知 (クライアントサイド)**:
  - Next.js のルーターイベントを活用し、クライアントサイドでナビゲーションイベントを検知します。
  - ソフトナビゲーションの開始、完了など、関連するルーティングのライフサイクルイベントの追跡を可能にします。
  - 特定のナビゲーションパターンやページ遷移に基づいて、クライアントサイドでカスタムロジックの実行を可能にします。

## ユースケース

- **フォームデータの保護**: ユーザーがページを離れる前に確認を促すことで、未保存のフォームデータが誤って失われるのを防ぎます。
- **条件付きナビゲーション**: アプリケーションの状態やユーザーの権限に基づいて、ナビゲーションを許可またはブロックするカスタムロジックを実装します。

## 動作の仕組み（概念）

### ナビゲーションブロック (`useNavigationBlock`)

`useNavigationBlock` フックは、一般的に以下の手順で動作します。

1.  Next.js のルーターイベント（ソフトナビゲーションイベント）やブラウザ標準のイベント（ハードナビゲーションイベント、例: `beforeunload`, `popstate`）に対するリスナーを登録します。
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

Next.js の App Router 環境で、`window.addEventListener` を使ってソフトナビゲーションイベント（例: ルート変更直前）を直接リッスンする標準的な方法は提供されていません。しかし、もしアプリケーション内で独自のカスタムイベントを発行する仕組みがあれば、以下のように対応できます。

以下は、仮に `AppRouterEvent.BeforePush` というカスタムイベント（ソフトナビゲーションに関連するイベントを想定）がディスパッチされる場合に、ページ遷移を防ぐ概念的な例です。

```tsx
// app/another-page/page.tsx
"use client";

import { useState, useEffect } from "react";
import { NextLink, useAppRouter } from "@/lib/next";

export default function AnotherPage() {
  const router = useAppRouter();

  useEffect(() => {
    window.addEventListener(AppRouterEvent.BeforeRouterPush, (e) => {
      const confirm = window.confirm(
        `変更が保存されていません。\\n「/another」へ移動しますか？`
      );
      if (!confirm) {
        e.preventDefault();
      }
    });
  }, []);

  const handleProgrammaticNavigation = () => {
    router.push("/another");
  };

  return (
    <div>
      <h1>別のページ</h1>
      <p>
        このページは、NextLink と useAppRouter
        を使用したナビゲーションの例です。
      </p>
      {/* NextLink を使用した宣言的ナビゲーション */}
      <div>
        <NextLink href="/some-other-page">他のページへ (NextLink)</NextLink>
      </div>

      {/* useAppRouter を使用した命令的ナビゲーション */}
      <div>
        <button onClick={handleProgrammaticNavigation}>
          別のページへ (useAppRouter)
        </button>
      </div>
    </div>
  );
}
```

