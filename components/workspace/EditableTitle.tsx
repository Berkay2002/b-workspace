"use client";

import { useState, useRef, useEffect } from "react";

interface EditableTitleProps {
  title: string;
  description?: string;
  onChange: (title: string, description: string) => void;
}

export function EditableTitle({
  title,
  description = "",
  onChange,
}: EditableTitleProps) {
  const [currentTitle, setCurrentTitle] = useState(title || "");
  const [currentDesc, setCurrentDesc] = useState(description || "");

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!currentTitle && titleRef.current) {
      titleRef.current.focus();
    }
  }, [currentTitle]);

  const handleTitleBlur = () => {
    const newTitle = titleRef.current?.innerText.trim() || "";
    if (newTitle !== currentTitle) {
      setCurrentTitle(newTitle);
      onChange(newTitle, currentDesc);
    }
  };

  const handleDescBlur = () => {
    const newDesc = descRef.current?.innerText.trim() || "";
    if (newDesc !== currentDesc) {
      setCurrentDesc(newDesc);
      onChange(currentTitle, newDesc);
    }
  };

  return (
    <div className="mb-6">
      <h1
        ref={titleRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTitleBlur}
        className="relative text-3xl font-bold text-foreground outline-none focus-visible:ring-0 focus:outline-none data-[placeholder]:empty:before:text-muted-foreground data-[placeholder]:empty:before:content-[attr(data-placeholder)] data-[placeholder]:empty:before:pointer-events-none data-[placeholder]:empty:before:absolute data-[placeholder]:empty:before:inset-0"
        data-placeholder="Untitled"
      >
        {currentTitle}
      </h1>

      <p
        ref={descRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleDescBlur}
        className="relative mt-1 text-sm text-muted-foreground outline-none focus-visible:ring-0 focus:outline-none data-[placeholder]:empty:before:text-muted-foreground data-[placeholder]:empty:before:content-[attr(data-placeholder)] data-[placeholder]:empty:before:pointer-events-none data-[placeholder]:empty:before:absolute data-[placeholder]:empty:before:inset-0"
        data-placeholder="Add a description..."
      >
        {currentDesc}
      </p>
    </div>
  );
}
