import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, CheckCircle, Clock, CreditCard, Smartphone, Wallet, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const history = [
  { id: 1, date: "Feb 28, 2026", chillies: 100, price: "$10", method: "card", badge: "30 days", status: "completed" },
  { id: 2, date: "Feb 15, 2026", chillies: 50, price: "$8", method: "upi", badge: "15 days", status: "completed" },
  { id: 3, date: "Jan 30, 2026", chillies: 10, price: "$3", method: "paypal", badge: "1 week", status: "completed" },
  { id: 4, date: "Jan 10, 2026", chillies: 300, price: "$15", method: "card", badge: "45 days", status: "completed" },
  { id: 5, date: "Dec 20, 2025", chillies: 50, price: "$8", method: "upi", badge: "15 days", status: "completed" },
  { id: 6, date: "Dec 5, 2025", chillies: 500, price: "$22", method: "paypal", badge: "60 days", status: "completed" },
];

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

  const totalSpent = history.reduce((sum, h) => sum + parseFloat(h.price.replace("$", "")), 0);
  const totalChillies = history.reduce((sum, h) => sum + h.chillies, 0);

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Payment History" userInitials="SJ">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/creator/buy-chillies")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Chillies Store
        </Button>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
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
        </div>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatorPaymentHistory;
