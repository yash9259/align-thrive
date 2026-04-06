import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorSidebar from "@/components/layout/CreatorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, CreditCard, Shield, ArrowLeft, CheckCircle, Smartphone, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentCreatorContext, purchaseCreatorChillies } from "@/lib/creator-api";

const CreatorChilliesPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const chillies = searchParams.get("chillies") || "10";
  const price = searchParams.get("price") || "$3";
  const badge = searchParams.get("badge") || "1 week";

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [creatorId, setCreatorId] = useState("");
  const [userInitials, setUserInitials] = useState("CR");

  useEffect(() => {
    const load = async () => {
      const ctx = await getCurrentCreatorContext();
      if (!ctx) return;
      setCreatorId(ctx.userId);
      setUserInitials(ctx.initials);
    };
    load();
  }, []);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    return cleaned;
  };

  const handlePayment = () => {
    if (paymentMethod === "card" && (!cardName || !cardNumber || !expiry || !cvv)) {
      toast({ title: "Missing fields", description: "Please fill all card details.", variant: "destructive" });
      return;
    }
    if (paymentMethod === "upi" && !upiId) {
      toast({ title: "Missing UPI ID", description: "Please enter your UPI ID.", variant: "destructive" });
      return;
    }
    if (paymentMethod === "paypal" && !paypalEmail) {
      toast({ title: "Missing email", description: "Please enter your PayPal email.", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setTimeout(async () => {
      try {
        await purchaseCreatorChillies(
          creatorId,
          Number(chillies),
          price,
          badge,
          paymentMethod as "card" | "upi" | "paypal"
        );
        toast({ title: "Payment Successful! 🎉", description: `${chillies} Chillies have been added to your account.` });
        navigate("/creator/buy-chillies");
      } catch {
        toast({ title: "Payment Failed", description: "Could not process payment. Please try again.", variant: "destructive" });
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <DashboardLayout sidebar={<CreatorSidebar />} title="Payment" userInitials={userInitials}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/creator/buy-chillies")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Chillies Store
        </Button>

        {/* Order Summary */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" /> Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">{chillies} Chillies</p>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-success" />
                    <span className="text-xs text-success font-medium">{badge} badge included</span>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold">{price}</p>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">$0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">{price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form with Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="card" className="gap-2 text-xs sm:text-sm">
                  <CreditCard className="h-4 w-4" /> Card
                </TabsTrigger>
                <TabsTrigger value="upi" className="gap-2 text-xs sm:text-sm">
                  <Smartphone className="h-4 w-4" /> UPI
                </TabsTrigger>
                <TabsTrigger value="paypal" className="gap-2 text-xs sm:text-sm">
                  <Wallet className="h-4 w-4" /> PayPal
                </TabsTrigger>
              </TabsList>

              {/* Card Tab */}
              <TabsContent value="card" className="space-y-4 mt-4">
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">Visa</Badge>
                  <Badge variant="outline" className="text-xs">Mastercard</Badge>
                  <Badge variant="outline" className="text-xs">Amex</Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                  </div>
                </div>
              </TabsContent>

              {/* UPI Tab */}
              <TabsContent value="upi" className="space-y-4 mt-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <Smartphone className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Pay with UPI</p>
                  <p className="text-xs text-muted-foreground mb-4">Enter your UPI ID to make a secure payment</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input id="upiId" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Example: name@oksbi, name@paytm, name@gpay</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Google Pay</Badge>
                  <Badge variant="outline" className="text-xs">PhonePe</Badge>
                  <Badge variant="outline" className="text-xs">Paytm</Badge>
                  <Badge variant="outline" className="text-xs">BHIM</Badge>
                </div>
              </TabsContent>

              {/* PayPal Tab */}
              <TabsContent value="paypal" className="space-y-4 mt-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <Wallet className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">Pay with PayPal</p>
                  <p className="text-xs text-muted-foreground mb-4">You'll be redirected to PayPal to complete your payment</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input id="paypalEmail" type="email" placeholder="you@example.com" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} />
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-2" />

            <Button onClick={handlePayment} disabled={processing} className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-lg shadow-primary/20">
              {processing ? "Processing..." : `Pay ${price}`}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Secure payment • 256-bit SSL encryption</span>
            </div>
          </CardContent>
        </Card>

        {/* Benefits reminder */}
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" /> What you'll get:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• {chillies} Chillies added to your balance</li>
              <li>• Verified badge for {badge}</li>
              <li>• Priority placement in brand searches</li>
              <li>• Higher RACK visibility score</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatorChilliesPayment;
