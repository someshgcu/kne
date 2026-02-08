// src/lib/openrouter.ts
// Fail-Safe AI Client using OpenRouter's Free Tier

interface Message {
    role: 'user' | 'assistant';
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

// API Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Use the OpenRouter auto-router for free models (automatically picks available free model)
// Fallback to specific models if needed
const MODELS = [
    'openrouter/auto',  // Auto-selects the best available free model
    'google/gemma-3-4b-it:free',  // Gemma 3 4B
    'meta-llama/llama-3.3-70b-instruct:free',  // Llama 3.3 70B
    'deepseek/deepseek-r1-0528:free',  // DeepSeek R1
];

/**
 * Try to generate content with a specific model
 */
async function tryGenerate(
    model: string,
    messages: Message[],
    apiKey: string
): Promise<{ success: boolean; content?: string; status?: number }> {
    try {
        console.log(`[OpenRouter] Trying model: ${model}`);

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'INCPUC Admin'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: 2048,
                temperature: 0.7
            })
        });

        // Return status for retry logic
        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`[OpenRouter] ${model} failed (${response.status}):`, errorText);
            return { success: false, status: response.status };
        }

        const data: OpenRouterResponse = await response.json();

        if (!data.choices || data.choices.length === 0) {
            console.warn(`[OpenRouter] ${model} returned no choices`);
            return { success: false, status: 200 };
        }

        const generatedContent = data.choices[0].message.content;
        console.log(`[OpenRouter] ✓ Success with ${model} (${generatedContent.length} chars)`);

        return { success: true, content: generatedContent };

    } catch (error) {
        console.error(`[OpenRouter] ${model} exception:`, error);
        return { success: false, status: 0 };
    }
}

/**
 * Generate content using OpenRouter AI with automatic fallback
 * @param prompt - The user's message/prompt
 * @param systemPrompt - Optional context/instructions (will be merged into user message)
 * @returns Generated content result
 */
export async function generateContent(
    prompt: string,
    systemPrompt?: string
): Promise<GenerateContentResult> {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('[OpenRouter] API key not found');
        return {
            success: false,
            error: 'OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.'
        };
    }

    // CRITICAL: Merge system prompt into user message
    // Many free models (Gemma, some Llamas) reject role: 'system'
    const finalContent = systemPrompt
        ? `System Instructions:\n${systemPrompt}\n\nUser Query:\n${prompt}`
        : prompt;

    // Only use 'user' role for maximum compatibility
    const messages: Message[] = [{ role: 'user', content: finalContent }];

    // Try each model in order
    for (const model of MODELS) {
        const result = await tryGenerate(model, messages, apiKey);

        if (result.success && result.content) {
            return {
                success: true,
                content: result.content
            };
        }

        // If rate limited (429), wait briefly before trying next
        if (result.status === 429) {
            console.log(`[OpenRouter] Rate limited, waiting 1s before next model...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // All models failed
    return {
        success: false,
        error: 'AI Service is currently busy. Please try again in a few seconds.'
    };
}

/**
 * Generate a blog post from a topic
 */
export async function generateBlogPost(
    topic: string,
    keywords?: string[]
): Promise<GenerateContentResult> {
    const keywordStr = keywords?.length ? `Include these keywords: ${keywords.join(', ')}.` : '';

    const systemPrompt = `You are a professional content writer for INCPUC (Pre-University College). 
Write engaging, informative content suitable for a college website. 
Use a professional yet approachable tone.
Format your response with clear structure using headings and paragraphs.`;

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
