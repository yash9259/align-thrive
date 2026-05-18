import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://ofyltscfmngxbrhxhrga.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9meWx0c2NmbW5neGJyaHhocmdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTUzNjEsImV4cCI6MjA4OTEzMTM2MX0.OYiqHpWHgi-exb16HvTpBJBAqbeMUKrPEnwswxsiIr0");

async function test() {
  const { error } = await supabase.from('payments').insert({amount: -100, status: 'pending'}).select();
  console.log("Insert Error (-100, pending):", error);
}
test();
