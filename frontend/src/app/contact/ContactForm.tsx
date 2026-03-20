"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We will get back to you soon.");
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            subject: "General Inquiry",
            message: ""
        });
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-12 shadow-2xl shadow-slate-200/50">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">First Name</label>
            <Input 
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="John" 
              className="h-12 bg-slate-50 border-slate-200 rounded-xl" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Last Name</label>
            <Input 
              required
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Doe" 
              className="h-12 bg-slate-50 border-slate-200 rounded-xl" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email Address</label>
          <Input 
            required
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="john@example.com" 
            className="h-12 bg-slate-50 border-slate-200 rounded-xl" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Subject</label>
          <select 
            required
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Billing Question</option>
            <option>Partnership</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Message</label>
          <Textarea 
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="How can we help?" 
            className="min-h-[150px] bg-slate-50 border-slate-200 rounded-xl p-4" 
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full h-14 text-lg ios-button shadow-xl shadow-primary/20"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin"/> Sending...</span>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}
