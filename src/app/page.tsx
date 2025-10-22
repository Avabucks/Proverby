
import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export default async function Home() {

  const [users] = await pool.query<User[]>("SELECT * FROM user");

  return (
    <section className="bg-primary text-text-color p-4">
      <h1 className="text-primary">Benvenuto nella Home!</h1>
      <p className="text-text-color-05">Questa è la pagina principale.</p>
      <button className="bg-[var(--primary)] text-white rounded-[var(--border-radius)]">
        Cliccami
      </button>
      <div>
        <h1>Lista Utenti</h1>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email} - {u.isActive}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}