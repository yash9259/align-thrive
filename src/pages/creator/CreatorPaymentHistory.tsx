import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, CheckCircle, Clock, CreditCard, Smartphone, Wallet, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentCreatorContext,
  fetchCreatorPurchaseHistory,
  type CreatorPurchaseHistoryItem,
} from "@/lib/creator-api";

const methodIcons: Record<string, React.ReactNode> = {
  card: <CreditCard className="h-4 w-4" />,
  upi: <Smartphone className="h-4 w-4" />,
  paypal: <Wallet className="h-4 w-4" />,
};

const methodLabels: Record<string, string> = {
  card: "Card",
  upi: "UPI",
  paypal: "PayPal",
};

const CreatorPaymentHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CreatorPurchaseHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInitials, setUserInitials] = useState("CR");

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await getCurrentCreatorContext();
        if (!ctx) return;
        setUserInitials(ctx.initials);
        const data = await fetchCreatorPurchaseHistory(ctx.userId);
        setHistory(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalSpent = history.reduce((sum, h) => sum + parseFloat(h.price.replace("$", "")), 0);
  const totalChillies = history.reduce((sum, h) => sum + h.chillies, 0);

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Payment History" userInitials={userInitials}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/creator/buy-chillies")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Chillies Store
        </Button>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <Card key={n}>
                <CardContent className="p-5 text-center space-y-2">
                  <Skeleton className="h-6 w-6 mx-auto rounded-full" />
                  <Skeleton className="h-7 w-16 mx-auto" />
                  <Skeleton className="h-3 w-28 mx-auto" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-5 text-center">
                  <Flame className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-accent">{totalChillies}</p>
                  <p className="text-xs text-muted-foreground">Total Chillies Purchased</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl font-bold">{history.length}</p>
                  <p className="text-xs text-muted-foreground">Total Transactions</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No purchases yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1 mb-4">Buy Chillies to boost your visibility</p>
                <Button size="sm" onClick={() => navigate("/creator/buy-chillies")} className="gradient-primary text-primary-foreground">
                  Buy Chillies
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border/50 p-3 sm:p-4 hover:bg-muted/30 transition-colors gap-2 sm:gap-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{h.chillies} Chillies</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground">{h.date}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {methodIcons[h.method]} {methodLabels[h.method]}
                          </span>
                          <span className="text-xs text-success">{h.badge} badge</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                      <Badge variant="outline" className="text-[10px] text-success border-success/20">
                        <CheckCircle className="h-3 w-3 mr-1" /> {h.status}
                      </Badge>
                      <p className="font-semibold">{h.price}</p>
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

export default CreatorPaymentHistory;
