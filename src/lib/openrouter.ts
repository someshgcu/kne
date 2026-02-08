// src/lib/openrouter.ts
// OpenRouter AI service using Llama 3 model

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OpenRouterResponse {
    id: string;
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface GenerateContentResult {
    success: boolean;
    content?: string;
    error?: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'qwen/qwen-2.5-72b-instruct:free';

/**
 * Generate content using OpenRouter AI (Qwen 2.5)
 * @param prompt - The prompt to send to the AI
 * @param systemPrompt - Optional system prompt for context
 * @returns Generated content result
 */
export async function generateContent(
    prompt: string,
    systemPrompt?: string
): Promise<GenerateContentResult> {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('[OpenRouter] API key not found. Set VITE_OPENROUTER_API_KEY in .env');
        return {
            success: false,
            error: 'OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.'
        };
    }

    try {
        const messages: Message[] = [];

        // Add system prompt if provided
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }

        // Add user prompt
        messages.push({
            role: 'user',
            content: prompt
        });

        console.log('[OpenRouter] Sending request to:', DEFAULT_MODEL);

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'INCPUC CMS'
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                messages: messages,
                max_tokens: 2048,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[OpenRouter] API error:', response.status, errorText);
            return {
                success: false,
                error: `API error (${response.status}): ${errorText}`
            };
        }

        const data: OpenRouterResponse = await response.json();

        if (!data.choices || data.choices.length === 0) {
            return {
                success: false,
                error: 'No response generated from AI'
            };
        }

        const generatedContent = data.choices[0].message.content;
        console.log('[OpenRouter] Generated content length:', generatedContent.length);

        return {
            success: true,
            content: generatedContent
        };

    } catch (error) {
        console.error('[OpenRouter] Request failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Generate a blog post from a topic
 */
export async function generateBlogPost(topic: string, keywords?: string[]): Promise<GenerateContentResult> {
    const keywordStr = keywords?.length ? `Include these keywords: ${keywords.join(', ')}.` : '';

    const systemPrompt = `You are a professional content writer for an educational institution (INCPUC - Pre-University College). 
Write engaging, informative content suitable for a college website. 
Use a professional yet approachable tone.
Format your response with a clear structure using headings and paragraphs.`;

    const prompt = `Write a blog post about: "${topic}"

${keywordStr}

Requirements:
- Write 300-500 words
- Include an engaging introduction
- Use clear headings for sections
- End with a strong conclusion
- Make it relevant to students, parents, and educators`;

    return generateContent(prompt, systemPrompt);
}

/**
 * Polish/improve existing content
 */
export async function polishContent(content: string): Promise<GenerateContentResult> {
    const systemPrompt = `You are an expert editor. Improve the given content to be more professional, clear, and engaging. 
Maintain the original meaning but enhance the writing quality.
Fix any grammar or spelling issues.
Keep the same approximate length.`;

    const prompt = `Please rewrite and polish the following content to be more professional and engaging:

---
${content}
---

Provide only the improved content, no explanations.`;

    return generateContent(prompt, systemPrompt);
}

/**
 * Generate a title for content
 */
export async function generateTitle(content: string): Promise<GenerateContentResult> {
    const prompt = `Generate a compelling, SEO-friendly title for this content. Return only the title, nothing else:

${content.substring(0, 500)}...`;

    return generateContent(prompt);
}
