import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import "../styles/animations.css";
import "../styles/style.css";
import Navbar from "@/src/components/NavBar";
import localFont from "next/font/local";

const yourmate = localFont({
  src: "./fonts/Yourmate.otf",
  variable: "--font-yourmate",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://proverby.it'),
  title: "Proverby | Proverbi della community",
  description: "Proverby è una raccolta di proverbi condivisi dalla community. Aggiungi i tuoi e accumula punti saggezza!",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/assets/apple-touch-icon.png',
    apple: '/assets/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/assets/apple-touch-icon.png',
    },
  },
  openGraph: {
    title: "Proverby",
    description: "Proverby è una piattaforma che raccoglie proverbi condivisi dalla community: divertenti, saggi, originali o nati dall'esperienza quotidiana. Aggiungi i tuoi proverbi e guadagna punti saggezza!",
    images: ["/assets/social.png"],
  },
  appleWebApp: {
    title: 'Proverby',
    startupImage: [
      '/assets/apple-touch-icon.png',
      {
        url: '/assets/apple-touch-icon.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="it">
      <head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preload" href="https://cdn.boxicons.com/fonts/basic/boxicons.min.css" as="style" />
        <link rel="stylesheet" href="https://cdn.boxicons.com/fonts/basic/boxicons.min.css" />
        <link rel="preload" href="https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css" as="style" />
        <link rel="stylesheet" href="https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css" />
        <link rel="preload" href="https://cdn.boxicons.com/fonts/animations.min.css" as="style" />
        <link rel="stylesheet" href="https://cdn.boxicons.com/fonts/animations.min.css" />

      </head>
      <body
        className={`${poppins.variable} ${yourmate.variable} antialiased light`}
        data-scroll-behavior="smooth"
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}