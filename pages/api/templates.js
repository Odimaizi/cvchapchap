import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch the list of files from the 'resume-templates' bucket
    const { data, error } = await supabase.storage.from('templates').list();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ message: 'Error fetching templates', error });
    }

    // Generate public URLs for each template
    const templates = data.map((file) => ({
      name: file.name,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume-templates/${file.name}`
    }));

    return res.status(200).json({ templates });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const fetchTemplatesFromBackend = async () => {
  try {
    const response = await fetch("https://your-vercel-app.vercel.app/api/templates");
    if (!response.ok) throw new Error("Failed to fetch templates");

    const { templates } = await response.json();
    console.log("Fetched Templates:", templates);

    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

// Call this function inside your backend logic
const generateResume = async (userData) => {
  const templates = await fetchTemplatesFromBackend();
  console.log("Using templates in resume generation:", templates);
  
  // Now use `templates` in your backend logic
};
