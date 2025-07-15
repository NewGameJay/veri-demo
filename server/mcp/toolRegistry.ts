import { EventEmitter } from 'events';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
  permissions: string[];
  version: string;
  enabled: boolean;
}

export interface ToolCapability {
  name: string;
  description: string;
  category: string;
  requiredPermissions: string[];
}

class ToolRegistry extends EventEmitter {
  private tools: Map<string, MCPTool> = new Map();
  private capabilities: Map<string, ToolCapability> = new Map();
  private connectors: Map<string, any> = new Map();

  constructor() {
    super();
    this.initializeDefaultTools();
  }

  private initializeDefaultTools(): void {
    // Register default tools that are always available
    this.registerTool({
      name: 'system.health',
      description: 'Check system health and status',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: this.handleSystemHealth.bind(this),
      permissions: ['system.read'],
      version: '1.0.0',
      enabled: true
    });

    this.registerTool({
      name: 'system.capabilities',
      description: 'List available system capabilities',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: this.handleSystemCapabilities.bind(this),
      permissions: ['system.read'],
      version: '1.0.0',
      enabled: true
    });

    // Register placeholder tools for future connectors
    this.registerPlaceholderTools();
  }

  private registerPlaceholderTools(): void {
    // Google Drive tools
    this.registerTool({
      name: 'google_drive.list_files',
      description: 'List files from Google Drive',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results', default: 10 }
        }
      },
      handler: this.handleGoogleDriveList.bind(this),
      permissions: ['drive.read'],
      version: '1.0.0',
      enabled: false // Disabled until connector is configured
    });

    this.registerTool({
      name: 'google_drive.read_file',
      description: 'Read content from a Google Drive file',
      inputSchema: {
        type: 'object',
        properties: {
          fileId: { type: 'string', description: 'File ID' }
        },
        required: ['fileId']
      },
      handler: this.handleGoogleDriveRead.bind(this),
      permissions: ['drive.read'],
      version: '1.0.0',
      enabled: false
    });

    // Slack tools
    this.registerTool({
      name: 'slack.get_channels',
      description: 'Get list of Slack channels',
      inputSchema: {
        type: 'object',
        properties: {
          types: { type: 'string', description: 'Channel types (public,private,mpim,im)' }
        }
      },
      handler: this.handleSlackChannels.bind(this),
      permissions: ['slack.read'],
      version: '1.0.0',
      enabled: false
    });

    this.registerTool({
      name: 'slack.get_messages',
      description: 'Get messages from a Slack channel',
      inputSchema: {
        type: 'object',
        properties: {
          channel: { type: 'string', description: 'Channel ID' },
          limit: { type: 'number', description: 'Max messages', default: 50 }
        },
        required: ['channel']
      },
      handler: this.handleSlackMessages.bind(this),
      permissions: ['slack.read'],
      version: '1.0.0',
      enabled: false
    });

    // Notion tools
    this.registerTool({
      name: 'notion.search',
      description: 'Search Notion pages and databases',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          filter: { type: 'object', description: 'Search filters' }
        }
      },
      handler: this.handleNotionSearch.bind(this),
      permissions: ['notion.read'],
      version: '1.0.0',
      enabled: false
    });

    this.registerTool({
      name: 'notion.get_page',
      description: 'Get content from a Notion page',
      inputSchema: {
        type: 'object',
        properties: {
          pageId: { type: 'string', description: 'Page ID' }
        },
        required: ['pageId']
      },
      handler: this.handleNotionPage.bind(this),
      permissions: ['notion.read'],
      version: '1.0.0',
      enabled: false
    });

    // Custom API tool
    this.registerTool({
      name: 'custom.api_call',
      description: 'Make custom API calls',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'API endpoint URL' },
          method: { type: 'string', description: 'HTTP method', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
          headers: { type: 'object', description: 'HTTP headers' },
          data: { type: 'object', description: 'Request body' }
        },
        required: ['url', 'method']
      },
      handler: this.handleCustomAPI.bind(this),
      permissions: ['api.call'],
      version: '1.0.0',
      enabled: false
    });
  }

  registerTool(tool: MCPTool): void {
    this.tools.set(tool.name, tool);
    this.emit('tool_registered', tool);
  }

  unregisterTool(name: string): void {
    if (this.tools.delete(name)) {
      this.emit('tool_unregistered', name);
    }
  }

  async getAvailableTools(): Promise<MCPTool[]> {
    return Array.from(this.tools.values()).filter(tool => tool.enabled);
  }

  async callTool(name: string, args: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    if (!tool.enabled) {
      throw new Error(`Tool disabled: ${name}`);
    }

    try {
      return await tool.handler(args);
    } catch (error) {
      console.error(`Error calling tool ${name}:`, error);
      throw error;
    }
  }

  enableTool(name: string): void {
    const tool = this.tools.get(name);
    if (tool) {
      tool.enabled = true;
      this.emit('tool_enabled', name);
    }
  }

  disableTool(name: string): void {
    const tool = this.tools.get(name);
    if (tool) {
      tool.enabled = false;
      this.emit('tool_disabled', name);
    }
  }

  // Tool handlers - these return mock data when connectors are not configured
  private async handleSystemHealth(args: any): Promise<any> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      tools: {
        total: this.tools.size,
        enabled: Array.from(this.tools.values()).filter(t => t.enabled).length
      }
    };
  }

  private async handleSystemCapabilities(args: any): Promise<any> {
    return {
      capabilities: Array.from(this.capabilities.values()),
      tools: Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        enabled: tool.enabled,
        version: tool.version
      }))
    };
  }

  private async handleGoogleDriveList(args: any): Promise<any> {
    // Mock response - replace with actual Google Drive API call
    return {
      files: [
        {
          id: 'mock_file_1',
          name: 'Example Document.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          modifiedTime: '2025-01-15T10:30:00Z',
          size: 1024000
        },
        {
          id: 'mock_file_2',
          name: 'Project Presentation.pptx',
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          modifiedTime: '2025-01-14T15:45:00Z',
          size: 2048000
        }
      ],
      nextPageToken: null
    };
  }

  private async handleGoogleDriveRead(args: any): Promise<any> {
    // Mock response - replace with actual Google Drive API call
    return {
      content: `This is mock content for file ${args.fileId}. In a real implementation, this would contain the actual file content from Google Drive.`,
      metadata: {
        name: 'Example Document.docx',
        size: 1024000,
        lastModified: '2025-01-15T10:30:00Z'
      }
    };
  }

  private async handleSlackChannels(args: any): Promise<any> {
    // Mock response - replace with actual Slack API call
    return {
      channels: [
        {
          id: 'C1234567890',
          name: 'general',
          is_private: false,
          num_members: 25
        },
        {
          id: 'C0987654321',
          name: 'random',
          is_private: false,
          num_members: 18
        }
      ]
    };
  }

  private async handleSlackMessages(args: any): Promise<any> {
    // Mock response - replace with actual Slack API call
    return {
      messages: [
        {
          type: 'message',
          user: 'U1234567890',
          text: 'Hello team! This is a mock message.',
          ts: '1642521600.000100'
        },
        {
          type: 'message',
          user: 'U0987654321',
          text: 'Another mock message for testing.',
          ts: '1642521500.000100'
        }
      ]
    };
  }

  private async handleNotionSearch(args: any): Promise<any> {
    // Mock response - replace with actual Notion API call
    return {
      results: [
        {
          id: 'page_1',
          object: 'page',
          title: 'Project Documentation',
          url: 'https://notion.so/mock-page-1',
          last_edited_time: '2025-01-15T10:30:00Z'
        },
        {
          id: 'page_2',
          object: 'page',
          title: 'Meeting Notes',
          url: 'https://notion.so/mock-page-2',
          last_edited_time: '2025-01-14T15:45:00Z'
        }
      ]
    };
  }

  private async handleNotionPage(args: any): Promise<any> {
    // Mock response - replace with actual Notion API call
    return {
      id: args.pageId,
      title: 'Mock Page Title',
      content: `This is mock content for Notion page ${args.pageId}. In a real implementation, this would contain the actual page content from Notion.`,
      last_edited_time: '2025-01-15T10:30:00Z'
    };
  }

  private async handleCustomAPI(args: any): Promise<any> {
    // Mock response - replace with actual HTTP request
    return {
      url: args.url,
      method: args.method,
      status: 200,
      data: {
        message: 'This is a mock response from custom API call.',
        timestamp: new Date().toISOString()
      }
    };
  }
}

export const toolRegistry = new ToolRegistry();