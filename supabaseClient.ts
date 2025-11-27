import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xlkxaymfdwngulocehuq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa3hheW1mZHduZ3Vsb2NlaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDM0MzQsImV4cCI6MjA3NTU3OTQzNH0.xJAE644hF986qUFtBuafVeAA4QTlA65ZCg0K7ucZEXk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
