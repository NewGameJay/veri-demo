import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { 
  Zap, 
  FileText, 
  MessageSquare, 
  Database, 
  Settings, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface ConnectorStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'pending';
  permissions: string[];
  lastSync?: string;
  comingSoon?: boolean;
}

const getIconForConnector = (id: string) => {
  switch (id) {
    case 'google-drive':
      return FileText;
    case 'slack':
      return MessageSquare;
    case 'notion':
      return Database;
    case 'custom':
      return Settings;
    default:
      return Settings;
  }
};

const StatusIcon = ({ status }: { status: ConnectorStatus['status'] }) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-400" />;
    default:
      return <XCircle className="w-4 h-4 text-red-400" />;
  }
};

const StatusBadge = ({ status }: { status: ConnectorStatus['status'] }) => {
  const variants = {
    connected: 'bg-green-500/20 text-green-400 border-green-400/20',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20',
    disconnected: 'bg-red-500/20 text-red-400 border-red-400/20'
  };

  const labels = {
    connected: 'Connected',
    pending: 'Connecting...',
    disconnected: 'Not Connected'
  };

  return (
    <Badge className={`${variants[status]} border`}>
      <StatusIcon status={status} />
      <span className="ml-1">{labels[status]}</span>
    </Badge>
  );
};

export function VeriConnectors() {
  const { data: connectors, isLoading } = useQuery({
    queryKey: ['/api/mcp/connectors'],
    select: (data: any[]) => data.map((connector: any) => ({
      ...connector,
      icon: getIconForConnector(connector.id),
      comingSoon: true // Demo mode - all connectors show as coming soon
    }))
  });

  const { data: mcpStatus } = useQuery({
    queryKey: ['/api/mcp/status']
  });

  const handleConnect = (connectorId: string) => {
    // This would normally trigger OAuth flow
    console.log(`Connecting to ${connectorId}`);
  };

  const handleDisconnect = (connectorId: string) => {
    // This would normally revoke access
    console.log(`Disconnecting from ${connectorId}`);
  };

  const handleTestConnection = (connectorId: string) => {
    // This would normally test the connection
    console.log(`Testing connection to ${connectorId}`);
  };

  if (isLoading) {
    return (
      <Card className="glass-medium border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Veri Connectors
          </CardTitle>
          <CardDescription className="text-white/60">
            Loading connectors...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-medium border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Veri Connectors
        </CardTitle>
        <CardDescription className="text-white/60">
          Connect external services to enhance your AI agent capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {connectors?.map((connector) => {
          const IconComponent = connector.icon;
          
          return (
            <div key={connector.id} className="p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{connector.name}</h3>
                    <p className="text-sm text-white/60">{connector.description}</p>
                  </div>
                </div>
                <StatusBadge status={connector.status} />
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <Label className="text-white/80 text-sm mb-2 block">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {connector.permissions?.map((permission: string) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className="text-xs border-white/20 text-white/60"
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Connection Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${connector.id}-enabled`} className="text-white/80 text-sm">
                    Enable Data Sync
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch
                          id={`${connector.id}-enabled`}
                          disabled={true}
                          checked={false}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Coming Soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex gap-2">
                  {connector.status === 'connected' ? (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white/60"
                              disabled={connector.comingSoon}
                              onClick={() => handleTestConnection(connector.id)}
                            >
                              Test
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-400/20 text-red-400"
                              disabled={connector.comingSoon}
                              onClick={() => handleDisconnect(connector.id)}
                            >
                              Disconnect
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-400/20 text-emerald-400"
                            disabled={connector.comingSoon}
                            onClick={() => handleConnect(connector.id)}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Connect
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Coming Soon</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              {/* Last Sync Info */}
              {connector.lastSync && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40">
                    Last sync: {connector.lastSync}
                  </p>
                </div>
              )}
            </div>
          );
        }) || []}

        {/* MCP Protocol Info */}
        <div className="p-4 rounded-lg border border-blue-400/20 bg-blue-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Model Context Protocol (MCP)</span>
          </div>
          <p className="text-xs text-white/60 mb-3">
            Veri Connectors use the Model Context Protocol to securely integrate with external services, 
            providing your AI agents with rich context while maintaining data privacy.
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs border-blue-400/20 text-blue-400">
              Protocol Version 1.0
            </Badge>
            <Badge variant="outline" className="text-xs border-white/20 text-white/60">
              {mcpStatus?.enabled ? 'Server Running' : 'Demo Mode'}
            </Badge>
            <Badge variant="outline" className="text-xs border-white/20 text-white/60">
              {connectors?.length || 0} Connectors Available
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}