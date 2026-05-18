import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, DollarSign, ArrowUpRight, ArrowDownRight, Clock, Building2, Smartphone } from "lucide-react";
import {
  getCurrentCreatorContext,
  fetchCreatorWalletData,
  requestWithdrawal,
  type CreatorWalletData,
} from "@/lib/creator-api";
import { useToast } from "@/hooks/use-toast";

const CreatorWallet = () => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<CreatorWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInitials, setUserInitials] = useState("CR");
  const [creatorId, setCreatorId] = useState("");
  
  // Withdrawal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [withdrawDetails, setWithdrawDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    try {
      const ctx = await getCurrentCreatorContext();
      if (!ctx) return;
      setUserInitials(ctx.initials);
      setCreatorId(ctx.userId);
      const data = await fetchCreatorWalletData(ctx.userId);
      setWallet(data);
    } catch (err) {
      console.error("Wallet Load Error:", err);
      toast({ title: "Error", description: err instanceof Error ? err.message : JSON.stringify(err), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleWithdrawal = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount < 100) {
      toast({ title: "Invalid Amount", description: "Minimum withdrawal is $100.", variant: "destructive" });
      return;
    }
    
    if (wallet && amount > wallet.availableBalance) {
      toast({ title: "Insufficient Funds", description: "You cannot withdraw more than your available balance.", variant: "destructive" });
      return;
    }

    if (!withdrawDetails.trim()) {
      toast({ title: "Details Required", description: "Please provide account details for the withdrawal.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await requestWithdrawal(creatorId, amount, withdrawMethod, withdrawDetails);
      toast({ title: "Withdrawal Requested", description: "Your funds will be transferred shortly." });
      setIsWithdrawOpen(false);
      setWithdrawAmount("");
      setWithdrawDetails("");
      await load(); // Reload wallet to update balances
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process withdrawal.";
      toast({ title: "Withdrawal Failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Wallet" userInitials={userInitials}>
      <div className="space-y-6">
        {/* Top Balances */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">Available</Badge>
              </div>
              <p className="text-3xl font-bold font-display tracking-tight">
                ${isLoading ? "..." : (wallet?.availableBalance ?? 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Ready to withdraw</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <Badge variant="outline">Lifetime</Badge>
              </div>
              <p className="text-3xl font-bold font-display tracking-tight">
                ${isLoading ? "..." : (wallet?.totalEarnings ?? 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                </div>
                <Badge variant="outline">Withdrawn</Badge>
              </div>
              <p className="text-3xl font-bold font-display tracking-tight">
                ${isLoading ? "..." : (wallet?.totalWithdrawn ?? 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Successfully cashed out</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Withdraw Funds</h3>
              <p className="text-sm text-muted-foreground">Minimum withdrawal amount is $100.</p>
            </div>
            
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full sm:w-auto gradient-primary text-primary-foreground shadow-lg"
                  disabled={isLoading || !wallet || wallet.availableBalance < 100}
                >
                  Request Withdrawal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Available Balance: <span className="font-bold text-foreground">${wallet?.availableBalance.toFixed(2)}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Amount (USD)</Label>
                    <Input 
                      type="number" 
                      placeholder="Min $100" 
                      min="100" 
                      max={wallet?.availableBalance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Withdrawal Method</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Details</Label>
                    <Input 
                      placeholder={withdrawMethod === "bank" ? "Account Number & Routing" : withdrawMethod === "paypal" ? "PayPal Email" : "UPI ID"} 
                      value={withdrawDetails}
                      onChange={(e) => setWithdrawDetails(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsWithdrawOpen(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button onClick={handleWithdrawal} disabled={isSubmitting} className="gradient-primary">
                    {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : wallet?.recentTransactions.length === 0 ? (
              <div className="py-10 text-center">
                <Wallet className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">Complete campaigns to earn funds.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wallet?.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border/50 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        tx.type === "earning" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                      }`}>
                        {tx.type === "earning" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {tx.type === "earning" ? "Payment Received" : "Funds Withdrawn"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {tx.date}
                          </span>
                          <Badge variant="outline" className={`text-[10px] ${
                            tx.status === "completed" ? "text-success border-success/30" : "text-warning border-warning/30"
                          }`}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === "earning" ? "text-success" : ""}`}>
                      {tx.type === "earning" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatorWallet;
