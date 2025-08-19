import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

const getUsers = async () => {
  try {
    const res = await fetch("/api/register", {
      cache: "no-store", 
    });

    if (!res.ok) {
      console.log("Failed to fetch users");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default async function Home() {
  const users = await getUsers();

  if (!users || users.length === 0) {
    return (
      <div className={styles.page}>
        <h2>No users found</h2>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Users</h1>
      <div className={styles.userList}>
        {users.map((user) => (
          <Link href={`/chat/${user._id}`} key={user._id} className={styles.userCard}>
            <div>
             
              {user.image && (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile`}
                  width={60}
                  height={60}
                  className={styles.profileImg}
                />
              )}
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
