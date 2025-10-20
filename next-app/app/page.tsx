export default function Home() {
  return (
    <section className="bg-primary text-text-color p-4">
      <h1 className="text-primary">Benvenuto nella Home!</h1>
      <p className="text-text-color-05">Questa è la pagina principale.</p>
      <button className="bg-[var(--primary-color)] text-white rounded-[var(--radius)]">
        Cliccami
      </button>
    </section>
  );
}