import { useState, useEffect } from "react";
import { Copy, Wallet, Shield, ExternalLink, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface WalletInfo {
  veriAccountId: string | null;
  walletAddress: string | null;
  chainId: number | null;
  walletCreatedAt: string | null;
  hasWallet: boolean;
}

interface WalletBalance {
  balance: string;
  tokens: Array<{ symbol: string; balance: string; usdValue: string }>;
}

function formatWalletAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function copyToClipboard(text: string, description: string, toast: any) {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied!",
    description: `${description} copied to clipboard`,
    duration: 2000,
  });
}

export function WalletDisplay() {
  const { toast } = useToast();
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const { data: walletInfo, isLoading: walletLoading, refetch: refetchWallet } = useQuery<WalletInfo>({
    queryKey: ['/api/wallet/info'],
  });

  const { data: walletBalance, isLoading: balanceLoading } = useQuery<WalletBalance>({
    queryKey: ['/api/wallet/balance', walletInfo?.walletAddress],
    enabled: !!walletInfo?.walletAddress,
  });

  const createWallet = async () => {
    setIsCreatingWallet(true);
    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        await refetchWallet();
        toast({
          title: "Wallet Created!",
          description: "Your Veri wallet has been successfully created",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to create wallet');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsCreatingWallet(false);
    }
  };

  if (walletLoading) {
    return (
      <Card className="glass-medium border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Veri Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!walletInfo?.hasWallet) {
    return (
      <Card className="glass-medium border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Veri Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create Your Web3 Wallet</h3>
            <p className="text-white/60 mb-6">
              Get started with your secure custodial wallet to receive rewards and participate in the Web3 gaming economy.
            </p>
            <Button
              onClick={createWallet}
              disabled={isCreatingWallet}
              className="veri-gradient text-white hover:opacity-90"
            >
              {isCreatingWallet ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Wallet...
                </div>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Create Wallet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-medium border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Veri Wallet
            <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Secured by Veri
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Veri Account ID */}
          <div>
            <label className="text-sm text-white/60 block mb-2">Veri Account ID</label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <div className="font-mono text-white text-lg font-bold">
                  {walletInfo.veriAccountId}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(walletInfo.veriAccountId!, "Account ID", toast)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="text-sm text-white/60 block mb-2">Wallet Address</label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <div className="font-mono text-white">
                  {formatWalletAddress(walletInfo.walletAddress!)}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  Polygon Network (Chain ID: {walletInfo.chainId})
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(walletInfo.walletAddress!, "Wallet address", toast)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Wallet Info */}
          {walletInfo.walletCreatedAt && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              Created {new Date(walletInfo.walletCreatedAt).toLocaleDateString()}
            </div>
          )}

          {/* Token Balances - Placeholder */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Token Balances</h4>
            {balanceLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {walletBalance?.tokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{token.symbol}</div>
                        <div className="text-xs text-white/60">{token.usdValue}</div>
                      </div>
                    </div>
                    <div className="text-white font-mono">{token.balance}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coming Soon Features */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Coming Soon</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm font-medium">Staking</span>
                  <Badge variant="outline" className="text-xs">Soon</Badge>
                </div>
                <p className="text-xs text-white/60">Stake VERI tokens to earn rewards</p>
              </div>
              
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">Transactions</span>
                  <Badge variant="outline" className="text-xs">Soon</Badge>
                </div>
                <p className="text-xs text-white/60">View transaction history</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-emerald-400 font-medium mb-1">Wallet Security</h4>
                <p className="text-sm text-white/80">
                  Your wallet is secured with industry-standard encryption. Private keys are never exposed and remain encrypted on our secure servers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}