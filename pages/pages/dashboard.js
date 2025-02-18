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
// pages/api/auth/signup.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ user });
}
