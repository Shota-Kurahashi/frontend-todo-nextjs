import React, { FC, ReactNode } from "react";
import Head from "next/head";

type Props = {
  children: ReactNode;
  title: string;
};
export const Layout: FC<Props> = ({ children, title = "Next.js" }) => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <Head>
      <title>{title}</title>
    </Head>
    <main className="flex w-screen flex-1 flex-col items-center justify-center">
      {children}
    </main>
  </div>
);
