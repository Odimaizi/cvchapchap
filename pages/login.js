import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Next.js Authentication</h1>
      {session ? (
        <>
          <p>Welcome, {session.user.email}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <p>You are not signed in.</p>
          <button onClick={() => signIn()}>Sign In</button>
        </>
      )}
    </div>
  );
}
