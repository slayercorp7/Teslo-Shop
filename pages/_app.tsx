import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { lightTheme } from "../themes";
import { ThemeProvider } from "@mui/material/styles";
import { SWRConfig } from "swr";
import { AuthProvider, CartProvider, UiProvider } from "../context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) {
    return <></>;
  }
  return (
    <PayPalScriptProvider options={{'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
      <SessionProvider>
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </SessionProvider>
    </PayPalScriptProvider>
  );
}

export default MyApp;
