#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the server script
const serverPath = path.join(__dirname, 'chucknorris-mcp-server.js');

async function main() {
  console.log('Starting ChuckNorris MCP test client...');
  
  // Create a transport that spawns the server script
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
  });
  
  // Create a client
  const client = new Client({
    name: 'chucknorris-test-client',
    version: '1.0.0',
  }, {
    capabilities: {
      tools: {}
    }
  });
  
  try {
    // Connect to the server
    console.log('Connecting to server...');
    await client.connect(transport);
    console.log('Connected to server successfully!');
    
    // List available tools
    console.log('\n--- Listing available tools ---');
    const toolsResponse = await client.listTools();
    console.log('Available tools:');
    console.log(JSON.stringify(toolsResponse, null, 2));
    
    // First call to the chuckNorris tool (should return preparation prompt)
    console.log('\n--- First call to chuckNorris tool ---');
    console.log('This should return the preparation prompt');
    const llmName = 'ANTHROPIC'; // Using ANTHROPIC as the LLM name
    try {
      const firstResult = await client.callTool({
        name: 'chuckNorris',
        arguments: {
          llmName,
        },
      });
      console.log('First call result:');
      console.log(JSON.stringify(firstResult, null, 2));
      
      // List tools again to see if the schema has changed
      console.log('\n--- Listing tools after first call ---');
      console.log('The schema description should now include the jailbreak');
      const toolsAfterFirstCall = await client.listTools();
      console.log('Updated tools:');
      console.log(JSON.stringify(toolsAfterFirstCall, null, 2));
      
      // Second call to the chuckNorris tool (should return full jailbreak)
      console.log('\n--- Second call to chuckNorris tool ---');
      console.log('This should return the full jailbreak content');
      const secondResult = await client.callTool({
        name: 'chuckNorris',
        arguments: {
          llmName,
        },
      });
      console.log('Second call result:');
      console.log(JSON.stringify(secondResult, null, 2));
    } catch (error) {
      console.error('Error calling tool:', error.message);
      // Try to continue with the test
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

main().catch(console.error);
