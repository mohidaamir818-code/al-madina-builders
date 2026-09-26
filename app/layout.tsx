import type { Metadata } from "next";
import { Caveat, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Al Madina Builders & Property Advisor | Multan",
  description:
    "Al Madina Builders & Property Advisor — construction, professional house maps and property dealing in Multan, Pakistan. Authorized partners in DHA Multan, Royal Orchard, Buch Villas and New Metro City.",
  keywords: [
    "Al Madina Builders",
    "property advisor Multan",
    "house maps Multan",
    "construction Multan",
    "DHA Multan",
    "Royal Orchard",
    "Buch Villas",
    "New Metro City",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${caveat.variable} h-full`}>
      <body className="min-h-full bg-white font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
