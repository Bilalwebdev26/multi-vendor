//import Providers from '../providers';
import Providers from "../providers";
import Header from "../shared/widgets/header";
import "./global.css";
import { Poppins, Roboto,Oregano } from "next/font/google";

export const metadata = {
  title: "MULTI-VENDOR",
  description: "Get everything in just 1 click.",
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
const oregano = Oregano({
  subsets: ["latin"],
  weight: ["400"], // jo weights chahiye wo add karo
  variable: "--font-oregano",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} ${oregano.variable}`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
