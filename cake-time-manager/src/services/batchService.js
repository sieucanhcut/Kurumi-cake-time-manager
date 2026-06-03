import { supabase } from "../lib/supabase";

export const batchService = {
  async getAll() {
    const { data, error } = await supabase
      .from("cake_batches")
      .select("*")
      .order("expire_datetime");

    if (error) throw error;

    return data;
  },

  async create(batch) {
    const { error } = await supabase
      .from("cake_batches")
      .insert(batch);

    if (error) throw error;
  },

  async update(id, batch) {
    const { error } = await supabase
      .from("cake_batches")
      .update(batch)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id) {
    const { error } = await supabase
      .from("cake_batches")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};