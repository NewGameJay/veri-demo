import { Client } from '@notionhq/client';

export interface NotionConfig {
  authToken: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

export class NotionConnector {
  private client: Client | null = null;
  private isConfigured: boolean = false;
  private config: NotionConfig | null = null;

  constructor(config?: NotionConfig) {
    if (config) {
      this.configure(config);
    }
  }

  configure(config: NotionConfig): void {
    this.config = config;
    
    if (config.authToken) {
      this.client = new Client({
        auth: config.authToken,
      });
      this.isConfigured = true;
    }
  }

  async authenticate(): Promise<string> {
    if (!this.config?.clientId) {
      throw new Error('Notion connector not configured with clientId');
    }

    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${this.config.clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(this.config.redirectUri || 'http://localhost:5000/api/oauth/notion/callback')}`;

    return authUrl;
  }

  async handleAuthCallback(code: string): Promise<any> {
    if (!this.config) {
      throw new Error('Notion connector not configured');
    }

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri || 'http://localhost:5000/api/oauth/notion/callback'
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.client = new Client({
        auth: data.access_token,
      });
      this.isConfigured = true;
      return data;
    } else {
      throw new Error(`Notion OAuth error: ${data.error}`);
    }
  }

  async search(query: string, options: {
    filter?: any;
    sort?: any;
    startCursor?: string;
    pageSize?: number;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        results: [
          {
            id: 'page_1',
            object: 'page',
            created_time: '2025-01-15T10:30:00Z',
            last_edited_time: '2025-01-15T10:30:00Z',
            url: 'https://notion.so/mock-page-1',
            properties: {
              Name: {
                title: [
                  {
                    text: {
                      content: 'Project Documentation'
                    }
                  }
                ]
              }
            }
          },
          {
            id: 'page_2',
            object: 'page',
            created_time: '2025-01-14T15:45:00Z',
            last_edited_time: '2025-01-14T15:45:00Z',
            url: 'https://notion.so/mock-page-2',
            properties: {
              Name: {
                title: [
                  {
                    text: {
                      content: 'Meeting Notes'
                    }
                  }
                ]
              }
            }
          }
        ],
        has_more: false,
        next_cursor: null
      };
    }

    try {
      const response = await this.client!.search({
        query,
        filter: options.filter,
        sort: options.sort,
        start_cursor: options.startCursor,
        page_size: options.pageSize || 10
      });

      return response;
    } catch (error) {
      console.error('Notion API error:', error);
      throw error;
    }
  }

  async getPage(pageId: string): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        id: pageId,
        object: 'page',
        created_time: '2025-01-15T10:30:00Z',
        last_edited_time: '2025-01-15T10:30:00Z',
        url: `https://notion.so/${pageId}`,
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: 'Mock Page Title'
                }
              }
            ]
          }
        }
      };
    }

    try {
      const response = await this.client!.pages.retrieve({
        page_id: pageId
      });

      return response;
    } catch (error) {
      console.error('Notion API error:', error);
      throw error;
    }
  }

  async getPageContent(pageId: string): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        results: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `This is mock content for Notion page ${pageId}. In a real implementation, this would contain the actual page content from Notion.`
                  }
                }
              ]
            }
          }
        ]
      };
    }

    try {
      const response = await this.client!.blocks.children.list({
        block_id: pageId
      });

      return response;
    } catch (error) {
      console.error('Notion API error:', error);
      throw error;
    }
  }

  async getDatabases(): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        results: [
          {
            id: 'db_1',
            object: 'database',
            created_time: '2025-01-15T10:30:00Z',
            last_edited_time: '2025-01-15T10:30:00Z',
            url: 'https://notion.so/mock-database-1',
            title: [
              {
                text: {
                  content: 'Projects Database'
                }
              }
            ]
          },
          {
            id: 'db_2',
            object: 'database',
            created_time: '2025-01-14T15:45:00Z',
            last_edited_time: '2025-01-14T15:45:00Z',
            url: 'https://notion.so/mock-database-2',
            title: [
              {
                text: {
                  content: 'Tasks Database'
                }
              }
            ]
          }
        ]
      };
    }

    try {
      const response = await this.client!.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });

      return response;
    } catch (error) {
      console.error('Notion API error:', error);
      throw error;
    }
  }

  async queryDatabase(databaseId: string, options: {
    filter?: any;
    sorts?: any;
    startCursor?: string;
    pageSize?: number;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        results: [
          {
            id: 'page_1',
            object: 'page',
            created_time: '2025-01-15T10:30:00Z',
            last_edited_time: '2025-01-15T10:30:00Z',
            properties: {
              Name: {
                title: [
                  {
                    text: {
                      content: 'Mock Database Entry 1'
                    }
                  }
                ]
              },
              Status: {
                select: {
                  name: 'In Progress'
                }
              }
            }
          }
        ]
      };
    }

    try {
      const response = await this.client!.databases.query({
        database_id: databaseId,
        filter: options.filter,
        sorts: options.sorts,
        start_cursor: options.startCursor,
        page_size: options.pageSize || 10
      });

      return response;
    } catch (error) {
      console.error('Notion API error:', error);
      throw error;
    }
  }

  getConnectionStatus(): any {
    return {
      connected: this.isConfigured,
      service: 'Notion',
      capabilities: [
        'search',
        'get_page',
        'get_page_content',
        'get_databases',
        'query_database'
      ],
      lastSync: this.isConfigured ? new Date().toISOString() : null
    };
  }
}

export const notionConnector = new NotionConnector();