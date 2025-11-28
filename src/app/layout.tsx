import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";
import "../styles/animations.css";
import "../styles/style.css";
import Navbar from "@/src/components/navigation/NavBar";
import localFont from "next/font/local";
import { UserProvider } from "@/src/context/UserContext";
import { cookies } from "next/headers";
import { getUser } from "@/src/actions/users_actions";

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
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    title: "Proverby | Proverbi della community",
    description: "Proverby è una piattaforma che raccoglie proverbi condivisi dalla community: divertenti, saggi, originali o nati dall'esperienza quotidiana. Aggiungi i tuoi proverbi e guadagna punti saggezza!",
    images: ["/assets/social.png"],
  },
  twitter: {
    card: 'summary',
    title: "Proverby | Proverbi della community",
    description: "Proverby è una raccolta di proverbi condivisi dalla community. Aggiungi i tuoi e accumula punti saggezza!",
  },
  appleWebApp: {
    title: 'Proverby',
    startupImage: [
      '/apple-touch-icon.png',
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const token = cookieStore.get("user")?.value;
  const user = token ? await getUser(JSON.parse(token).username, JSON.parse(token).uid) : null;

  return (
    <html lang="it">
      <head>

      </head>
      <body
        className={`${poppins.variable} ${yourmate.variable} antialiased light`}
        data-scroll-behavior="smooth"
      >
        <UserProvider initialUser={user}>
          <Navbar />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}