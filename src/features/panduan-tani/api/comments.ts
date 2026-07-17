import { axiosInstance } from "@/lib/axios";
import type { CommentsResponse, Comment } from "@/types/api";

export interface GetCommentsParams {
  page?: number;
  limit?: number;
}

export async function getComments(
  contentId: string,
  params?: GetCommentsParams
): Promise<CommentsResponse> {
  const { data } = await axiosInstance.get<CommentsResponse>(
    `/knowledge/${contentId}/comments`,
    { params }
  );
  return data;
}

export interface CreateCommentPayload {
  content: string;
  parentId?: string;
}

export async function createComment(
  contentId: string,
  payload: CreateCommentPayload
): Promise<Comment> {
  const { data } = await axiosInstance.post<Comment>(
    `/knowledge/${contentId}/comments`,
    payload
  );
  return data;
}

export interface UpdateCommentPayload {
  content: string;
}

export async function updateComment(
  commentId: string,
  payload: UpdateCommentPayload
): Promise<Comment> {
  const { data } = await axiosInstance.patch<Comment>(
    `/comments/${commentId}`,
    payload
  );
  return data;
}

export async function deleteComment(commentId: string): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete<{ success: boolean }>(
    `/comments/${commentId}`
  );
  return data;
}

export interface ReportCommentPayload {
  reason?: string;
}

export async function reportComment(
  commentId: string,
  payload?: ReportCommentPayload
): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.post<{ success: boolean }>(
    `/comments/${commentId}/report`,
    payload
  );
  return data;
}

export interface ModerateCommentPayload {
  status: 'ACTIVE' | 'HIDDEN' | 'DELETED';
}

export async function moderateComment(
  commentId: string,
  payload: ModerateCommentPayload
): Promise<Comment> {
  const { data } = await axiosInstance.patch<Comment>(
    `/comments/${commentId}/status`,
    payload
  );
  return data;
}
