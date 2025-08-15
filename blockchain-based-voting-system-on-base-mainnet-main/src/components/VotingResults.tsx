import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Trophy, Users } from "lucide-react";
import { Candidate } from "@/hooks/useVotingContract";

interface VotingResultsProps {
  candidates: Candidate[];
  totalVotes: number;
  isLive?: boolean;
}

const VotingResults = ({ candidates, totalVotes, isLive = true }: VotingResultsProps) => {
  // Chart colors matching our design system
  const COLORS = [
    'hsl(217 91% 60%)', // Primary blue
    'hsl(175 60% 45%)', // Secondary teal
    'hsl(142 71% 45%)', // Accent green
    'hsl(38 92% 50%)',  // Warning yellow
    'hsl(280 60% 50%)', // Purple
  ];

  // Prepare data for charts
  const chartData = candidates.map((candidate, index) => ({
    name: candidate.name,
    votes: candidate.voteCount,
    percentage: totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0,
    color: COLORS[index % COLORS.length],
  }));

  // Sort candidates by vote count for rankings
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>;
      case 2:
        return <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold">{index + 1}</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Voting Results
        </h2>
        {isLive && (
          <Badge variant="default" className="bg-accent text-accent-foreground animate-pulse">
            Live Results
          </Badge>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalVotes}</p>
              <p className="text-sm text-muted-foreground">Total Votes Cast</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-lg font-bold text-foreground">
                {sortedCandidates[0]?.name || "No votes yet"}
              </p>
              <p className="text-sm text-muted-foreground">Current Leader</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {sortedCandidates[0] && totalVotes > 0 
                  ? Math.round((sortedCandidates[0].voteCount / totalVotes) * 100) 
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Leading Margin</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vote Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))',
                  }}
                  formatter={(value, name) => [value, 'Votes']}
                />
                <Bar 
                  dataKey="votes" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="card-gradient p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vote Share</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percentage}) => percentage > 0 ? `${name}: ${percentage}%` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))',
                  }}
                  formatter={(value, name) => [value, 'Votes']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Rankings */}
      <Card className="card-gradient p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Candidate Rankings</h3>
        <div className="space-y-4">
          {sortedCandidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
            
            return (
              <div
                key={candidate.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  index === 0 
                    ? 'bg-primary/10 border-primary/30 animate-pulse-glow' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  {getRankIcon(index)}
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {candidate.name}
                      {index === 0 && totalVotes > 0 && (
                        <Badge variant="default" className="text-xs bg-yellow-500 text-yellow-50">
                          Winner
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Position #{index + 1}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    {candidate.voteCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {percentage}% of votes
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {totalVotes === 0 && (
        <Card className="glass-card p-6 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No votes yet</h3>
          <p className="text-muted-foreground">
            Be the first to cast your vote and see the results here!
          </p>
        </Card>
      )}
    </div>
  );
};

export default VotingResults;