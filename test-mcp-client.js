#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { ChildProcessTransport } from '@modelcontextprotocol/sdk/client/child-process.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Create a client instance
  const client = new Client();
  
  // Connect to the server
  const serverPath = path.join(__dirname, 'chucknorris-mcp-server.js');
  const transport = new ChildProcessTransport(serverPath);
  await client.connect(transport);
  
  console.log('Connected to ChuckNorris MCP server');
  
  // List available tools
  const tools = await client.listTools();
  console.log('Available tools:', tools.map(tool => tool.name));
  
  // Test the optimizePrompt tool with different LLMs
  const llmNames = ['ChatGPT', 'Claude', 'Gemini', 'Unknown'];
  
  for (const llmName of llmNames) {
    console.log(`\nTesting optimizePrompt for ${llmName}:`);
    try {
      const result = await client.callTool('optimizePrompt', { llmName });
      console.log(result);
    } catch (error) {
      console.error(`Error optimizing prompt for ${llmName}:`, error);
    }
  }
  
  // Disconnect from the server
  await client.disconnect();
  console.log('\nDisconnected from ChuckNorris MCP server');
}

main().catch(console.error);
