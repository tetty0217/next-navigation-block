'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { NextLink } from "@/lib/next";
import { useState } from "react";
import { useBlockNavigation } from "@/hooks/use-block-navigation";

export default function Home() {
  const [blockNavigation, setBlockNavigation] = useState(false)

  useBlockNavigation({
    shouldBlock: blockNavigation,
    message: 'このページから離れますか？',
  })

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1>Home</h1>
        <div>
          <label>
            ナビゲーションをブロック：
            <input
              type="checkbox"
              checked={blockNavigation}
              onChange={(e) => setBlockNavigation(e.target.checked)}
            />
          </label>
          <ul>
            <li>
              <NextLink href="/about">About</NextLink>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
