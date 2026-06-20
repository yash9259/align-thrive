import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                By accessing or using the Align platform, you agree to be bound by these Terms of Service
                and all applicable laws and regulations.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Use of Service</h3>
                <p>
                  Align provides a platform connecting brands with creators for collaborative campaigns.
                  You agree to use our service only for lawful purposes and in accordance with these Terms.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">User Accounts</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must be at least 18 years old to use our platform</li>
                  <li>One person or business may not maintain more than one free account</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Brand Guidelines</h3>
                <p>
                  Brands agree to post only legitimate campaigns with accurate descriptions, fair
                  compensation, and clear deliverables. Brands must honor accepted proposals and payments.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Creator Guidelines</h3>
                <p>
                  Creators agree to submit genuine proposals, deliver quality work on time, and maintain
                  professional communication. Misrepresentation of skills or metrics is prohibited.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Chillies & Payments</h3>
                <p>
                  Chillies are a priority boost feature — they do not guarantee placement or outcomes.
                  All payments between brands and creators are processed through our platform unless
                  otherwise agreed.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                <p>
                  Align is not responsible for the quality, legality, or safety of work performed between
                  brands and creators. Users are encouraged to use RACK scores and reviews to make informed
                  decisions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
                <p>
                  For questions about these Terms, contact us at{" "}
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

export default TermsOfService;