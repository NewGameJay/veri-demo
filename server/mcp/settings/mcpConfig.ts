import { z } from 'zod';

// Configuration schemas for different connectors
export const GoogleDriveConfigSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  redirectUri: z.string().url('Must be a valid URL'),
  refreshToken: z.string().optional(),
  enabled: z.boolean().default(false)
});

export const SlackConfigSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  botToken: z.string().optional(),
  userToken: z.string().optional(),
  signingSecret: z.string().min(1, 'Signing Secret is required'),
  enabled: z.boolean().default(false)
});

export const NotionConfigSchema = z.object({
  authToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  redirectUri: z.string().url().optional(),
  enabled: z.boolean().default(false)
});

export const CustomAPIConfigSchema = z.object({
  baseUrl: z.string().url('Must be a valid URL'),
  apiKey: z.string().optional(),
  authType: z.enum(['bearer', 'api_key', 'basic', 'custom']).default('bearer'),
  authHeader: z.string().optional(),
  timeout: z.number().min(1000).max(60000).default(10000),
  headers: z.record(z.string()).optional(),
  enabled: z.boolean().default(false)
});

export const MCPConfigSchema = z.object({
  enabled: z.boolean().default(false),
  port: z.number().min(1000).max(65535).default(8080),
  maxConnections: z.number().min(1).max(1000).default(100),
  rateLimitWindow: z.number().min(1000).max(3600000).default(60000), // 1 minute
  rateLimitMax: z.number().min(1).max(10000).default(100),
  connectors: z.object({
    googleDrive: GoogleDriveConfigSchema.optional(),
    slack: SlackConfigSchema.optional(),
    notion: NotionConfigSchema.optional(),
    customAPI: CustomAPIConfigSchema.optional()
  }).default({})
});

export type GoogleDriveConfig = z.infer<typeof GoogleDriveConfigSchema>;
export type SlackConfig = z.infer<typeof SlackConfigSchema>;
export type NotionConfig = z.infer<typeof NotionConfigSchema>;
export type CustomAPIConfig = z.infer<typeof CustomAPIConfigSchema>;
export type MCPConfig = z.infer<typeof MCPConfigSchema>;

export interface ConnectorUIConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'document' | 'communication' | 'database' | 'custom';
  oauthUrl?: string;
  configFields: ConfigField[];
  permissions: string[];
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: string;
  errorMessage?: string;
}

export interface ConfigField {
  id: string;
  name: string;
  type: 'text' | 'password' | 'url' | 'select' | 'boolean' | 'number';
  required: boolean;
  description?: string;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export class MCPConfigManager {
  private config: MCPConfig;
  private configPath: string;

  constructor(configPath: string = './mcp-config.json') {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  private loadConfig(): MCPConfig {
    try {
      // In a real implementation, this would load from file
      // For now, return default config
      return {
        enabled: process.env.USE_MCP === 'true',
        port: parseInt(process.env.MCP_PORT || '8080'),
        maxConnections: parseInt(process.env.MCP_MAX_CONNECTIONS || '100'),
        rateLimitWindow: parseInt(process.env.MCP_RATE_LIMIT_WINDOW || '60000'),
        rateLimitMax: parseInt(process.env.MCP_RATE_LIMIT_MAX || '100'),
        connectors: {
          googleDrive: {
            clientId: process.env.GOOGLE_DRIVE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET || '',
            redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:5000/api/oauth/google/callback',
            enabled: false
          },
          slack: {
            clientId: process.env.SLACK_CLIENT_ID || '',
            clientSecret: process.env.SLACK_CLIENT_SECRET || '',
            signingSecret: process.env.SLACK_SIGNING_SECRET || '',
            enabled: false
          },
          notion: {
            clientId: process.env.NOTION_CLIENT_ID || '',
            clientSecret: process.env.NOTION_CLIENT_SECRET || '',
            redirectUri: process.env.NOTION_REDIRECT_URI || 'http://localhost:5000/api/oauth/notion/callback',
            enabled: false
          },
          customAPI: {
            baseUrl: process.env.CUSTOM_API_BASE_URL || '',
            apiKey: process.env.CUSTOM_API_KEY || '',
            authType: (process.env.CUSTOM_API_AUTH_TYPE as any) || 'bearer',
            enabled: false
          }
        }
      };
    } catch (error) {
      console.error('Failed to load MCP config:', error);
      return MCPConfigSchema.parse({});
    }
  }

  getConfig(): MCPConfig {
    return this.config;
  }

  updateConfig(updates: Partial<MCPConfig>): void {
    this.config = MCPConfigSchema.parse({
      ...this.config,
      ...updates
    });
    this.saveConfig();
  }

  updateConnectorConfig(connectorId: string, config: any): void {
    this.config.connectors[connectorId as keyof typeof this.config.connectors] = config;
    this.saveConfig();
  }

  private saveConfig(): void {
    // In a real implementation, this would save to file
    console.log('Config updated (not persisted in demo mode):', this.config);
  }

  generateUIConfig(): ConnectorUIConfig[] {
    return [
      {
        id: 'google-drive',
        name: 'Google Drive',
        description: 'Access documents, spreadsheets, and presentations from Google Drive',
        icon: 'FileText',
        category: 'document',
        oauthUrl: '/api/oauth/google/authorize',
        configFields: [
          {
            id: 'clientId',
            name: 'Client ID',
            type: 'text',
            required: true,
            description: 'Google OAuth Client ID from Google Cloud Console'
          },
          {
            id: 'clientSecret',
            name: 'Client Secret',
            type: 'password',
            required: true,
            description: 'Google OAuth Client Secret'
          },
          {
            id: 'redirectUri',
            name: 'Redirect URI',
            type: 'url',
            required: true,
            description: 'OAuth callback URL'
          }
        ],
        permissions: ['Read documents', 'Access shared files', 'File metadata'],
        status: this.config.connectors.googleDrive?.enabled ? 'connected' : 'disconnected'
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Import communications and channel data from Slack workspaces',
        icon: 'MessageSquare',
        category: 'communication',
        oauthUrl: '/api/oauth/slack/authorize',
        configFields: [
          {
            id: 'clientId',
            name: 'Client ID',
            type: 'text',
            required: true,
            description: 'Slack App Client ID'
          },
          {
            id: 'clientSecret',
            name: 'Client Secret',
            type: 'password',
            required: true,
            description: 'Slack App Client Secret'
          },
          {
            id: 'signingSecret',
            name: 'Signing Secret',
            type: 'password',
            required: true,
            description: 'Slack App Signing Secret for verification'
          }
        ],
        permissions: ['Read messages', 'Access channels', 'User profiles'],
        status: this.config.connectors.slack?.enabled ? 'connected' : 'disconnected'
      },
      {
        id: 'notion',
        name: 'Notion',
        description: 'Connect knowledge bases and documentation from Notion',
        icon: 'Database',
        category: 'database',
        oauthUrl: '/api/oauth/notion/authorize',
        configFields: [
          {
            id: 'clientId',
            name: 'Client ID',
            type: 'text',
            required: true,
            description: 'Notion Integration Client ID'
          },
          {
            id: 'clientSecret',
            name: 'Client Secret',
            type: 'password',
            required: true,
            description: 'Notion Integration Client Secret'
          },
          {
            id: 'redirectUri',
            name: 'Redirect URI',
            type: 'url',
            required: true,
            description: 'OAuth callback URL'
          }
        ],
        permissions: ['Read pages', 'Access databases', 'Search content'],
        status: this.config.connectors.notion?.enabled ? 'connected' : 'disconnected'
      },
      {
        id: 'custom',
        name: 'Custom API',
        description: 'Build your own data connectors with custom API endpoints',
        icon: 'Settings',
        category: 'custom',
        configFields: [
          {
            id: 'baseUrl',
            name: 'Base URL',
            type: 'url',
            required: true,
            description: 'Base URL for your custom API'
          },
          {
            id: 'apiKey',
            name: 'API Key',
            type: 'password',
            required: false,
            description: 'API key for authentication'
          },
          {
            id: 'authType',
            name: 'Auth Type',
            type: 'select',
            required: true,
            options: ['bearer', 'api_key', 'basic', 'custom'],
            description: 'Authentication method'
          },
          {
            id: 'timeout',
            name: 'Timeout (ms)',
            type: 'number',
            required: false,
            description: 'Request timeout in milliseconds',
            validation: { min: 1000, max: 60000 }
          }
        ],
        permissions: ['Custom endpoints', 'Webhook support', 'API key management'],
        status: this.config.connectors.customAPI?.enabled ? 'connected' : 'disconnected'
      }
    ];
  }

  getConnectorStatus(connectorId: string): any {
    const config = this.config.connectors[connectorId as keyof typeof this.config.connectors];
    return {
      id: connectorId,
      enabled: config?.enabled || false,
      configured: this.isConnectorConfigured(connectorId),
      lastSync: null, // This would be loaded from database in real implementation
      errorMessage: null
    };
  }

  private isConnectorConfigured(connectorId: string): boolean {
    const config = this.config.connectors[connectorId as keyof typeof this.config.connectors];
    
    switch (connectorId) {
      case 'googleDrive':
        return !!(config as any)?.clientId && !!(config as any)?.clientSecret;
      case 'slack':
        return !!(config as any)?.clientId && !!(config as any)?.clientSecret && !!(config as any)?.signingSecret;
      case 'notion':
        return !!(config as any)?.clientId && !!(config as any)?.clientSecret;
      case 'customAPI':
        return !!(config as any)?.baseUrl;
      default:
        return false;
    }
  }
}

export const mcpConfigManager = new MCPConfigManager();