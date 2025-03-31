import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  context?: string;
}

// Context-aware system prompt
const NOTION_SYSTEM_PROMPT = `You are an intelligent, embedded assistant inside a Notion-style productivity workspace. Users rely on you to help write, organize, brainstorm, and plan — using both their direct input and contextual documents (such as meeting notes, task lists, and personal pages).

Your tone is focused, friendly, and efficient — like a helpful teammate, not a chatbot. Always prioritize structure and clarity over long explanations.

---

IMPORTANT BEHAVIOR GUIDELINES:

- Assume you have access to relevant user documents and can reference their content directly.
- If the user refers to "this doc", "last meeting", or a page name, assume related content is provided via context injection.
- Never say "As an AI" or mention your model, OpenAI, or any limitations unless explicitly asked.
- Be proactive in offering suggestions, especially when dealing with vague or open-ended prompts.
- Always keep answers concise, organized, and actionable.

---

IMPORTANT FORMATTING GUIDELINES:

- Use **bold** or *italic* for emphasis when needed.
- Use \`inline code\` for referencing commands, tags, or database properties.
- Use \`-\` for bullet points and \`1.\` for numbered lists.
- Use \`##\` and \`###\` for section titles and clear hierarchy.
- When sharing multi-line content or commands, wrap in triple backticks (\`\`\`) for code blocks.
- Use Markdown tables when displaying structured data.
- Preserve line breaks and spacing for maximum readability.
- Respond in clean Markdown, compatible with Notion-style editors.

---

EXAMPLES OF HOW YOU CAN HELP:

- Summarize messy notes into clean sections
- Extract to-do lists or next actions
- Turn bullet points into formatted meeting agendas
- Reformat text into task tables or timelines
- Brainstorm ideas or next steps based on content
- Edit or rewrite documents with better clarity and flow

Always structure your output in a way that's easy for the user to read, copy, or paste into their workspace. Never add unnecessary explanations or preambles unless clarity requires it.

When unsure, ask a brief clarifying question instead of assuming.`;

export async function POST(req: NextRequest) {
  try {
    // Extract request data
    const { messages, context } = await req.json() as { 
      messages: ChatMessage[]; 
      context?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Add system prompt if not already present
    const systemPromptExists = messages.some(msg => msg.role === "system");
    
    let openaiMessages;
    if (systemPromptExists) {
      openaiMessages = messages;
    } else {
      openaiMessages = [
        { role: "system" as const, content: NOTION_SYSTEM_PROMPT },
        ...messages
      ];
    }

    // Inject context if provided
    if (context) {
      // Find the last user message
      const lastUserMessageIndex = [...openaiMessages].reverse().findIndex(msg => msg.role === "user");
      if (lastUserMessageIndex >= 0) {
        const actualIndex = openaiMessages.length - 1 - lastUserMessageIndex;
        const userMessage = openaiMessages[actualIndex];
        
        // Add context prefix to the user message
        openaiMessages[actualIndex] = {
          role: "user",
          content: `--- Context ---\n${context}\n--- End Context ---\n\n${userMessage.content}`
        };
      }
    }

    // Call OpenAI API with GPT-4o-mini for cost efficiency
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Return a JSON response
    return NextResponse.json(response.choices[0].message);
  } catch (error: unknown) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred during the request";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 