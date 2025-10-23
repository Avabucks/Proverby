import { pool } from "@/src/lib/db";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  uid: string;
}

export default async function UsersList() {
  const conn = await pool.getConnection();

  try {
    const [users] = await conn.query<User[]>("SELECT * FROM users");

    return (
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.id} - {u.username} - {u.email} - {u.uid}
          </li>
        ))}
      </ul>
    );
  } finally {
    conn.release();
  }
}