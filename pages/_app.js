// pages/_app.js
import { SessionProvider } from "next-auth/react";
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';  // Adjust the import path if necessary

function MyApp({ Component, pageProps }) {
  // State for Supabase data
  const [data, setData] = useState([]);

  // Fetch data from Supabase when the app loads
  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase.from('your_table_name').select('*');
      if (error) console.error('Error fetching data:', error);
      else setData(data);
    };

    fetchData();
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      {/* Render Supabase Data (Optional) */}
      <div>
        <h1>Supabase Data</h1>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>

      {/* Render the main Component */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
