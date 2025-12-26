import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Prevent flash of wrong theme */}
      <Script id="theme-script" strategy="beforeInteractive">
        {`
          (function() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') document.documentElement.classList.add('dark');
          })();
        `}
      </Script>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
