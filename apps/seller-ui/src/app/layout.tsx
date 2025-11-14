//import Providers from '../providers';

import Providers from "../providers";
import "./global.css";
import { Poppins, Roboto } from "next/font/google";

export const metadata = {
  title: "MULTI-VENDOR Seller Account",
  description: "Sell everything in Multi-Mart.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // jo weights chahiye wo add karo
  variable: "--font-roboto",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // jo weights chahiye wo add karo
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
