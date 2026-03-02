import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, CheckCircle, Shield, Star, Zap } from "lucide-react";

const packages = [
  { chillies: 10, price: "$3", badge: "1 week", popular: false },
  { chillies: 50, price: "$8", badge: "15 days", popular: false },
  { chillies: 100, price: "$10", badge: "30 days", popular: true },
  { chillies: 300, price: "$15", badge: "45 days", popular: false },
  { chillies: 500, price: "$22", badge: "60 days", popular: false },
];

const CreatorBuyChillies = () => {
  const navigate = useNavigate();

  const handleBuyNow = (p: typeof packages[0]) => {
    navigate(`/creator/buy-chillies/payment?chillies=${p.chillies}&price=${encodeURIComponent(p.price)}&badge=${encodeURIComponent(p.badge)}`);
  };

  return (
  <DashboardLayout sidebar={<CreatorSidebar />} title="Buy Chillies" userInitials="SJ">
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 hover:bg-accent/10">🌶️ Chillies Store</Badge>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Boost Your Priority</h2>
        <p className="text-muted-foreground">Buy Chillies to get verified badges, priority placement, and higher chances of landing campaigns.</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
          <Flame className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Your Balance: <span className="text-accent font-bold">245 Chillies</span></span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-5xl mx-auto">
        {packages.map((p) => (
          <Card key={p.chillies} className={`relative hover:shadow-lg transition-all ${p.popular ? 'border-primary shadow-lg scale-105' : 'border-border/50'}`}>
            {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="gradient-primary text-primary-foreground">Best Value</Badge></div>}
            <CardContent className="p-5 text-center">
              <div className="mb-3">
                <Flame className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-3xl font-bold text-accent">{p.chillies}</p>
                <p className="text-xs text-muted-foreground">Chillies</p>
              </div>
              <p className="text-2xl font-bold mb-1">{p.price}</p>
              <div className="flex items-center justify-center gap-1 mb-4">
                <Shield className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">{p.badge} badge</span>
              </div>
              <Button onClick={() => handleBuyNow(p)} className={`w-full ${p.popular ? 'gradient-primary text-primary-foreground' : ''}`} variant={p.popular ? 'default' : 'outline'} size="sm">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Table */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader><CardTitle className="text-base">Chillies Benefits Comparison</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[320px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium text-xs sm:text-sm">Benefit</th>
                <th className="pb-3 font-medium text-center text-xs sm:text-sm">Free</th>
                <th className="pb-3 font-medium text-center text-xs sm:text-sm">With Chillies</th>
              </tr>
            </thead>
            <tbody>
              {[
                { benefit: "Apply to campaigns", free: true, chillies: true },
                { benefit: "Verification badge", free: false, chillies: true },
                { benefit: "Priority in search", free: false, chillies: true },
                { benefit: "Priority bid placement", free: false, chillies: true },
                { benefit: "Higher RACK visibility", free: false, chillies: true },
                { benefit: "Brand inbox priority", free: false, chillies: true },
              ].map((r) => (
                <tr key={r.benefit} className="border-b border-border/50 last:border-0">
                  <td className="py-3">{r.benefit}</td>
                  <td className="py-3 text-center">{r.free ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-3 text-center"><CheckCircle className="h-4 w-4 text-success mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </CardContent>
      </Card>

      {/* Free Chillies */}
      <Card className="max-w-4xl mx-auto border-success/20 bg-gradient-to-r from-success/5 to-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Zap className="h-5 w-5 text-success" />Earn Free Chillies!</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-card p-4 border border-border/50">
              <p className="font-semibold mb-1">📸 Upload an Image Post</p>
              <p className="text-sm text-muted-foreground">Post about Align → <span className="font-bold text-accent">10 Chillies + 15-day badge</span></p>
              <Button variant="outline" size="sm" className="mt-3">Upload Image Post</Button>
            </div>
            <div className="rounded-lg bg-card p-4 border border-border/50">
              <p className="font-semibold mb-1">🎬 Upload a Reel/Video</p>
              <p className="text-sm text-muted-foreground">Create a video about Align → <span className="font-bold text-accent">50 Chillies + 50-day badge</span></p>
              <Button variant="outline" size="sm" className="mt-3">Upload Video/Reel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
  );
};

export default CreatorBuyChillies;
