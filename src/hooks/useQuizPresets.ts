import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface QuizPreset {
  id: string;
  preset_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const QUERY_KEY = ["quiz_presets"];

export function useQuizPresets() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_presets")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as QuizPreset[];
    },
  });

  const activePreset = query.data?.find((p) => p.is_active) ?? null;

  const createPreset = useMutation({
    mutationFn: async ({ name, copyFromId }: { name: string; copyFromId?: string }) => {
      const presetId = `quiz_${Date.now()}`;

      // Create the preset record
      const { error } = await supabase
        .from("quiz_presets")
        .insert({ preset_id: presetId, name, is_active: false });
      if (error) throw error;

      // If copying from another preset, duplicate its questions
      if (copyFromId) {
        const { data: sourceQuestions, error: fetchErr } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_id", copyFromId)
          .order("sort_order", { ascending: true });
        if (fetchErr) throw fetchErr;

        if (sourceQuestions && sourceQuestions.length > 0) {
          const rows = sourceQuestions.map((q: any) => ({
            quiz_id: presetId,
            sort_order: q.sort_order,
            question_data: q.question_data,
            styles: q.styles,
            is_visible: q.is_visible,
          }));
          const { error: insertErr } = await supabase
            .from("quiz_questions")
            .insert(rows);
          if (insertErr) throw insertErr;
        }
      }

      return presetId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const renamePreset = useMutation({
    mutationFn: async ({ presetId, name }: { presetId: string; name: string }) => {
      const { error } = await supabase
        .from("quiz_presets")
        .update({ name })
        .eq("preset_id", presetId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const activatePreset = useMutation({
    mutationFn: async (presetId: string) => {
      // Deactivate all
      const { error: deactErr } = await supabase
        .from("quiz_presets")
        .update({ is_active: false })
        .neq("preset_id", "__none__");
      if (deactErr) throw deactErr;

      // Activate the chosen one
      const { error } = await supabase
        .from("quiz_presets")
        .update({ is_active: true })
        .eq("preset_id", presetId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["quiz_questions"] });
      queryClient.invalidateQueries({ queryKey: ["quiz_questions_public"] });
    },
  });

  const deletePreset = useMutation({
    mutationFn: async (presetId: string) => {
      // Delete questions first
      const { error: qErr } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("quiz_id", presetId);
      if (qErr) throw qErr;

      // Delete preset
      const { error } = await supabase
        .from("quiz_presets")
        .delete()
        .eq("preset_id", presetId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    presets: query.data ?? [],
    activePreset,
    isLoading: query.isLoading,
    createPreset,
    renamePreset,
    activatePreset,
    deletePreset,
  };
}

/** Public: get the active preset_id */
export function useActivePresetId() {
  return useQuery({
    queryKey: ["active_preset_id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_presets")
        .select("preset_id")
        .eq("is_active", true)
        .limit(1)
        .single();
      if (error) return "main";
      return data?.preset_id ?? "main";
    },
    staleTime: 60_000,
  });
}
