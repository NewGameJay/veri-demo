import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { EventEmitter } from 'events';
import { toolRegistry } from './toolRegistry';

interface MCPMessage {
  id: string;
  type: 'request' | 'response' | 'notification';
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

interface MCPConnection {
  id: string;
  userId?: string;
  capabilities: string[];
  authenticated: boolean;
  lastActivity: Date;
}

export class MCPServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private httpServer: any = null;
  private connections: Map<string, MCPConnection> = new Map();
  private isEnabled: boolean = false;
  private rateLimiter: Map<string, number[]> = new Map();

  constructor() {
    super();
    this.isEnabled = process.env.USE_MCP === 'true';
  }

  async initialize(port: number = 8080): Promise<void> {
    if (!this.isEnabled) {
      console.log('MCP Server disabled - set USE_MCP=true to enable');
      return;
    }

    this.httpServer = createServer();
    this.wss = new WebSocketServer({ 
      server: this.httpServer,
      path: '/mcp'
    });

    this.setupWebSocketHandlers();
    
    return new Promise((resolve, reject) => {
      this.httpServer.listen(port, (err: any) => {
        if (err) {
          reject(err);
        } else {
          console.log(`MCP Server listening on port ${port}`);
          resolve();
        }
      });
    });
  }

  private setupWebSocketHandlers(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws, req) => {
      const connectionId = this.generateConnectionId();
      const connection: MCPConnection = {
        id: connectionId,
        capabilities: [],
        authenticated: false,
        lastActivity: new Date()
      };

      this.connections.set(connectionId, connection);
      console.log(`New MCP connection: ${connectionId}`);

      ws.on('message', async (data) => {
        try {
          const message: MCPMessage = JSON.parse(data.toString());
          await this.handleMessage(connectionId, message, ws);
        } catch (error) {
          console.error('Error handling MCP message:', error);
          this.sendError(ws, 'invalid_message', 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.connections.delete(connectionId);
        console.log(`MCP connection closed: ${connectionId}`);
      });

      ws.on('error', (error) => {
        console.error(`MCP WebSocket error for ${connectionId}:`, error);
      });

      // Send initial handshake
      this.sendMessage(ws, {
        id: 'handshake',
        type: 'notification',
        method: 'server/ready',
        params: {
          version: '1.0.0',
          capabilities: ['tools', 'resources', 'prompts'],
          serverName: 'Veri MCP Server'
        }
      });
    });
  }

  private async handleMessage(connectionId: string, message: MCPMessage, ws: any): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Update last activity
    connection.lastActivity = new Date();

    // Rate limiting
    if (!this.checkRateLimit(connectionId)) {
      this.sendError(ws, 'rate_limit_exceeded', 'Too many requests');
      return;
    }

    switch (message.method) {
      case 'initialize':
        await this.handleInitialize(connection, message, ws);
        break;
      
      case 'tools/list':
        await this.handleToolsList(connection, message, ws);
        break;
      
      case 'tools/call':
        await this.handleToolCall(connection, message, ws);
        break;
      
      case 'resources/list':
        await this.handleResourcesList(connection, message, ws);
        break;
      
      case 'resources/read':
        await this.handleResourceRead(connection, message, ws);
        break;
      
      default:
        this.sendError(ws, 'method_not_found', `Unknown method: ${message.method}`);
    }
  }

  private async handleInitialize(connection: MCPConnection, message: MCPMessage, ws: any): Promise<void> {
    const { clientInfo, capabilities } = message.params || {};
    
    connection.capabilities = capabilities || [];
    connection.authenticated = true; // TODO: Implement proper authentication
    
    this.sendMessage(ws, {
      id: message.id,
      type: 'response',
      result: {
        protocolVersion: '1.0.0',
        capabilities: {
          tools: { listChanged: true },
          resources: { subscribe: true, listChanged: true },
          prompts: { listChanged: true }
        },
        serverInfo: {
          name: 'Veri MCP Server',
          version: '1.0.0'
        }
      }
    });
  }

  private async handleToolsList(connection: MCPConnection, message: MCPMessage, ws: any): Promise<void> {
    if (!connection.authenticated) {
      this.sendError(ws, 'unauthorized', 'Connection not authenticated');
      return;
    }

    const tools = await toolRegistry.getAvailableTools();
    
    this.sendMessage(ws, {
      id: message.id,
      type: 'response',
      result: {
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      }
    });
  }

  private async handleToolCall(connection: MCPConnection, message: MCPMessage, ws: any): Promise<void> {
    if (!connection.authenticated) {
      this.sendError(ws, 'unauthorized', 'Connection not authenticated');
      return;
    }

    const { name, arguments: toolArgs } = message.params || {};
    
    try {
      const result = await toolRegistry.callTool(name, toolArgs);
      
      this.sendMessage(ws, {
        id: message.id,
        type: 'response',
        result: {
          content: [{
            type: 'text',
            text: JSON.stringify(result)
          }]
        }
      });
    } catch (error) {
      this.sendError(ws, 'tool_error', `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleResourcesList(connection: MCPConnection, message: MCPMessage, ws: any): Promise<void> {
    // TODO: Implement resource listing
    this.sendMessage(ws, {
      id: message.id,
      type: 'response',
      result: {
        resources: []
      }
    });
  }

  private async handleResourceRead(connection: MCPConnection, message: MCPMessage, ws: any): Promise<void> {
    // TODO: Implement resource reading
    this.sendError(ws, 'not_implemented', 'Resource reading not implemented');
  }

  private checkRateLimit(connectionId: string): boolean {
    const now = Date.now();
    const window = 60000; // 1 minute
    const maxRequests = 100;

    if (!this.rateLimiter.has(connectionId)) {
      this.rateLimiter.set(connectionId, []);
    }

    const requests = this.rateLimiter.get(connectionId)!;
    
    // Clean old requests
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.rateLimiter.set(connectionId, validRequests);
    
    return true;
  }

  private sendMessage(ws: any, message: MCPMessage): void {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: any, code: string, message: string): void {
    this.sendMessage(ws, {
      id: 'error',
      type: 'response',
      error: {
        code,
        message
      }
    });
  }

  private generateConnectionId(): string {
    return 'mcp_' + Math.random().toString(36).substr(2, 9);
  }

  async shutdown(): Promise<void> {
    if (this.wss) {
      this.wss.close();
    }
    if (this.httpServer) {
      this.httpServer.close();
    }
  }

  // Health check endpoint
  getStatus() {
    return {
      enabled: this.isEnabled,
      connections: this.connections.size,
      uptime: process.uptime()
    };
  }
}

export const mcpServer = new MCPServer();