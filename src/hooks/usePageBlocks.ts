import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PageBlock {
  id: string;
  page_id: string;
  block_type: string;
  sort_order: number;
  content: Record<string, any>;
  styles: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type NewBlock = Omit<PageBlock, "id" | "created_at" | "updated_at">;

const PAGE_ID = "quiz_result";

export function usePageBlocks(pageId = PAGE_ID) {
  const queryClient = useQueryClient();
  const queryKey = ["page_blocks", pageId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_id", pageId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PageBlock[];
    },
  });

  const saveAll = useMutation({
    mutationFn: async (blocks: PageBlock[]) => {
      // Delete all existing blocks for this page, then upsert
      const { error: delErr } = await supabase
        .from("page_blocks")
        .delete()
        .eq("page_id", pageId);
      if (delErr) throw delErr;

      if (blocks.length === 0) return [];

      const rows = blocks.map((b, i) => ({
        id: b.id,
        page_id: pageId,
        block_type: b.block_type,
        sort_order: i,
        content: b.content,
        styles: b.styles,
        is_visible: b.is_visible,
      }));

      const { data, error } = await supabase
        .from("page_blocks")
        .insert(rows)
        .select();
      if (error) throw error;
      return data as PageBlock[];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const resetToDefault = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_blocks")
        .delete()
        .eq("page_id", pageId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { blocks: query.data ?? [], isLoading: query.isLoading, error: query.error, saveAll, resetToDefault, refetch: query.refetch };
}

export function usePublicPageBlocks(pageId = PAGE_ID) {
  return useQuery({
    queryKey: ["page_blocks_public", pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_id", pageId)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PageBlock[];
    },
    staleTime: 60_000,
  });
}

export async function uploadPageAsset(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("page-assets").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("page-assets").getPublicUrl(path);
  return data.publicUrl;
}
