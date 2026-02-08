import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dates: "",
    groupSize: "",
    occasion: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Connect to Guesty inquiry API via edge function
      toast({
        title: "Inquiry Sent",
        description: "Thank you! We'll be in touch shortly to begin planning your stay.",
      });
      setForm({ firstName: "", lastName: "", email: "", phone: "", dates: "", groupSize: "", occasion: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-primary">
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <p className="text-xs font-sans uppercase tracking-[0.4em] mb-4 opacity-80">We'd Love to Hear from You</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light">Get in Touch</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-2xl">
          <SectionHeading
            title="Begin Your Journey"
            description="Tell us about your dream stay. We'll personally respond to arrange every detail — from dates and dining to adventures and celebrations."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="bg-card border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Phone</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-card border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Preferred Dates</label>
                <Input
                  value={form.dates}
                  onChange={(e) => setForm({ ...form, dates: e.target.value })}
                  placeholder="e.g., March 15-22, 2026"
                  className="bg-card border-border"
                />
              </div>
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Group Size</label>
                <Input
                  value={form.groupSize}
                  onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
                  placeholder="e.g., 8 adults, 2 children"
                  className="bg-card border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Occasion</label>
              <Input
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                placeholder="e.g., Wedding, Family Reunion, Retreat, Vacation"
                className="bg-card border-border"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">Message</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                placeholder="Tell us about your dream stay..."
                className="bg-card border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90"
            >
              {loading ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>

          <p className="text-xs font-sans text-muted-foreground text-center mt-8">
            All pricing is provided upon inquiry. We believe in personal conversations, not shopping carts.
          </p>
        </div>
      </section>
    </Layout>
  );
}
