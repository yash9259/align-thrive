import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

const CookiePolicy = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Cookie className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                This Cookie Policy explains what cookies are, how Align uses them, and your choices
                regarding cookies when you use our platform.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">What Are Cookies?</h3>
                <p>
                  Cookies are small text files placed on your device that help us provide and improve
                  our services. They allow us to remember your preferences and understand how you
                  interact with our platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Types of Cookies We Use</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">Essential Cookies:</strong> Required for basic
                    platform functionality like authentication and security.
                  </li>
                  <li>
                    <strong className="text-foreground">Performance Cookies:</strong> Help us understand
                    how visitors interact with our platform through analytics.
                  </li>
                  <li>
                    <strong className="text-foreground">Functionality Cookies:</strong> Remember your
                    preferences and settings for a better experience.
                  </li>
                  <li>
                    <strong className="text-foreground">Advertising Cookies:</strong> Used to deliver
                    relevant advertisements and track ad campaign performance.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Third-Party Cookies</h3>
                <p>
                  Some cookies are placed by third-party services that appear on our pages, such as
                  analytics providers and advertising partners. We do not control these third-party cookies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Managing Your Cookies</h3>
                <p>
                  You can control and/or delete cookies as you wish. You can delete all cookies that are
                  already on your computer and you can set most browsers to prevent them from being placed.
                  However, this may cause some parts of our platform to not function properly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
                <p>
                  If you have any questions about our use of cookies, contact us at{" "}
                  <a href="mailto:support@thealign.net" className="text-primary hover:underline">support@thealign.net</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default CookiePolicy;