/**
 * Calculates the position of the cursor in a textarea relative to the viewport
 * @param textarea The textarea element
 * @param cursorPos The current cursor position in the text
 * @returns Object containing top and left coordinates
 */
export function calculateCursorPosition(textarea: HTMLTextAreaElement, cursorPos: number) {
  // Create a temporary clone of the textarea to measure text dimensions
  const mirror = document.createElement('div');
  mirror.style.width = `${textarea.clientWidth}px`;
  mirror.style.fontSize = getComputedStyle(textarea).fontSize;
  mirror.style.fontFamily = getComputedStyle(textarea).fontFamily;
  mirror.style.lineHeight = getComputedStyle(textarea).lineHeight;
  mirror.style.padding = getComputedStyle(textarea).padding;
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  document.body.appendChild(mirror);

  // Get text before cursor
  const text = textarea.value.substring(0, cursorPos);
  
  // Create a span for the text before cursor
  const textBeforeCursor = document.createElement('span');
  textBeforeCursor.textContent = text;
  mirror.appendChild(textBeforeCursor);
  
  // Create a marker element at cursor position
  const marker = document.createElement('span');
  marker.textContent = '|';
  mirror.appendChild(marker);
  
  // Get coordinates
  const textareaRect = textarea.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  
  // Clean up
  document.body.removeChild(mirror);
  
  // Return position relative to textarea
  return {
    left: Math.min(markerRect.left - textareaRect.left, textarea.clientWidth - 20),
    top: markerRect.top - textareaRect.top + textareaRect.top
  };
}

/**
 * Ensures a dropdown remains within viewport boundaries
 * @param position Current position {top, left}
 * @param dropdownWidth Width of the dropdown in pixels
 * @param dropdownHeight Height of the dropdown in pixels
 * @returns Adjusted position {top, left}
 */
export function adjustPositionToViewport(
  position: { top: number; left: number },
  dropdownWidth: number = 280,
  dropdownHeight: number = 250
) {
  const { top, left } = position;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  let adjustedTop = top;
  let adjustedLeft = left;
  
  // Check if dropdown would go off-screen at the bottom
  if (top + dropdownHeight > viewportHeight) {
    // Position above cursor instead
    adjustedTop = top - dropdownHeight - 10;
  }
  
  // Make sure dropdown is not positioned off-screen on the left
  if (left < 0) adjustedLeft = 0;
  
  // Don't let dropdown go off right edge
  const maxRight = viewportWidth - dropdownWidth;
  if (left > maxRight) adjustedLeft = maxRight;
  
  return { top: adjustedTop, left: adjustedLeft };
} 

export function getCaretCoordinates(textarea: HTMLTextAreaElement, position: number) {
    const div = document.createElement("div");
    const style = window.getComputedStyle(textarea);
  
    (Object.keys(style) as Array<keyof CSSStyleDeclaration>).forEach((key) => {
      const value = style.getPropertyValue(key as string);
      if (value) {
        div.style.setProperty(key as string, value);
      }
    });
  
    div.style.position = "absolute";
    div.style.whiteSpace = "pre-wrap";
    div.style.visibility = "hidden";
    div.style.height = "auto";
    div.style.width = `${textarea.offsetWidth}px`;
  
    const text = textarea.value.slice(0, position);
    div.textContent = text;
  
    const span = document.createElement("span");
    span.textContent = "\u200b"; // zero-width space
    div.appendChild(span);
    document.body.appendChild(div);
  
    const { offsetTop: top, offsetLeft: left } = span;
    document.body.removeChild(div);
  
    return { top, left };
  }
  