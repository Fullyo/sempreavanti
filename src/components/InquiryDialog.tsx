import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const activityOptions = [
  "Surfing",
  "Boat Tours & Fishing",
  "Sailing",
  "Golf",
  "Snorkeling & Diving",
  "Whale Watching",
  "ATV & Off-Road",
  "Zipline & Canopy",
  "Horseback Riding",
  "Yoga & Wellness",
  "Massage & Spa",
  "Private Chef",
  "Cultural Tours",
  "Wedding / Event",
  "Airport Transportation",
];

interface InquiryDialogProps {
  children: React.ReactNode;
}

export default function InquiryDialog({ children }: InquiryDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dates: "",
    groupSize: "",
    message: "",
  });
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("guesty-inquiry", {
        body: { ...form, selectedActivities },
      });

      if (error) throw error;

      toast({
        title: "Inquiry Sent",
        description: "Thank you! We'll be in touch shortly to begin planning your stay.",
      });
      setForm({ firstName: "", lastName: "", email: "", phone: "", dates: "", groupSize: "", message: "" });
      setSelectedActivities([]);
      setOpen(false);
    } catch (err) {
      console.error("Inquiry submission error:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 border-none bg-background rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="bg-primary px-8 pt-10 pb-8">
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-primary-foreground/60 mb-2">
              Begin Your Journey
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-primary-foreground">
              Tell Us About Your Stay
            </h2>
            <p className="text-sm font-sans text-primary-foreground/70 mt-2 leading-relaxed">
              Share your dates and interests — we'll personally curate every detail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                  First Name
                </label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="bg-card border-border focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                  Last Name
                </label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="bg-card border-border focus:border-accent"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-card border-border focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-card border-border focus:border-accent"
                />
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                  Preferred Dates
                </label>
                <Input
                  value={form.dates}
                  onChange={(e) => setForm({ ...form, dates: e.target.value })}
                  placeholder="e.g., March 15–22, 2026"
                  className="bg-card border-border focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                  Group Size
                </label>
                <Input
                  value={form.groupSize}
                  onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
                  placeholder="e.g., 8 adults, 2 children"
                  className="bg-card border-border focus:border-accent"
                />
              </div>
            </div>

            {/* Activity Interests */}
            <div>
              <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3 block">
                Activities You're Interested In
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                {activityOptions.map((activity) => (
                  <label
                    key={activity}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedActivities.includes(activity)}
                      onCheckedChange={() => toggleActivity(activity)}
                      className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <span className="text-sm font-sans text-foreground group-hover:text-accent transition-colors">
                      {activity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                Tell Us More
              </label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder="Special occasions, dietary needs, anything you'd like us to know..."
                className="bg-card border-border focus:border-accent"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 rounded-full"
            >
              {loading ? "Sending..." : "Send Inquiry"}
            </Button>

            <p className="text-xs font-sans text-muted-foreground text-center italic">
              We respond personally within 24 hours.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
