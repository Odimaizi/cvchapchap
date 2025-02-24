import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// API Route to Fetch Resume Templates
app.get('/templates', async (req, res) => {
    try {
        const { data, error } = await supabase.storage.from('resume-templates').list();

        if (error) {
            console.error('Supabase Error:', error);
            return res.status(500).json({ message: 'Error fetching templates', error });
        }

        res.json({ templates: data });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
