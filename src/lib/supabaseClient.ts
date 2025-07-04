import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdlztaqfoinofllipnhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbHp0YXFmb2lub2ZsbGlwbmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mjc4MTgsImV4cCI6MjA2NTQwMzgxOH0.gP8eaVsV5jIWHblIJM3uZFp4sGsQAhebPvAV5vXs9ek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 