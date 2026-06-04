import { supabase } from "../lib/supabase";

export const scheduleService = {
  async getLatest() {
    const { data, error } = await supabase
      .from("schedule_images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116")
      throw error;

    return data;
  },

  async upload(file) {
    const fileName =
      Date.now() + "-" + file.name;

    const { error: uploadError } =
      await supabase.storage
        .from("schedule-images")
        .upload(fileName, file);

    if (uploadError)
      throw uploadError;

    const { data } = supabase.storage
      .from("schedule-images")
      .getPublicUrl(fileName);

    const imageUrl =
      data.publicUrl;

    const { error } = await supabase
      .from("schedule_images")
      .insert({
        image_url: imageUrl,
      });

    if (error) throw error;

    return imageUrl;
  },
};