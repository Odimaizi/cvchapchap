import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Router changed:", router.asPath);
  }, [router.asPath]); // ✅ Use router.asPath instead of router

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
};

export default Dashboard;
