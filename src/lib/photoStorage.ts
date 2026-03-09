import { supabase } from './supabase';

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const ext = file.type.includes('png') ? 'png' : 'jpg';
  const path = `${userId}/profile.${ext}`;

  const { error } = await supabase.storage
    .from('selfies')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from('selfies').getPublicUrl(path);
  return data.publicUrl;
}

export async function saveProfilePhotoUrl(userId: string, url: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ profile_photo_url: url })
    .eq('id', userId);

  if (error) throw error;
}

export async function getProfilePhotoUrl(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('profile_photo_url')
    .eq('id', userId)
    .single();

  return data?.profile_photo_url ?? null;
}
