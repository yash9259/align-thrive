import { Link } from "react-router-dom";

const PublicFooter = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <img src="/alignlogo.png" alt="Align logo" className="h-16 w-auto" />
            <span className="text-lg font-bold"></span>
          </div>
          <p className="text-sm text-muted-foreground">Where Brands & Creators align to grow together.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
            <Link to="/contact-us" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link>
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
