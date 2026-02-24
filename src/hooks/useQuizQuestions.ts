import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { QuizQuestion, quizQuestions } from "@/lib/quizData";

const QUIZ_ID = "main";

/** Admin hook — full CRUD */
export function useQuizQuestions(quizId = QUIZ_ID) {
  const queryClient = useQueryClient();
  const queryKey = ["quiz_questions", quizId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(rowToQuestion);
    },
  });

  const saveAll = useMutation({
    mutationFn: async (questions: QuizQuestion[]) => {
      // Delete existing
      const { error: delErr } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("quiz_id", quizId);
      if (delErr) throw delErr;

      if (questions.length === 0) return [];

      const rows = questions.map((q, i) => ({
        quiz_id: quizId,
        sort_order: i,
        question_data: questionToData(q) as any,
        styles: (q.styles ?? {}) as any,
        is_visible: true,
      }));

      const { data, error } = await supabase
        .from("quiz_questions")
        .insert(rows)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const resetToDefault = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("quiz_id", quizId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // If DB has questions, use them; otherwise fall back to hardcoded defaults
  const hasCustom = (query.data?.length ?? 0) > 0;
  const questions = hasCustom ? query.data! : quizQuestions;

  return {
    questions,
    hasCustom,
    isLoading: query.isLoading,
    error: query.error,
    saveAll,
    resetToDefault,
    refetch: query.refetch,
  };
}

/** Public hook — read-only, with long staleTime */
export function usePublicQuizQuestions(quizId = QUIZ_ID) {
  return useQuery({
    queryKey: ["quiz_questions_public", quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const questions = (data ?? []).map(rowToQuestion);
      // Fallback to hardcoded if DB is empty
      return questions.length > 0 ? questions : quizQuestions;
    },
    staleTime: 60_000,
  });
}

/* ── Helpers ── */

function rowToQuestion(row: any): QuizQuestion {
  const d = row.question_data ?? {};
  return {
    id: d.id ?? row.id,
    type: d.type ?? "cards-emoji",
    title: d.title ?? "",
    subtitle: d.subtitle,
    options: d.options,
    sliderMin: d.sliderMin,
    sliderMax: d.sliderMax,
    sliderUnit: d.sliderUnit,
    multiSelect: d.multiSelect,
    styles: row.styles && Object.keys(row.styles).length > 0 ? row.styles : d.styles,
  };
}

function questionToData(q: QuizQuestion): Record<string, any> {
  const { styles, ...rest } = q;
  return rest;
}
