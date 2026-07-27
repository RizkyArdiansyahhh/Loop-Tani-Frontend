import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Leaf } from "lucide-react";

interface ChatFormattedTextProps {
  text: string;
}

export const ChatFormattedText = ({ text }: ChatFormattedTextProps) => {
  const lines = text.split("\n");

  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let inList = false;

  const parseInline = (inlineText: string) => {
    // Regex matches bold **text** and markdown links [text](url)
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = inlineText.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-foreground dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const href = linkMatch[2];
        const isExternal = href.startsWith("http");

        if (isExternal) {
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              {linkText}
              <ArrowUpRight className="h-3 w-3 inline" />
            </a>
          );
        }

        // Check if it's a Feature Redirect Link
        const isFeatureLink =
          href.includes("/limbah-analyzer") ||
          href.includes("/fertilizer-calculator") ||
          href.includes("/panduan-tani") ||
          href.includes("/jejak-lestari");

        if (isFeatureLink) {
          return (
            <Link
              key={index}
              href={href}
              className="my-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary border border-primary/30 text-primary hover:text-primary-foreground font-bold text-xs transition-all duration-200 shadow-2xs group cursor-pointer"
            >
              <Leaf className="h-3.5 w-3.5" />
              <span>{linkText}</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          );
        }

        // Check if it's a Marketplace Product Link
        const isProductLink = href.includes("/marketplace/");

        if (isProductLink) {
          return (
            <Link
              key={index}
              href={href}
              className="my-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-bold text-xs transition-all duration-200 shadow-2xs group cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              <span className="group-hover:text-primary transition-colors">{linkText}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          );
        }

        return (
          <Link
            key={index}
            href={href}
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            {linkText}
          </Link>
        );
      }

      return part;
    });
  };

  const pushCurrentList = () => {
    if (currentListItems.length > 0) {
      const listKey = `list-${renderedElements.length}`;
      renderedElements.push(
        <ul
          key={listKey}
          className="list-disc pl-5 my-2 space-y-1 text-sm leading-relaxed text-foreground"
        >
          {currentListItems}
        </ul>
      );
      currentListItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === "---") {
      pushCurrentList();
      renderedElements.push(
        <hr key={index} className="my-3 border-t border-border" />
      );
      return;
    }

    // Headers
    if (trimmed.startsWith("#")) {
      pushCurrentList();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const headerText = match[2];
        
        let headingClass = "text-sm font-semibold mt-2.5 mb-1 text-foreground";
        if (level === 1) headingClass = "text-lg font-bold mt-4 mb-2 text-foreground";
        else if (level === 2) headingClass = "text-base font-bold mt-3.5 mb-1.5 text-foreground";
        else if (level === 3) headingClass = "text-sm font-semibold mt-3 mb-1 text-foreground";

        renderedElements.push(
          <div key={index} className={headingClass}>
            {parseInline(headerText)}
          </div>
        );
        return;
      }
    }

    // Bullet List Items
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      inList = true;
      const content = trimmed.replace(/^[*•-]\s+/, "");
      currentListItems.push(
        <li key={index} className="text-sm">
          {parseInline(content)}
        </li>
      );
      return;
    }

    // Numbered List Items
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      pushCurrentList();
      const num = numberedMatch[1];
      const content = numberedMatch[2];
      renderedElements.push(
        <div key={index} className="flex gap-2 text-sm leading-relaxed my-1.5 pl-1.5">
          <span className="font-semibold text-primary">{num}.</span>
          <span className="flex-1 text-foreground">{parseInline(content)}</span>
        </div>
      );
      return;
    }

    // Empty Lines
    if (trimmed === "") {
      pushCurrentList();
      renderedElements.push(<div key={index} className="h-2" />);
      return;
    }

    // Regular Paragraph
    pushCurrentList();
    renderedElements.push(
      <p key={index} className="text-sm leading-relaxed mb-1.5 last:mb-0 text-foreground">
        {parseInline(line)}
      </p>
    );
  });

  // Push remaining list items
  pushCurrentList();

  return <div className="space-y-0.5">{renderedElements}</div>;
};

export default ChatFormattedText;
