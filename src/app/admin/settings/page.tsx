"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Shield, 
  User, 
  Mail, 
  Globe,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h3 className="text-2xl font-black text-slate-900">Platform Settings</h3>
        <p className="text-slate-500 font-medium">Configure global platform behavior and administrative preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <User className="h-5 w-5 text-primary" />
            <h4 className="font-bold text-slate-900">Administrator Profile</h4>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Display Name</Label>
              <Input id="admin-name" defaultValue="System Administrator" className="ios-button" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Secondary Email</Label>
              <Input id="admin-email" placeholder="backup@example.com" className="ios-button" />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="font-bold text-slate-900">Security & Access</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Enforce MFA for all Admins</p>
                <p className="text-sm text-slate-500">Require multi-factor authentication for all administrative accounts.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Session IP Binding</p>
                <p className="text-sm text-slate-500">Automatically logout users if their IP address changes during a session.</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h4 className="font-bold text-slate-900">Global Notifications</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">New Job Alerts</p>
                <p className="text-sm text-slate-500">Receive email notifications when a new job is posted for review.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Identity Verification Pings</p>
                <p className="text-sm text-slate-500">Get notified when a user submits documents for identity verification.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4">
        <Button className="ios-button h-12 px-8 gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
