// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://geyrtngyktvkeddunyqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleXJ0bmd5a3R2a2VkZHVueXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NDMzNjcsImV4cCI6MjA0ODMxOTM2N30.J8Sk33yo1qDWwwbMo988UPKtIUGkAi_PEpdgumiNTd8';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});

export default supabase;