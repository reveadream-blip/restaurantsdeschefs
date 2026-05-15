import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function PartenairesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`partenaires-theme ${playfair.variable}`}>{children}</div>
  );
}
