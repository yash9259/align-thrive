import { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [tab, setTab] = useState("creator");

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-lg border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Join Align</CardTitle>
            <p className="text-sm text-muted-foreground">Create your account and start collaborating</p>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="creator">🎥 Creator</TabsTrigger>
                <TabsTrigger value="brand">🧑‍💼 Brand</TabsTrigger>
              </TabsList>

              <TabsContent value="creator" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input defaultValue="Sarah" /></div>
                  <div><Label>Last Name</Label><Input defaultValue="Johnson" /></div>
                </div>
                <div><Label>Email</Label><Input type="email" defaultValue="sarah@creator.com" /></div>
                <div><Label>Phone</Label><Input type="tel" defaultValue="+1 (555) 123-4567" /></div>
                <div>
                  <Label>Category / Niche</Label>
                  <Select defaultValue="lifestyle">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-success/10 p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">Free applications are auto-approved. Chillies are optional and give you priority & verification badges.</p>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground">Create Creator Account</Button>
              </TabsContent>

              <TabsContent value="brand" className="space-y-4">
                <div><Label>Company Name</Label><Input defaultValue="TechFlow Inc." /></div>
                <div><Label>Business Email</Label><Input type="email" defaultValue="hello@techflow.com" /></div>
                <div><Label>Phone</Label><Input type="tel" defaultValue="+1 (555) 987-6543" /></div>
                <div>
                  <Label>Industry</Label>
                  <Select defaultValue="technology">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">Brand accounts are reviewed within 24 hours. You'll get access to our full creator network once approved.</p>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground">Create Brand Account</Button>
              </TabsContent>
            </Tabs>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
