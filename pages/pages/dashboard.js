import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page if not logged in
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null; // Prevent rendering if not authenticated

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
