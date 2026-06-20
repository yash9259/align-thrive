import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Privacy Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                At Align, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our platform.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Information We Collect</h3>
                <p>
                  We collect information you provide directly, including your name, email address, profile
                  information, and any content you generate on our platform. We also collect usage data
                  such as your IP address, browser type, and pages visited.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To provide and maintain our services</li>
                  <li>To notify you about changes to our platform</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis and usage data to improve our platform</li>
                  <li>To display relevant advertisements</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Sharing</h3>
                <p>
                  We do not sell your personal data. We may share your information with service providers
                  who assist us in operating our platform, and when required by law.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal data. Contact us at{" "}
                  <a href="mailto:support@thealign.net" className="text-primary hover:underline">support@thealign.net</a>{" "}
                  for any privacy-related requests.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{" "}
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

export default PrivacyPolicy;