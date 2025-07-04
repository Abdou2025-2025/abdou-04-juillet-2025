import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mkshiegcwicehlnmtuiv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc2hpZWdjd2ljZWhsbm10dWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjEyMTAsImV4cCI6MjA2NzIzNzIxMH0.3lOqVLB0A0zImIzgLU0dRvDofJjjGLoHnf9o88DkKq4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);