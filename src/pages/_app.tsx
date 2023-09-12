import { AppProps } from "next/app";
import "../styles/global.scss";
import { Header } from "../components/Header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { SessionProvider } from "next-auth/react";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID_PAYPAL_BUSINESS,
  currency: "BRL",
  intent: "capture",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Component {...pageProps} />;
        </PayPalScriptProvider>
      </SessionProvider>
    </>
  );
}
