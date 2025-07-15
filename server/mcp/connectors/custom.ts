import fetch from 'node-fetch';

export interface CustomAPIConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  authType?: 'bearer' | 'api_key' | 'basic' | 'custom';
  authHeader?: string;
  timeout?: number;
}

export interface CustomEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
  enabled: boolean;
}

export class CustomAPIConnector {
  private config: CustomAPIConfig | null = null;
  private endpoints: Map<string, CustomEndpoint> = new Map();
  private isConfigured: boolean = false;

  constructor(config?: CustomAPIConfig) {
    if (config) {
      this.configure(config);
    }
    this.initializeDefaultEndpoints();
  }

  configure(config: CustomAPIConfig): void {
    this.config = config;
    this.isConfigured = true;
  }

  private initializeDefaultEndpoints(): void {
    // Add some common API patterns as examples
    this.addEndpoint({
      id: 'get_user_profile',
      name: 'Get User Profile',
      method: 'GET',
      path: '/user/profile',
      description: 'Retrieve user profile information',
      parameters: {
        userId: { type: 'string', required: true }
      },
      enabled: true
    });

    this.addEndpoint({
      id: 'list_items',
      name: 'List Items',
      method: 'GET',
      path: '/items',
      description: 'Get list of items with optional filtering',
      parameters: {
        page: { type: 'number', default: 1 },
        limit: { type: 'number', default: 10 },
        filter: { type: 'string', required: false }
      },
      enabled: true
    });

    this.addEndpoint({
      id: 'create_item',
      name: 'Create Item',
      method: 'POST',
      path: '/items',
      description: 'Create a new item',
      parameters: {
        name: { type: 'string', required: true },
        description: { type: 'string', required: false },
        tags: { type: 'array', required: false }
      },
      enabled: true
    });
  }

  addEndpoint(endpoint: CustomEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  removeEndpoint(id: string): void {
    this.endpoints.delete(id);
  }

  getEndpoints(): CustomEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  async callAPI(options: {
    endpoint?: string;
    method?: string;
    path?: string;
    data?: any;
    headers?: Record<string, string>;
    params?: Record<string, any>;
  }): Promise<any> {
    if (!this.isConfigured) {
      // Return mock data when not configured
      return {
        success: true,
        data: {
          message: 'This is a mock response from custom API call.',
          timestamp: new Date().toISOString(),
          endpoint: options.endpoint || options.path,
          method: options.method || 'GET'
        },
        statusCode: 200
      };
    }

    try {
      let url = this.config!.baseUrl;
      let method = options.method || 'GET';
      let path = options.path || '/';

      // If using a predefined endpoint
      if (options.endpoint) {
        const endpoint = this.endpoints.get(options.endpoint);
        if (!endpoint) {
          throw new Error(`Endpoint not found: ${options.endpoint}`);
        }
        if (!endpoint.enabled) {
          throw new Error(`Endpoint disabled: ${options.endpoint}`);
        }
        method = endpoint.method;
        path = endpoint.path;
      }

      // Build full URL
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      url = url.replace(/\/$/, '') + path;

      // Add query parameters
      if (options.params && method === 'GET') {
        const queryParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
        const queryString = queryParams.toString();
        if (queryString) {
          url += '?' + queryString;
        }
      }

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Veri-MCP-Client/1.0',
        ...this.config!.headers,
        ...options.headers
      };

      // Add authentication
      if (this.config!.apiKey) {
        switch (this.config!.authType) {
          case 'bearer':
            headers['Authorization'] = `Bearer ${this.config!.apiKey}`;
            break;
          case 'api_key':
            headers['X-API-Key'] = this.config!.apiKey;
            break;
          case 'basic':
            headers['Authorization'] = `Basic ${Buffer.from(this.config!.apiKey).toString('base64')}`;
            break;
          case 'custom':
            if (this.config!.authHeader) {
              headers[this.config!.authHeader] = this.config!.apiKey;
            }
            break;
        }
      }

      // Prepare request options
      const requestOptions: any = {
        method,
        headers,
        timeout: this.config!.timeout || 10000
      };

      // Add body for non-GET requests
      if (method !== 'GET' && options.data) {
        requestOptions.body = JSON.stringify(options.data);
      }

      // Make request
      const response = await fetch(url, requestOptions);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return {
        success: response.ok,
        data: responseData,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      console.error('Custom API error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<any> {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Custom API not configured'
      };
    }

    try {
      // Try a simple GET request to the base URL
      const response = await this.callAPI({
        method: 'GET',
        path: '/health',
        headers: {}
      });

      return {
        success: true,
        message: 'Connection successful',
        response
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async executeEndpoint(endpointId: string, parameters: Record<string, any> = {}): Promise<any> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) {
      throw new Error(`Endpoint not found: ${endpointId}`);
    }

    if (!endpoint.enabled) {
      throw new Error(`Endpoint disabled: ${endpointId}`);
    }

    // Validate parameters
    if (endpoint.parameters) {
      for (const [paramName, paramConfig] of Object.entries(endpoint.parameters)) {
        if (paramConfig.required && !parameters[paramName]) {
          throw new Error(`Required parameter missing: ${paramName}`);
        }
      }
    }

    // Execute the endpoint
    const requestOptions: any = {
      endpoint: endpointId,
      method: endpoint.method,
      path: endpoint.path,
      headers: endpoint.headers || {}
    };

    if (endpoint.method === 'GET') {
      requestOptions.params = parameters;
    } else {
      requestOptions.data = parameters;
    }

    return this.callAPI(requestOptions);
  }

  getConnectionStatus(): any {
    return {
      connected: this.isConfigured,
      service: 'Custom API',
      baseUrl: this.config?.baseUrl || 'Not configured',
      endpoints: this.endpoints.size,
      capabilities: [
        'custom_api_calls',
        'endpoint_management',
        'parameter_validation',
        'authentication_support'
      ],
      lastSync: this.isConfigured ? new Date().toISOString() : null
    };
  }
}

export const customAPIConnector = new CustomAPIConnector();