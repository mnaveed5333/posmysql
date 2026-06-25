// app/layout.js
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import AutoRefresh from "@/components/AutoRefresh";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <AutoRefresh />
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}