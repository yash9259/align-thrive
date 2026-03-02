import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const PublicFooter = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Flame className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Align</span>
          </div>
          <p className="text-sm text-muted-foreground">Where Brands & Creators align to grow together. Powered by the Chillies 🌶️ priority system.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">Join as Brand</Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">Join as Creator</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Resources</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Help Center</span>
            <span className="text-sm text-muted-foreground">Blog</span>
            <span className="text-sm text-muted-foreground">API Docs</span>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
            <span className="text-sm text-muted-foreground">Cookie Policy</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 Align. All rights reserved.
      </div>
    </div>
  </footer>
);

export default PublicFooter;
