
import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  uid: string;
}

export default async function Home() {

  const [users] = await pool.query<User[]>("SELECT * FROM users");

  return (
    <section>
      <h1 className="text-xl">Benvenuto nella Home!</h1>
      <p className="text-base text-text-color-05">Questa è la pagina principale.</p>
      <div className="bg-[var(--primary)] text-base text-white rounded-[var(--border-radius)]">
        Cliccami
      </div>
      <div>
        <h1 className="text-3xl font-bold">Lista Utenti</h1>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.id} - {u.username} - {u.email} - {u.uid}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}