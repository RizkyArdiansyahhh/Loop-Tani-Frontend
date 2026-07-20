import React from "react";

interface ChatFormattedTextProps {
  text: string;
}

export const ChatFormattedText = ({ text }: ChatFormattedTextProps) => {
  const lines = text.split("\n");

  const renderedElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let inList = false;

  const parseInline = (inlineText: string) => {
    // Regex matches bold markers: **text**
    const parts = inlineText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-foreground dark:text-white">
            {part.slice(2, -2)}
          </strong>
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
