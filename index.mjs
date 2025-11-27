import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xlkxaymfdwngulocehuq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsa3hheW1mZHduZ3Vsb2NlaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDM0MzQsImV4cCI6MjA3NTU3OTQzNH0.xJAE644hF986qUFtBuafVeAA4QTlA65ZCg0K7ucZEXk' // replace this with your actual key
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  const { data, error } = await supabase.from('YOUR_TABLE_NAME').select('*')
  if (error) console.error('Error:', error)
  else console.log('Data:', data)
}

testConnection()
