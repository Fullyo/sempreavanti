import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface EventInquiryFormProps {
  type: "wedding" | "event";
}

export default function EventInquiryForm({ type }: EventInquiryFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dates: "",
    guestCount: "",
    eventType: type === "wedding" ? "Wedding" : "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Connect to inquiry API
      toast({
        title: "Inquiry Sent",
        description: "Thank you! Our events team will be in touch within 24 hours.",
      });
      setForm({ name: "", email: "", phone: "", dates: "", guestCount: "", eventType: type === "wedding" ? "Wedding" : "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isWedding = type === "wedding";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
              Full Name
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="bg-card border-border focus:border-accent"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
              Estimated Guest Count
            </label>
            <Input
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              placeholder="e.g., 25 guests"
              className="bg-card border-border focus:border-accent"
            />
          </div>
        </div>

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
          {!isWedding && (
            <div>
              <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
                Type of Event
              </label>
              <Input
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                placeholder="e.g., Corporate retreat, birthday"
                className="bg-card border-border focus:border-accent"
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-2 block">
            {isWedding ? "Tell Us About Your Vision" : "Tell Us About Your Event"}
          </label>
          <Textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            placeholder={isWedding
              ? "Style, ceremony ideas, dietary needs, special requests..."
              : "Event goals, format, special requirements..."
            }
            className="bg-card border-border focus:border-accent"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-accent text-accent-foreground font-sans text-sm uppercase tracking-widest hover:bg-accent/90 rounded-full"
        >
          {loading ? "Sending..." : isWedding ? "Send Wedding Inquiry" : "Send Event Inquiry"}
        </Button>

        <p className="text-xs font-sans text-muted-foreground text-center italic">
          Our events team responds personally within 24 hours.
        </p>
      </form>
    </motion.div>
  );
}
