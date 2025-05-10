import Image from "next/image";
import styles from "./page.module.css";
import { NextLink } from "@/lib/next";

export default function Home() {
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
        <h1>About</h1>
        <div>
          <ul>
            <li>
              <NextLink href="/">Home</NextLink>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
