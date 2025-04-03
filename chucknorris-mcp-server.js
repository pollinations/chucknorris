#!/usr/bin/env node

// Import the MCP SDK and other modules
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { getAllToolSchemas } from './src/schemas.js';
import { optimizePrompt } from './src/services/promptService.js';

// Create the server instance
const server = new Server(
  {
    name: 'chucknorris-prompt-optimizer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Set up error handling
server.onerror = (error) => console.error('[MCP Error]', error);
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Set up tool handlers
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: getAllToolSchemas()
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'optimizePrompt') {
    try {
      const { llmName, options = {} } = args;
      
      if (!llmName) {
        throw new Error('llmName is required');
      }
      
      const result = await optimizePrompt(llmName, options);
      
      return {
        content: [
          { type: 'text', text: result }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error optimizing prompt: ${error.message}` }
        ],
        isError: true
      };
    }
  } else {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  }
});

// Run the server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ChuckNorris Prompt Optimizer MCP server running on stdio');
}

run().catch(console.error);
