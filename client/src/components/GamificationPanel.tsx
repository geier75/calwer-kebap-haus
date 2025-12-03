import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Gift, Zap } from "lucide-react";
import { toast } from "sonner";

const LEVEL_THRESHOLDS = {
  bronze: 0,
  silver: 2000, // 20€
  gold: 5000, // 50€
  platinum: 10000, // 100€
};

const LEVEL_COLORS = {
  bronze: "text-orange-400",
  silver: "text-gray-300",
  gold: "text-yellow-400",
  platinum: "text-cyan-400",
};

export default function GamificationPanel() {
  const { user, isAuthenticated } = useAuth();
  const { data: achievements } = trpc.achievements.userAchievements.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: rewards } = trpc.rewards.userRewards.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: allRewards } = trpc.rewards.list.useQuery();
  
  const redeemReward = trpc.rewards.redeem.useMutation({
    onSuccess: (data) => {
      toast.success(`Belohnung eingelöst! Code: ${data.code}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!isAuthenticated || !user) {
    return (
      <section className="py-20 px-4 bg-card/50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4 neon-green">Belohnungsprogramm</h2>
          <p className="text-foreground/70 mb-6">
            Melde dich an, um Punkte zu sammeln und exklusive Belohnungen zu erhalten!
          </p>
        </div>
      </section>
    );
  }

  const currentLevel = user.currentLevel || "bronze";
  const points = user.loyaltyPoints || 0;
  const totalSpent = user.totalSpent || 0;
  const totalOrders = user.totalOrders || 0;

  // Calculate progress to next level
  const nextLevel = currentLevel === "bronze" ? "silver" 
    : currentLevel === "silver" ? "gold" 
    : currentLevel === "gold" ? "platinum" 
    : null;
  
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : LEVEL_THRESHOLDS.platinum;
  const progress = nextLevel 
    ? ((totalSpent - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-metallic">
            BELOHNUNGSPROGRAMM
          </h2>
          <p className="text-xl text-foreground/70">
            Sammle Punkte, schalte Achievements frei und erhalte exklusive Belohnungen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Level & Progress */}
          <Card className="glass-glow lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className={`w-6 h-6 ${LEVEL_COLORS[currentLevel]}`} />
                <span className={LEVEL_COLORS[currentLevel]}>
                  {currentLevel.toUpperCase()} LEVEL
                </span>
              </CardTitle>
              <CardDescription>
                {totalOrders} Bestellungen • {(totalSpent / 100).toFixed(2)}€ ausgegeben
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextLevel && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Fortschritt zu {nextLevel.toUpperCase()}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Noch {((nextThreshold - totalSpent) / 100).toFixed(2)}€ bis zum nächsten Level
                  </p>
                </>
              )}
              {!nextLevel && (
                <p className="text-lg neon-green">
                  🎉 Du hast das maximale Level erreicht!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Points */}
          <Card className="glass-glow-orange">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 neon-orange" />
                Punkte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold neon-orange mb-2">
                {points}
              </div>
              <p className="text-sm text-muted-foreground">
                Verdiene 1 Punkt pro ausgegebenem Euro
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-6 neon-green flex items-center gap-2">
            <Zap className="w-8 h-8" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map(({ achievement, unlockedAt }) => (
              <Card key={achievement.id} className="glass-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{achievement.name}</span>
                    <Badge variant="secondary" className="bg-accent">
                      +{achievement.pointsReward} Punkte
                    </Badge>
                  </CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Freigeschaltet: {new Date(unlockedAt).toLocaleDateString("de-DE")}
                  </p>
                </CardContent>
              </Card>
            ))}
            {(!achievements || achievements.length === 0) && (
              <p className="text-muted-foreground col-span-full text-center py-8">
                Noch keine Achievements freigeschaltet. Bestelle jetzt und sammle dein erstes Achievement!
              </p>
            )}
          </div>
        </div>

        {/* Rewards */}
        <div>
          <h3 className="text-3xl font-bold mb-6 neon-orange flex items-center gap-2">
            <Gift className="w-8 h-8" />
            Belohnungen
          </h3>
          
          {/* Active Rewards */}
          {rewards && rewards.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Deine aktiven Belohnungen</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.filter(r => r.status === "active").map(({ reward, code, expiresAt }) => (
                  <Card key={code} className="glass-glow-orange">
                    <CardHeader>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="font-mono text-2xl neon-orange">{code}</div>
                        <p className="text-sm text-muted-foreground">
                          Gültig bis: {new Date(expiresAt).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available Rewards */}
          <h4 className="text-xl font-semibold mb-4">Verfügbare Belohnungen</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allRewards?.map(reward => {
              const canAfford = points >= reward.pointsCost;
              return (
                <Card key={reward.id} className={canAfford ? "glass-glow" : "glass-glow opacity-50"}>
                  <CardHeader>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Kosten:</span>
                      <Badge variant={canAfford ? "default" : "secondary"}>
                        {reward.pointsCost} Punkte
                      </Badge>
                    </div>
                    <Button
                      className="w-full btn-cyber"
                      disabled={!canAfford || redeemReward.isPending}
                      onClick={() => redeemReward.mutate({ rewardId: reward.id })}
                    >
                      {canAfford ? "Einlösen" : "Nicht genug Punkte"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
