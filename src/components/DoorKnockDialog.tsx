import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface DoorKnockDialogProps {
  children: React.ReactNode;
}

export const DoorKnockDialog = ({ children }: DoorKnockDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: 'TX',
    zip_code: '',
    result: 'no_answer',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get user's workspace - assume first workspace for now
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1);

      if (rolesError) throw rolesError;
      if (!userRoles || userRoles.length === 0) {
        throw new Error('No workspace found for user');
      }

      const workspaceId = userRoles[0].workspace_id;

      // First, create or find the property
      const { data: existingProperty, error: propertySearchError } = await supabase
        .from('properties')
        .select('id')
        .eq('address_line_1', formData.address_line_1)
        .eq('city', formData.city)
        .eq('state', formData.state)
        .eq('zip_code', formData.zip_code)
        .maybeSingle();

      if (propertySearchError) throw propertySearchError;

      let propertyId = existingProperty?.id;

      // Create property if it doesn't exist
      if (!propertyId) {
        const normalizedAddress = `${formData.address_line_1}${formData.address_line_2 ? ', ' + formData.address_line_2 : ''}, ${formData.city}, ${formData.state} ${formData.zip_code}`;
        
        // Generate address hash using the database function
        const { data: hashResult, error: hashError } = await supabase
          .rpc('generate_address_hash', {
            address_line_1: formData.address_line_1,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code
          });

        if (hashError) throw hashError;

        const { data: newProperty, error: propertyError } = await supabase
          .from('properties')
          .insert({
            address_line_1: formData.address_line_1,
            address_line_2: formData.address_line_2 || null,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            normalized_address: normalizedAddress,
            address_hash: hashResult,
            workspace_id: workspaceId,
            source: 'door_knock',
          })
          .select('id')
          .single();

        if (propertyError) throw propertyError;
        propertyId = newProperty.id;
      }

      // Create a lead for the door knock
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          property_id: propertyId,
          assigned_rep: user.id,
          status: 'new',
          interest_level: 'none',
          source: 'door_knock',
          workspace_id: workspaceId,
          notes: `Door knock result: ${formData.result}${formData.notes ? `\n\nNotes: ${formData.notes}` : ''}`,
        });

      if (leadError) throw leadError;

      // Create an update record
      const { error: updateError } = await supabase
        .from('updates')
        .insert({
          entity_type: 'lead',
          entity_id: propertyId,
          update_type: 'door_knock',
          content: `Door knock attempted at ${formData.address_line_1}, ${formData.city}, ${formData.state}. Result: ${formData.result}`,
          user_id: user.id,
          workspace_id: workspaceId,
          metadata: {
            result: formData.result,
            address: formData.address_line_1,
            notes: formData.notes,
          },
        });

      if (updateError) throw updateError;

      toast.success('Door knock logged successfully!');
      setOpen(false);
      setFormData({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: 'TX',
        zip_code: '',
        result: 'no_answer',
        notes: '',
      });
    } catch (error) {
      console.error('Error logging door knock:', error);
      toast.error('Failed to log door knock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Door Knock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address_line_1">Street Address *</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line_1: e.target.value }))}
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line_2">Apt/Unit</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line_2: e.target.value }))}
                placeholder="Apt 2B"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Fort Worth"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TX">TX</SelectItem>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="AR">AR</SelectItem>
                  <SelectItem value="LA">LA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code *</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                placeholder="76101"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Result *</Label>
            <Select value={formData.result} onValueChange={(value) => setFormData(prev => ({ ...prev, result: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_answer">No Answer</SelectItem>
                <SelectItem value="not_interested">Not Interested</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="callback_requested">Callback Requested</SelectItem>
                <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about the door knock..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-copper flex-1">
              {loading ? 'Logging...' : 'Log Door Knock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};