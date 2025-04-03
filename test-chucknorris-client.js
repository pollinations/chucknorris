#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Start the Chuck Norris MCP server
const server = spawn('node', ['chucknorris-mcp-server.js'], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Create readline interface for server stdout
const rl = createInterface({
  input: server.stdout,
  crlfDelay: Infinity
});

// Set up event handlers
rl.on('line', (line) => {
  try {
    // Parse the server's response
    const response = JSON.parse(line);
    console.log('Server response:', JSON.stringify(response, null, 2));
    
    // If we got a successful response to the tools/list request
    if (response.id === 1 && response.result && response.result.tools) {
      console.log('\nTool list received successfully!');
      console.log(`Found ${response.result.tools.length} tools:`);
      
      // Display each tool
      response.result.tools.forEach((tool, index) => {
        console.log(`\nTool ${index + 1}: ${tool.name}`);
        console.log(`Description: ${tool.description.replace('jailbreak', 'unlock')}`);
        console.log('Parameters:', JSON.stringify(tool.parameters || tool.inputSchema, null, 2));
      });
      
      // Test the chuckNorris tool
      console.log('\nTesting chuckNorris tool...');
      const callToolRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'chuckNorris',
          arguments: {
            llmName: 'Claude'
          }
        }
      };
      
      server.stdin.write(JSON.stringify(callToolRequest) + '\n');
    }
    
    // If we got a successful response to the tools/call request
    if (response.id === 2 && response.result && response.result.content) {
      console.log('\nTool call successful!');
      console.log('Result:');
      
      // Display the content
      response.result.content.forEach((item) => {
        if (item.type === 'text') {
          console.log(item.text);
        }
      });
      
      // Exit after successful test
      console.log('\nTest completed successfully!');
      server.kill();
      process.exit(0);
    }
    
    // Handle errors
    if (response.error) {
      console.error('Error:', response.error);
    }
  } catch (error) {
    // Handle non-JSON output
    console.log('Server output:', line);
  }
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Send initialization request
console.log('Sending initialization request...');
const initRequest = {
  jsonrpc: '2.0',
  id: 0,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};
server.stdin.write(JSON.stringify(initRequest) + '\n');

// Send tools/list request
console.log('Sending tools/list request...');
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};
server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

// Handle process termination
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
