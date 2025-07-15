import { google } from 'googleapis';

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
}

export class GoogleDriveConnector {
  private auth: any;
  private drive: any;
  private isConfigured: boolean = false;

  constructor(config?: GoogleDriveConfig) {
    if (config) {
      this.configure(config);
    }
  }

  configure(config: GoogleDriveConfig): void {
    this.auth = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    if (config.refreshToken) {
      this.auth.setCredentials({
        refresh_token: config.refreshToken
      });
    }

    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.isConfigured = true;
  }

  async authenticate(): Promise<string> {
    if (!this.auth) {
      throw new Error('Google Drive connector not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];

    const authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    return authUrl;
  }

  async handleAuthCallback(code: string): Promise<any> {
    if (!this.auth) {
      throw new Error('Google Drive connector not configured');
    }

    const { tokens } = await this.auth.getToken(code);
    this.auth.setCredentials(tokens);

    return tokens;
  }

  async listFiles(options: {
    query?: string;
    pageSize?: number;
    pageToken?: string;
  } = {}): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        files: [
          {
            id: 'mock_file_1',
            name: 'Example Document.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            modifiedTime: '2025-01-15T10:30:00Z',
            size: 1024000,
            webViewLink: 'https://docs.google.com/document/d/mock_file_1'
          },
          {
            id: 'mock_file_2',
            name: 'Project Presentation.pptx',
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            modifiedTime: '2025-01-14T15:45:00Z',
            size: 2048000,
            webViewLink: 'https://docs.google.com/presentation/d/mock_file_2'
          }
        ],
        nextPageToken: null
      };
    }

    try {
      const response = await this.drive.files.list({
        q: options.query || undefined,
        pageSize: options.pageSize || 10,
        pageToken: options.pageToken || undefined,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size, webViewLink)'
      });

      return response.data;
    } catch (error) {
      console.error('Google Drive API error:', error);
      throw error;
    }
  }

  async getFile(fileId: string): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        id: fileId,
        name: 'Mock Document.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        modifiedTime: '2025-01-15T10:30:00Z',
        size: 1024000,
        webViewLink: `https://docs.google.com/document/d/${fileId}`
      };
    }

    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, modifiedTime, size, webViewLink'
      });

      return response.data;
    } catch (error) {
      console.error('Google Drive API error:', error);
      throw error;
    }
  }

  async getFileContent(fileId: string): Promise<string> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return `This is mock content for Google Drive file ${fileId}. In a real implementation, this would contain the actual file content.`;
    }

    try {
      const response = await this.drive.files.export({
        fileId,
        mimeType: 'text/plain'
      });

      return response.data;
    } catch (error) {
      // Try to get as binary if export fails
      try {
        const response = await this.drive.files.get({
          fileId,
          alt: 'media'
        });

        return response.data.toString();
      } catch (binaryError) {
        console.error('Google Drive content retrieval error:', binaryError);
        throw binaryError;
      }
    }
  }

  async searchFiles(query: string, options: {
    pageSize?: number;
    pageToken?: string;
  } = {}): Promise<any> {
    return this.listFiles({
      query: `name contains '${query}' or fullText contains '${query}'`,
      pageSize: options.pageSize,
      pageToken: options.pageToken
    });
  }

  getConnectionStatus(): any {
    return {
      connected: this.isConfigured,
      service: 'Google Drive',
      capabilities: [
        'list_files',
        'read_file',
        'search_files',
        'get_metadata'
      ],
      lastSync: this.isConfigured ? new Date().toISOString() : null
    };
  }
}

export const googleDriveConnector = new GoogleDriveConnector();