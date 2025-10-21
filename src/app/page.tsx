"use client";
import { useEffect } from 'react';

export default function Home() {

  // console.log(`${process.env.NEXT_PUBLIC_PHP_API}/test_api.php`); TEST API

  return (
    <section className="bg-primary text-text-color p-4">
      <h1 className="text-primary">Benvenuto nella Home!</h1>
      <p className="text-text-color-05">Questa è la pagina principale.</p>
      <button className="bg-[var(--primary)] text-white rounded-[var(--border-radius)]">
        Cliccami
      </button>
    </section>
  );
}