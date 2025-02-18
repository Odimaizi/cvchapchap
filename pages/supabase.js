import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eoxbsjfswcaartyisccm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGJzamZzd2NhYXJ0eWlzY2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMzk4MTAsImV4cCI6MjA1NDkxNTgxMH0.YiWVHabGmI6n4jr4mLGJAshkNXuOPjRu-MGfC71Yy_w';

export const supabase = createClient(supabaseUrl, supabaseKey);
 