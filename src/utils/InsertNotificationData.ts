import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./constants";

const supabase = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
export const InsertNotificationInfo = async ({ user_id, push_id, type, data })=>{
  if(push_id && !(type== "user chat" || type== "personal_chat" || type == "message" || type == "user channel")){
    console.log("push_id",push_id);
  const { data: existingRecord, error } = await supabase
  .from("tracking_notifications")
  .select("id")
  .eq("push_id", push_id)
  .maybeSingle(); // Fetch only one record if it exists

if (error) {
  console.log("Error checking push_id:", error, push_id);
  return;
}

if (existingRecord) {
  console.log("Push ID already exists, skipping insertion.");
  return; // Handle as needed (update or ignore)
}

// Insert the new notification record if push_id doesn't exist
const { error: insertError } = await supabase.from("tracking_notifications").insert([
    {
      user_id,
      push_id,
      type,
      created_at: new Date().toISOString(),
      data,
    },
  ]);

  if (insertError) {
    console.error("Error inserting notification:", insertError);
  } else {
    console.log("Notification inserted successfully.");
  }
}
}