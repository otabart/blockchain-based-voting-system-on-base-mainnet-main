import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

interface WalletConnectProps {
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  isMetaMaskInstalled: boolean;
  isCorrectNetwork: boolean;
  chainId: number | null;
  error: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  switchToBase: () => void;
}

const WalletConnect = ({
  account,
  isConnecting,
  isConnected,
  isMetaMaskInstalled,
  isCorrectNetwork,
  chainId,
  error,
  connectWallet,
  disconnectWallet,
  switchToBase,
}: WalletConnectProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 8453:
        return "Base";
      case 11155111:
        return "Sepolia Testnet";
      case 5:
        return "Goerli Testnet";
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className="card-gradient p-6 border-2 border-destructive/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">MetaMask Required</h3>
            <p className="text-sm text-muted-foreground">
              Please install MetaMask to interact with this dApp
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Install MetaMask
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="card-gradient p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your MetaMask wallet to participate in voting
            </p>
          </div>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full blockchain-gradient hover:opacity-90 transition-opacity"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connect MetaMask
              </div>
            )}
          </Button>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-gradient p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">
                {formatAddress(account!)}
              </p>
              <Badge
                variant={isCorrectNetwork ? "default" : "destructive"}
                className="text-xs"
              >
                {chainId ? getNetworkName(chainId) : "Unknown"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isCorrectNetwork ? "Connected" : "Wrong Network"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isCorrectNetwork && (
            <Button
              onClick={switchToBase}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Switch to Base
            </Button>
          )}
          <Button
            onClick={disconnectWallet}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WalletConnect;