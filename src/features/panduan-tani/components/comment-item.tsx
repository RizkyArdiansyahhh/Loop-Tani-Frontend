"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { MessageSquare, Edit2, Trash2, AlertTriangle, CornerDownRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent as AlertContent,
} from "@/components/ui/alert-dialog";
import type { Comment } from "@/types/api";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReportCommentMutation,
  useModerateCommentMutation,
} from "../hooks/use-comment-mutations";

interface CommentItemProps {
  comment: Comment;
  contentId: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

const formSchema = z.object({
  content: z.string().min(1, "Komentar tidak boleh kosong").max(500, "Komentar maksimal 500 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

export function CommentItem({ comment, contentId, currentUserId, isAdmin = false }: CommentItemProps) {
  const t = useTranslations("panduan.comments");

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  
  // Alert dialog control states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Mutations
  const createMutation = useCreateCommentMutation(contentId);
  const updateMutation = useUpdateCommentMutation(contentId);
  const deleteMutation = useDeleteCommentMutation(contentId);
  const reportMutation = useReportCommentMutation(contentId);
  const moderateMutation = useModerateCommentMutation(contentId);

  // Form for editing
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  // Form for replying
  const replyForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleEditSubmit = (values: FormValues) => {
    updateMutation.mutate(
      { commentId: comment.id, payload: { content: values.content } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleReplySubmit = (values: FormValues) => {
    createMutation.mutate(
      { content: values.content, parentId: comment.id },
      {
        onSuccess: () => {
          setIsReplying(false);
          replyForm.reset();
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(comment.id);
  };

  const handleReportConfirm = () => {
    reportMutation.mutate({ commentId: comment.id });
  };

  const handleModerateStatus = (status: "ACTIVE" | "HIDDEN" | "DELETED") => {
    moderateMutation.mutate({ commentId: comment.id, payload: { status } });
  };

  const isOwner = currentUserId === comment.userId;
  const isDeleted = comment.status === "DELETED";
  const isHidden = comment.status === "HIDDEN";

  // Hide completely for normal users/guests if hidden (only visible if admin is true)
  if (isHidden && !isAdmin) {
    return null;
  }

  const formattedDate = new Date(comment.createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="relative group/item">
      {/* Soft Delete / Placeholder Check */}
      <div className={`flex gap-3 rounded-2xl p-4 transition-all duration-300 ${
        isDeleted
          ? "bg-gray-50/50 border border-dashed border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
          : isHidden
          ? "bg-amber-50/40 border border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30"
          : "bg-white border border-gray-100 hover:shadow-xs dark:bg-gray-900 dark:border-gray-800/60"
      }`}>
        {/* User Avatar */}
        <div className="shrink-0">
          <Avatar size="default" className="border border-gray-100 dark:border-gray-800">
            <AvatarImage src={isDeleted ? "" : comment.user.image || ""} alt={comment.user.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {isDeleted ? "DE" : comment.user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Comment Content Area */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* User Info / Timestamp */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {isDeleted ? "Sistem" : comment.user.name}
            </span>
            <span className="text-gray-400 font-normal">
              {formattedDate}
            </span>
            {comment.updatedAt !== comment.createdAt && !isDeleted && (
              <span className="text-gray-400 text-3xs font-medium italic">
                {t("edited")}
              </span>
            )}
            {isHidden && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-55/10 px-2 py-0.5 text-3xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/30">
                <ShieldAlert className="h-3 w-3" />
                HIDDEN (MODERATION)
              </span>
            )}
          </div>

          {/* Comment Body */}
          {isEditing ? (
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="mt-3 space-y-3">
              <Textarea
                {...editForm.register("content")}
                className="w-full rounded-xl resize-none min-h-[80px]"
                maxLength={500}
              />
              {editForm.formState.errors.content && (
                <p className="text-xs text-red-500 font-medium">
                  {editForm.formState.errors.content.message}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-lg text-xs"
                  disabled={updateMutation.isPending}
                >
                  {t("save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => setIsEditing(false)}
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          ) : (
            <p className={`text-sm leading-relaxed mt-1 whitespace-pre-wrap ${
              isDeleted ? "text-gray-400 italic font-normal" : "text-gray-655 dark:text-gray-300 font-medium"
            }`}>
              {isDeleted ? t("deleteConfirmDesc").replace(/.*(Hapus|Delete).*/gi, "Komentar ini telah dihapus oleh penulis.") : comment.content}
            </p>
          )}

          {/* Comment Actions (Visible only when not deleted & user has permission) */}
          {!isDeleted && !isEditing && (
            <div className="flex items-center gap-4 pt-1.5 text-xs text-muted-foreground">
              {/* Reply Button (Only allowed for top-level comments) */}
              {comment.parentId === null && currentUserId && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1.5 font-semibold text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{t("replySubmit")}</span>
                </button>
              )}

              {/* Owner actions: Edit & Delete */}
              {isOwner && currentUserId && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 font-semibold text-gray-400 hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>{t("edit")}</span>
                  </button>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center gap-1.5 font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t("delete")}</span>
                  </button>
                </>
              )}

              {/* Report Button (For non-owners) */}
              {!isOwner && currentUserId && (
                <button
                  onClick={() => setReportOpen(true)}
                  className="flex items-center gap-1.5 font-semibold text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{t("report")}</span>
                </button>
              )}

              {/* Admin Moderation Controls */}
              {isAdmin && (
                <div className="ml-auto flex items-center gap-2 border-l border-gray-150 pl-3 dark:border-gray-800">
                  {isHidden ? (
                    <button
                      onClick={() => handleModerateStatus("ACTIVE")}
                      disabled={moderateMutation.isPending}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors dark:bg-emerald-950/20 dark:text-emerald-400 cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{t("show")}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerateStatus("HIDDEN")}
                      disabled={moderateMutation.isPending}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors dark:bg-amber-950/20 dark:text-amber-400 cursor-pointer"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>{t("hide")}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleModerateStatus("DELETED")}
                    disabled={moderateMutation.isPending}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors dark:bg-red-950/20 dark:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t("delete")}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reply input box inline */}
      {isReplying && (
        <div className="mt-3 flex gap-3 pl-8">
          <div className="text-gray-300 mt-1">
            <CornerDownRight className="h-4 w-4" />
          </div>
          <form onSubmit={replyForm.handleSubmit(handleReplySubmit)} className="flex-1 space-y-2.5">
            <Textarea
              {...replyForm.register("content")}
              placeholder={t("replyPlaceholder")}
              className="w-full rounded-xl resize-none min-h-[70px] text-xs p-3"
              maxLength={500}
            />
            {replyForm.formState.errors.content && (
              <p className="text-xs text-red-500 font-medium">
                {replyForm.formState.errors.content.message}
              </p>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                className="rounded-lg text-xs"
                disabled={createMutation.isPending}
              >
                {t("replySubmit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
                onClick={() => setIsReplying(false)}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Render Direct Structured Replies (Only if parent comment) */}
      {comment.parentId === null && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-8 space-y-3 border-l border-gray-100 dark:border-gray-800/80">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="relative flex gap-2">
              <div className="absolute left-[-22px] top-4 text-gray-200 dark:text-gray-850">
                <CornerDownRight className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <CommentItem
                  comment={reply}
                  contentId={contentId}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={() => {
                handleDeleteConfirm();
                setDeleteOpen(false);
              }}
            >
              {t("deleteConfirmAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Confirmation Modal */}
      <AlertDialog open={reportOpen} onOpenChange={setReportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("reportConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("reportConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportOpen(false)}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              onClick={() => {
                handleReportConfirm();
                setReportOpen(false);
              }}
            >
              {t("reportConfirmAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
