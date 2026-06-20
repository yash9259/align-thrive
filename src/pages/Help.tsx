import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageCircle, Mail, BookOpen } from "lucide-react";

const Help = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions and get the support you need.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-12">
          {[
            {
              icon: BookOpen,
              title: "Getting Started",
              items: [
                "How to create an account as a brand",
                "How to create an account as a creator",
                "Understanding your dashboard",
                "Setting up your profile",
              ],
            },
            {
              icon: MessageCircle,
              title: "Campaigns",
              items: [
                "How to post a campaign",
                "How to submit a proposal",
                "Understanding RACK scores",
                "Managing campaign submissions",
              ],
            },
            {
              icon: Mail,
              title: "Chillies & Payments",
              items: [
                "What are Chillies?",
                "How to earn or buy Chillies",
                "Payment processing timeline",
                "Dispute resolution",
              ],
            },
            {
              icon: HelpCircle,
              title: "Account & Settings",
              items: [
                "How to reset your password",
                "Updating your profile information",
                "Notification preferences",
                "Privacy and security settings",
              ],
            },
          ].map((category) => (
            <Card key={category.title} className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-xl">Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="mailto:support@thealign.net"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Mail className="h-4 w-4" />
              Contact Support at support@thealign.net
            </a>
          </CardContent>
        </Card>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default Help;