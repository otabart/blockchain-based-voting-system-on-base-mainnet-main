import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Vote, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Candidate } from "@/hooks/useVotingContract";

interface VotingInterfaceProps {
  candidates: Candidate[];
  hasVoted: boolean;
  isLoading: boolean;
  isConnected: boolean;
  totalVotes: number;
  onVote: (candidateId: number) => void;
}

const VotingInterface = ({
  candidates,
  hasVoted,
  isLoading,
  isConnected,
  totalVotes,
  onVote,
}: VotingInterfaceProps) => {
  const getVotePercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const getLeadingCandidate = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) => 
      prev.voteCount > current.voteCount ? prev : current
    );
  };

  const leadingCandidate = getLeadingCandidate();

  return (
    <div className="space-y-6">
      {/* Voting Stats */}
      <Card className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalVotes}</p>
            <p className="text-sm text-muted-foreground">Total Votes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-2">
              <Vote className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{candidates.length}</p>
            <p className="text-sm text-muted-foreground">Candidates</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {leadingCandidate ? leadingCandidate.name : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">Leading</p>
          </div>
        </div>
      </Card>

      {/* Candidates */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Vote className="h-6 w-6 text-primary" />
          Cast Your Vote
        </h2>
        
        {candidates.map((candidate) => {
          const percentage = getVotePercentage(candidate.voteCount);
          const isLeading = leadingCandidate?.id === candidate.id && totalVotes > 0;
          
          return (
            <Card
              key={candidate.id}
              className={`card-gradient p-6 transition-all duration-300 hover:shadow-lg ${
                isLeading ? 'ring-2 ring-primary/30 animate-pulse-glow' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isLeading ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {candidate.name.charAt(candidate.name.length - 1)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {candidate.name}
                      {isLeading && <Badge variant="default" className="text-xs">Leading</Badge>}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {candidate.voteCount} votes ({percentage}%)
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => onVote(candidate.id)}
                  disabled={!isConnected || hasVoted || isLoading}
                  variant={hasVoted ? "outline" : "default"}
                  className={`min-w-[100px] ${
                    !hasVoted ? 'blockchain-gradient hover:opacity-90' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Voting...
                    </div>
                  ) : hasVoted ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Voted
                    </div>
                  ) : !isConnected ? (
                    "Connect Wallet"
                  ) : (
                    <div className="flex items-center gap-2">
                      <Vote className="h-4 w-4" />
                      Vote
                    </div>
                  )}
                </Button>
              </div>
              
              {/* Vote Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vote Progress</span>
                  <span className="font-medium text-foreground">{percentage}%</span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Voting Status */}
      {hasVoted && (
        <Card className="glass-card p-4 border-accent/20">
          <div className="flex items-center gap-3 text-accent">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Thank you for voting!</p>
              <p className="text-sm text-muted-foreground">
                Your vote has been recorded on the blockchain
              </p>
            </div>
          </div>
        </Card>
      )}

      {!isConnected && (
        <Card className="glass-card p-4 border-primary/20">
          <div className="flex items-center gap-3 text-primary">
            <Vote className="h-5 w-5" />
            <div>
              <p className="font-medium">Connect your wallet to vote</p>
              <p className="text-sm text-muted-foreground">
                You need to connect your MetaMask wallet to participate in the voting
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VotingInterface;