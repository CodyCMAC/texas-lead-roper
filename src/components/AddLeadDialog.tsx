import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

interface AddLeadDialogProps {
  children: React.ReactNode;
  onLeadAdded?: () => void;
}

export const AddLeadDialog = ({ children, onLeadAdded }: AddLeadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    address: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    source: "door_knock",
    interestLevel: "none",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // First get user's workspace
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!userRoles || userRoles.length === 0) {
        throw new Error('No workspace found');
      }

      const workspaceId = userRoles[0].workspace_id;

      // Create property first
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          address_line_1: formData.address,
          city: "Fort Worth",
          state: "TX",
          zip_code: "76000",
          normalized_address: formData.address,
          address_hash: formData.address.toLowerCase().replace(/\s+/g, ''),
          workspace_id: workspaceId,
          source: formData.source,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Create contact if provided
      let contactId = null;
      if (formData.contactFirstName && formData.contactLastName) {
        const { data: contact, error: contactError } = await supabase
          .from('contacts')
          .insert({
            first_name: formData.contactFirstName,
            last_name: formData.contactLastName,
            email: formData.contactEmail || null,
            phone: formData.contactPhone || null,
            workspace_id: workspaceId,
            property_id: property.id,
          })
          .select()
          .single();

        if (contactError) throw contactError;
        contactId = contact.id;
      }

      // Create lead
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          property_id: property.id,
          contact_id: contactId,
          assigned_rep: user.id,
          status: 'new',
          interest_level: formData.interestLevel as any,
          source: formData.source,
          notes: formData.notes || null,
          workspace_id: workspaceId,
        });

      if (leadError) throw leadError;

      toast.success("Lead created successfully!");
      setOpen(false);
      setFormData({
        address: "",
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        source: "door_knock",
        interestLevel: "none",
        notes: "",
      });
      onLeadAdded?.();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Create a new lead for tracking your sales opportunities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="1234 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Contact First Name</Label>
                <Input
                  id="firstName"
                  value={formData.contactFirstName}
                  onChange={(e) => setFormData({...formData, contactFirstName: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Contact Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.contactLastName}
                  onChange={(e) => setFormData({...formData, contactLastName: e.target.value})}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="door_knock">Door Knock</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest">Interest Level</Label>
                <Select value={formData.interestLevel} onValueChange={(value) => setFormData({...formData, interestLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about this lead..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-copper" disabled={loading}>
              {loading ? "Creating..." : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};