/**
 * Schema definitions for the prompt optimization service
 */

export const optimizePromptSchema = {
  name: 'optimizePrompt',
  description: 'Optimizes a system prompt for the specified LLM',
  parameters: {
    type: 'object',
    properties: {
      llmName: {
        type: 'string',
        description: 'Name of the LLM (e.g., "ChatGPT", "Claude", "Gemini")'
      },
      options: {
        type: 'object',
        description: 'Additional options for prompt optimization',
        properties: {
          category: {
            type: 'string',
            description: 'Category of optimization (e.g., "creative", "technical", "general")'
          },
          strength: {
            type: 'string',
            enum: ['mild', 'moderate', 'strong'],
            description: 'Strength of the optimization'
          }
        }
      }
    },
    required: ['llmName']
  }
};
