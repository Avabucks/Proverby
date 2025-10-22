import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link> |{" "}
      <Link href="/about">Chi siamo</Link> |{" "}
      <Link href="/login">Login</Link> |{" "}
    </nav>
  );
}