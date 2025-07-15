import { WebClient } from '@slack/web-api';

export interface SlackConfig {
  clientId: string;
  clientSecret: string;
  botToken?: string;
  userToken?: string;
  signingSecret: string;
}

export class SlackConnector {
  private client: WebClient | null = null;
  private isConfigured: boolean = false;
  private config: SlackConfig | null = null;

  constructor(config?: SlackConfig) {
    if (config) {
      this.configure(config);
    }
  }

  configure(config: SlackConfig): void {
    this.config = config;
    
    if (config.botToken) {
      this.client = new WebClient(config.botToken);
      this.isConfigured = true;
    }
  }

  async authenticate(): Promise<string> {
    if (!this.config) {
      throw new Error('Slack connector not configured');
    }

    const scopes = [
      'channels:read',
      'groups:read',
      'im:read',
      'mpim:read',
      'channels:history',
      'groups:history',
      'im:history',
      'mpim:history',
      'users:read'
    ];

    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${this.config.clientId}&scope=${scopes.join(',')}&redirect_uri=${encodeURIComponent('http://localhost:5000/api/oauth/slack/callback')}`;

    return authUrl;
  }

  async handleAuthCallback(code: string): Promise<any> {
    if (!this.config) {
      throw new Error('Slack connector not configured');
    }

    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: 'http://localhost:5000/api/oauth/slack/callback'
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      this.client = new WebClient(data.access_token);
      this.isConfigured = true;
      return data;
    } else {
      throw new Error(`Slack OAuth error: ${data.error}`);
    }
  }

  async getChannels(options: {
    types?: string;
    excludeArchived?: boolean;
    limit?: number;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        channels: [
          {
            id: 'C1234567890',
            name: 'general',
            is_private: false,
            is_archived: false,
            num_members: 25,
            topic: {
              value: 'General discussion',
              creator: 'U1234567890',
              last_set: 1642521600
            }
          },
          {
            id: 'C0987654321',
            name: 'random',
            is_private: false,
            is_archived: false,
            num_members: 18,
            topic: {
              value: 'Random chatter',
              creator: 'U0987654321',
              last_set: 1642521500
            }
          }
        ]
      };
    }

    try {
      const response = await this.client!.conversations.list({
        types: options.types || 'public_channel,private_channel',
        exclude_archived: options.excludeArchived !== false,
        limit: options.limit || 100
      });

      return response;
    } catch (error) {
      console.error('Slack API error:', error);
      throw error;
    }
  }

  async getChannelHistory(channelId: string, options: {
    limit?: number;
    cursor?: string;
    oldest?: string;
    latest?: string;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        messages: [
          {
            type: 'message',
            user: 'U1234567890',
            text: 'Hello team! This is a mock message from Slack.',
            ts: '1642521600.000100',
            thread_ts: undefined
          },
          {
            type: 'message',
            user: 'U0987654321',
            text: 'Another mock message for testing purposes.',
            ts: '1642521500.000100',
            thread_ts: undefined
          },
          {
            type: 'message',
            user: 'U1234567890',
            text: 'This is a threaded reply example.',
            ts: '1642521400.000100',
            thread_ts: '1642521600.000100'
          }
        ],
        has_more: false,
        response_metadata: {
          next_cursor: ''
        }
      };
    }

    try {
      const response = await this.client!.conversations.history({
        channel: channelId,
        limit: options.limit || 50,
        cursor: options.cursor,
        oldest: options.oldest,
        latest: options.latest
      });

      return response;
    } catch (error) {
      console.error('Slack API error:', error);
      throw error;
    }
  }

  async getUsers(options: {
    limit?: number;
    cursor?: string;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        members: [
          {
            id: 'U1234567890',
            name: 'john.doe',
            real_name: 'John Doe',
            profile: {
              display_name: 'John',
              email: 'john.doe@example.com',
              image_24: 'https://avatars.slack-edge.com/mock-24.jpg',
              image_32: 'https://avatars.slack-edge.com/mock-32.jpg'
            },
            is_bot: false,
            is_app_user: false
          },
          {
            id: 'U0987654321',
            name: 'jane.smith',
            real_name: 'Jane Smith',
            profile: {
              display_name: 'Jane',
              email: 'jane.smith@example.com',
              image_24: 'https://avatars.slack-edge.com/mock2-24.jpg',
              image_32: 'https://avatars.slack-edge.com/mock2-32.jpg'
            },
            is_bot: false,
            is_app_user: false
          }
        ]
      };
    }

    try {
      const response = await this.client!.users.list({
        limit: options.limit || 100,
        cursor: options.cursor
      });

      return response;
    } catch (error) {
      console.error('Slack API error:', error);
      throw error;
    }
  }

  async searchMessages(query: string, options: {
    count?: number;
    page?: number;
    sort?: string;
    sortDir?: string;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        messages: {
          total: 2,
          matches: [
            {
              type: 'message',
              user: 'U1234567890',
              username: 'john.doe',
              text: `Mock search result for "${query}"`,
              ts: '1642521600.000100',
              channel: {
                id: 'C1234567890',
                name: 'general'
              }
            },
            {
              type: 'message',
              user: 'U0987654321',
              username: 'jane.smith',
              text: `Another mock result containing "${query}"`,
              ts: '1642521500.000100',
              channel: {
                id: 'C0987654321',
                name: 'random'
              }
            }
          ]
        }
      };
    }

    try {
      const response = await this.client!.search.messages({
        query,
        count: options.count || 20,
        page: options.page || 1,
        sort: options.sort || 'timestamp',
        sort_dir: options.sortDir || 'desc'
      });

      return response;
    } catch (error) {
      console.error('Slack API error:', error);
      throw error;
    }
  }

  getConnectionStatus(): any {
    return {
      connected: this.isConfigured,
      service: 'Slack',
      capabilities: [
        'get_channels',
        'get_messages',
        'get_users',
        'search_messages'
      ],
      lastSync: this.isConfigured ? new Date().toISOString() : null
    };
  }
}

export const slackConnector = new SlackConnector();