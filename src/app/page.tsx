import UsersList from "@/src/components/userslist/UsersList";

export default async function Home() {

  return (
    <section>
      <h1 className="text-xl">Benvenuto nella Home!</h1>
      <p className="text-base text-text-color-05">Questa è la pagina principale.</p>
      <div className="bg-[var(--primary)] text-base text-white rounded-[var(--border-radius)]">
        Cliccami
      </div>
      <div>
        <h1 className="text-3xl font-bold">Lista Utenti</h1>
        <UsersList></UsersList>
      </div>
    </section>
  );
}