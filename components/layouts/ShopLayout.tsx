import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import { SideMenu } from "../ui";
import { NavBar } from "../ui/NavBar";


interface props {
  title: string;
  pageDescrition: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<PropsWithChildren<props>> = ({
  children,
  title,
  pageDescrition,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescrition} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescrition} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <NavBar />
      </nav>
      <SideMenu />

      <main
        style={{ margin: "80px auto", maxWidth: "1440px", padding: "0px 30px" }}
      >
        {children}
      </main>
      {/* footer */}
      <footer>{/* custom footer */}</footer>
    </>
  );
};
