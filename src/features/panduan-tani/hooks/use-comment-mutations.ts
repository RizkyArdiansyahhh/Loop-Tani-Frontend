import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createComment,
  updateComment,
  deleteComment,
  reportComment,
  moderateComment,
  CreateCommentPayload,
  UpdateCommentPayload,
  ReportCommentPayload,
  ModerateCommentPayload,
} from "../api/comments";
import { panduanKeys } from "../api/query-keys";

export function useCreateCommentMutation(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(contentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: panduanKeys.comments(contentId),
      });
      toast.success("Komentar berhasil dipublikasikan");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal mengirimkan komentar";
      toast.error(message);
    },
  });
}

export function useUpdateCommentMutation(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: UpdateCommentPayload;
    }) => updateComment(commentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: panduanKeys.comments(contentId),
      });
      toast.success("Komentar berhasil diperbarui");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal memperbarui komentar";
      toast.error(message);
    },
  });
}

export function useDeleteCommentMutation(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: panduanKeys.comments(contentId),
      });
      toast.success("Komentar berhasil dihapus");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal menghapus komentar";
      toast.error(message);
    },
  });
}

export function useReportCommentMutation(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload?: ReportCommentPayload;
    }) => reportComment(commentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: panduanKeys.comments(contentId),
      });
      toast.success("Komentar berhasil dilaporkan");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal melaporkan komentar";
      toast.error(message);
    },
  });
}

export function useModerateCommentMutation(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: ModerateCommentPayload;
    }) => moderateComment(commentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: panduanKeys.comments(contentId),
      });
      toast.success("Status komentar berhasil dimoderasi");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal memoderasi komentar";
      toast.error(message);
    },
  });
}
