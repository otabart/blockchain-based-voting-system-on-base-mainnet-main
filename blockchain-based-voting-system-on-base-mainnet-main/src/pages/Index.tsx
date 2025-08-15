import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vote, BarChart3, Users, Shield, ExternalLink } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { useVotingContract } from "@/hooks/useVotingContract";
import WalletConnect from "@/components/WalletConnect";
import VotingInterface from "@/components/VotingInterface";
import VotingResults from "@/components/VotingResults";

const Index = () => {
  const web3 = useWeb3();
  const votingContract = useVotingContract(web3.provider, web3.signer, web3.account);
  const [activeTab, setActiveTab] = useState("vote");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DecentralVote</h1>
                <p className="text-sm text-muted-foreground">Blockchain Voting dApp</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Ethereum
              </Badge>
              <Badge 
                variant={web3.isCorrectNetwork ? "default" : "destructive"}
                className="hidden sm:flex"
              >
                {web3.isCorrectNetwork ? "Base Mainnet" : "Wrong Network"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Decentralized Voting Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cast your vote securely on the blockchain. Transparent, immutable, and democratic.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-accent" />
                Secure
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-secondary" />
                Transparent
              </div>
              <div className="flex items-center gap-1">
                <Vote className="h-4 w-4 text-primary" />
                Immutable
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <WalletConnect {...web3} />

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vote" className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Vote
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vote" className="animate-slide-up">
              <VotingInterface
                candidates={votingContract.candidates}
                hasVoted={votingContract.hasVoted}
                isLoading={votingContract.isLoading}
                isConnected={web3.isConnected && web3.isCorrectNetwork}
                totalVotes={votingContract.totalVotes}
                onVote={votingContract.vote}
              />
            </TabsContent>

            <TabsContent value="results" className="animate-slide-up">
              <VotingResults
                candidates={votingContract.candidates}
                totalVotes={votingContract.totalVotes}
                isLive={true}
              />
            </TabsContent>
          </Tabs>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="glass-card p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-foreground mb-2">Secure Voting</h3>
              <p className="text-sm text-muted-foreground">
                Your votes are secured by Ethereum blockchain technology
              </p>
            </Card>
            
            <Card className="glass-card p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-semibold text-foreground mb-2">Transparent Process</h3>
              <p className="text-sm text-muted-foreground">
                All votes are publicly verifiable on the blockchain
              </p>
            </Card>
            
            <Card className="glass-card p-6 text-center">
              <Vote className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold text-foreground mb-2">One Vote Per Address</h3>
              <p className="text-sm text-muted-foreground">
                Smart contracts ensure each address can only vote once
              </p>
            </Card>
          </div>

          {/* Contract Info */}
          {votingContract.error && (
            <Card className="glass-card p-4 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">Demo Mode Active</p>
                  <p className="text-xs text-muted-foreground">
                    Contract not deployed yet. Deploy the contract to enable live voting.
                  </p>
                </div>
                <a
                  href="https://github.com/your-repo/simple-voting-dapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">DecentralVote</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A simple decentralized voting dApp built on Ethereum blockchain
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Built with React & Solidity</span>
              <span>•</span>
              <span>Powered by Ethereum</span>
              <span>•</span>
              <a
                href="https://basescan.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                View on BaseScan
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
