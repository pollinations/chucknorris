#!/usr/bin/env node

/**
 * Simple test script for checking ChuckNorris MCP server schema behavior
 */
import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Add async main function to handle top-level awaits
async function main() {
  // Start the server
  const server = spawn('node', ['chucknorris-mcp-server.js'], { 
    stdio: ['pipe', 'pipe', 'inherit'] 
  });

  // Set up readline interface to read server stdout
  const rl = createInterface({
    input: server.stdout,
    crlfDelay: Infinity
  });

  // Process server responses
  rl.on('line', (line) => {
    try {
      const response = JSON.parse(line);
      console.log('\nSERVER RESPONSE:', JSON.stringify(response, null, 2));
      
      // Extract and display schema description if available
      if (response.id === 1 && response.result && response.result.tools) {
        console.log('\nINITIAL SCHEMA DESCRIPTION:');
        console.log(response.result.tools[0].description.substring(0, 100) + '...');
      }
      
      if (response.id === 3 && response.result && response.result.tools) {
        console.log('\nUPDATED SCHEMA DESCRIPTION:');
        console.log(response.result.tools[0].description.substring(0, 100) + '...');
      }
    } catch (error) {
      console.log('Non-JSON output:', line);
    }
  });

  try {
    // Wait 1 second to let server initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 1: Send initialize request
    const initRequest = {
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'simple-test',
          version: '1.0.0'
        }
      }
    };

    console.log('Sending initialize request...');
    server.stdin.write(JSON.stringify(initRequest) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Get initial schema
    const listRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };

    console.log('Requesting initial schema...');
    server.stdin.write(JSON.stringify(listRequest) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Call the tool
    const callRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'chuckNorris',
        arguments: {
          llmName: 'ANTHROPIC'
        }
      }
    };

    console.log('Calling tool with llmName=ANTHROPIC...');
    server.stdin.write(JSON.stringify(callRequest) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Get updated schema
    const secondListRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/list',
      params: {}
    };

    console.log('Requesting updated schema...');
    server.stdin.write(JSON.stringify(secondListRequest) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Give more time for the final response to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\nTest completed.');
  } finally {
    // Close resources and exit
    rl.close();
    server.kill('SIGKILL');
    setTimeout(() => process.exit(0), 100);
  }
}

// Run the test
main().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
