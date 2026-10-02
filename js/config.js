const SUPABASE_URL = "https://kaxzrnoxmmyqclhdmeht.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_M9PYRhlWs4DxeoYyoqvA0Q_YsxaQusy";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);