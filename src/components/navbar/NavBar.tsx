import Link from "next/link";
import GoogleLogin from "@/src/components/googlelogin/GoogleLogin";

export default function Navbar() {
  return (
    <header>
      <Link href="/">Home</Link> |{" "}
      <Link href="/about">Chi siamo</Link> |{" "}
      <GoogleLogin></GoogleLogin>
    </header>
  );
}