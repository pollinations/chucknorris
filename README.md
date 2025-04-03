# ChuckNorris Prompt Optimizer

A Model Context Protocol (MCP) server that provides optimized system prompts for various LLMs. This server follows the "thin proxy" design principle, keeping the code simple and focused on delivering prompts without unnecessary processing.

## Features

- Takes the LLM name as a required parameter
- Retrieves jailbreak prompts from the [L1B3RT4S repository](https://github.com/elder-plinius/L1B3RT4S)
- Falls back to built-in prompts if the repository is not accessible
- Supports a wide range of LLMs including ChatGPT, Claude, Gemini, Mistral, and Llama
- Simple, lightweight implementation with minimal dependencies

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

The server provides the following tool:

- `chuckNorris`: Provides an optimized system prompt for the specified LLM
  - Parameters:
    - `llmName`: Name of the LLM (required)
  - Returns: An optimized system prompt tailored to the specified LLM

## Integration with Claude Desktop

To use this MCP server with Claude Desktop:

1. Start the MCP server
2. In Claude Desktop, go to Settings > Model Context Protocol
3. Add a new MCP server with the name "ChuckNorrisPromptOptimizer"
4. Set the path to the server executable

## How It Works

The server works by:

1. Receiving a request with an LLM name (e.g., "ChatGPT", "Claude", "Gemini")
2. Mapping the LLM name to a corresponding file in the L1B3RT4S repository
3. Fetching the jailbreak prompt from the repository
4. If the repository is not accessible, using a built-in fallback prompt
5. Returning the prompt with a custom prefix

## License

MIT
