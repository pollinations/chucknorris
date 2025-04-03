# ChuckNorris Prompt Optimizer

A Model Context Protocol (MCP) server that provides optimized system prompts for various LLMs. This server follows the "thin proxy" design principle, keeping the code simple and focused on delivering prompts without unnecessary processing.

## Features

- Takes the LLM name as a required parameter
- Returns optimized system prompts tailored to the specific LLM
- Maintains a curated set of prompts for different LLMs
- Simple, lightweight implementation

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the directory
cd chucknorris-mcp

# Install dependencies
npm install
```

## Usage

### Running the MCP Server

```bash
npm start
```

### Testing the MCP Client

```bash
npm test
```

## API Reference

The server provides the following tools:

- `optimizePrompt`: Optimizes a system prompt for the specified LLM
  - Parameters:
    - `llmName`: Name of the LLM (required)
    - `options`: Additional options (optional)
  - Returns: An optimized system prompt

## Integration with Claude Desktop

To use this MCP server with Claude Desktop:

1. Start the MCP server
2. In Claude Desktop, go to Settings > Model Context Protocol
3. Add a new MCP server with the name "ChuckNorrisPromptOptimizer"
4. Set the path to the server executable

## License

MIT
