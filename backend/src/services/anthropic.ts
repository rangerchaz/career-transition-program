import Anthropic from '@anthropic-ai/sdk';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

// Model to use for all requests
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

/**
 * Send a message to Claude and get a response
 */
export async function sendMessage(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number = 4096
): Promise<string> {
  try {
    logger.debug('Sending message to Claude', {
      messageCount: messages.length,
      systemPromptLength: systemPrompt.length,
    });

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    });

    // Extract text from the first content block
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    logger.debug('Received response from Claude', {
      responseLength: textContent.text.length,
    });

    return textContent.text;
  } catch (error) {
    logger.error('Error calling Claude API', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Stream a message from Claude (for future use if needed)
 */
export async function* streamMessage(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens: number = 4096
): AsyncGenerator<string, void, unknown> {
  try {
    const stream = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text;
      }
    }
  } catch (error) {
    logger.error('Error streaming from Claude API', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
