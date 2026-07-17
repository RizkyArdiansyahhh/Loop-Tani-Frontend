"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Send, LogIn, MessageSquare } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useComments } from "../hooks/use-comments";
import { useCreateCommentMutation } from "../hooks/use-comment-mutations";
import { CommentItem } from "./comment-item";

interface CommentsSectionProps {
  contentId: string;
}

const formSchema = z.object({
  content: z.string().min(1, "Komentar tidak boleh kosong").max(500, "Komentar maksimal 500 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

export function CommentsSection({ contentId }: CommentsSectionProps) {
  const t = useTranslations("panduan");
  const [page, setPage] = useState(1);

  // Auth session
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const currentUserId = session?.user?.id;
  
  const userRole = (session?.user as any)?.role;
  const isAdmin =
    userRole === "ADMIN" ||
    (Array.isArray(userRole) && userRole.includes("ADMIN"));

  // Fetch comments
  const { data: commentsData, isLoading: isCommentsLoading } = useComments(contentId, {
    page,
    limit: 10,
  });

  // Post comment mutation
  const createMutation = useCreateCommentMutation(contentId);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(
      { content: values.content },
      {
        onSuccess: () => {
          form.reset();
          setPage(1); // reset to page 1 to see the new comment
        },
      }
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to comments section header
    const element = document.getElementById("comments-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isSessionLoading) {
    return (
      <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-gray-800/80 mt-10">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  const comments = commentsData?.data || [];
  const meta = commentsData?.meta;

  return (
    <div id="comments-section" className="space-y-8 pt-10 border-t border-gray-100 dark:border-gray-800/80 mt-10">
      {/* Title */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white">
          {t("comments.title")} ({meta?.total || 0})
        </h3>
      </div>

      {/* Composition Area */}
      {session ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800/60 shadow-2xs">
          <Textarea
            {...form.register("content")}
            placeholder={t("comments.placeholder")}
            className="w-full rounded-xl resize-none min-h-[90px] border-gray-150 focus:border-primary/50 text-sm"
            maxLength={500}
          />
          {form.formState.errors.content && (
            <p className="text-xs text-red-500 font-medium">
              {form.formState.errors.content.message}
            </p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-xl px-5 font-semibold text-xs flex items-center gap-2 py-4"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t("comments.submit")}</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-250 bg-gray-50/50 p-6 text-center dark:border-gray-800 dark:bg-gray-950/20">
          <p className="text-sm font-medium text-gray-655 dark:text-gray-400 mb-4">
            {t("comments.guestPrompt")}
          </p>
          <Link href="/login">
            <Button className="rounded-xl font-bold text-xs px-5 py-4 inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
              <LogIn className="h-4 w-4" />
              <span>{t("comments.loginButton")}</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {isCommentsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400 font-medium bg-gray-50/30 rounded-2xl border border-gray-100/50 dark:bg-gray-950/10 dark:border-gray-900/40">
          {t("comments.empty")}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              contentId={contentId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-xs text-muted-foreground font-semibold px-2">
            Halaman {page} dari {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs"
            disabled={page === meta.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
}
