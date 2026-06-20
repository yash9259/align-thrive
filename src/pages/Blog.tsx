import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine, Calendar } from "lucide-react";

const blogPosts = [
  {
    title: "5 Tips for Brands to Find the Perfect Creator Match",
    excerpt: "Discover how to use RACK scores and platform filters to find creators who align with your brand values and campaign goals.",
    author: "Align Team",
    date: "January 15, 2026",
    category: "For Brands",
    readTime: "5 min read",
  },
  {
    title: "How to Boost Your Visibility Without Buying Chillies",
    excerpt: "Proven strategies to improve your ranking organically and attract more brand collaborations through quality engagement.",
    author: "Align Team",
    date: "January 10, 2026",
    category: "For Creators",
    readTime: "4 min read",
  },
  {
    title: "Understanding the RACK Score: What Brands Need to Know",
    excerpt: "A deep dive into how RACK scoring works and how to use it effectively when evaluating creator applications.",
    author: "Align Team",
    date: "January 5, 2026",
    category: "Platform Guide",
    readTime: "6 min read",
  },
  {
    title: "Case Study: How TechFlow Landed 50+ Quality Creators in One Week",
    excerpt: "Real-world success story of a brand that leveraged Align's merit-based matching to scale their creator program.",
    author: "Align Team",
    date: "December 28, 2025",
    category: "Success Stories",
    readTime: "7 min read",
  },
  {
    title: "The Future of Brand-Creator Collaborations in 2026",
    excerpt: "Industry trends, platform innovations, and what to expect from the creator economy this year.",
    author: "Align Team",
    date: "December 20, 2025",
    category: "Industry Insights",
    readTime: "8 min read",
  },
  {
    title: "How to Write Campaign Briefs That Attract Top Talent",
    excerpt: "Craft compelling campaign descriptions that get creators excited and drive high-quality submissions.",
    author: "Align Team",
    date: "December 15, 2025",
    category: "For Brands",
    readTime: "5 min read",
  },
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
              <PenLine className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-4">Align Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights, tips, and stories from the Align community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {blogPosts.map((post, i) => (
            <Card key={i} className="hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover-lift cursor-pointer group">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center rounded-t-lg">
                <div className="h-12 w-12 rounded-xl bg-card border border-border/50 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                  <PenLine className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
                  <span>By {post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default Blog;