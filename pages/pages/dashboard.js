// pages/dashboard.js
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Log router changes
  useEffect(() => {
    console.log("Router changed:", router.asPath);
  }, [router.asPath]);

  // Loading state
  if (status === "loading") return <p>Loading...</p>;

  // If no session, deny access
  if (!session) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
};

export default Dashboard;
