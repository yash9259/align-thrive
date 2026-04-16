import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, User } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Reach out to us for support, partnerships, or any questions.
          </p>
        </div>

        <Card className="mx-auto mt-10 max-w-3xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Align Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Umesh Kamalkishor Agrawal</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Contact</p>
                <a href="tel:+918767994438" className="text-muted-foreground hover:text-foreground">
                  +91 87679 94438
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email ID</p>
                <div className="space-y-1">
                  <a href="mailto:align385@gmail.com" className="block text-muted-foreground hover:text-foreground">
                    align385@gmail.com
                  </a>
                  <a href="mailto:support@thealign.net" className="block text-muted-foreground hover:text-foreground">
                    support@thealign.net
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  4-5-351, kaliji tekdi road, old mondha, nanded, Maharashtra
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default Contact;
