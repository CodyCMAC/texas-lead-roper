import { useState, useEffect } from "react";
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

interface AddOpportunityDialogProps {
  children: React.ReactNode;
  onOpportunityAdded?: () => void;
}

export const AddOpportunityDialog = ({ children, onOpportunityAdded }: AddOpportunityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    propertyId: "",
    stage: "discovery",
    opportunityType: "",
    estimatedValue: "",
    probabilityPercent: "50",
    expectedCloseDate: "",
    competitor: "",
    notes: "",
  });

  useEffect(() => {
    if (open && user) {
      fetchProperties();
    }
  }, [open, user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, normalized_address')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user's workspace
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!userRoles || userRoles.length === 0) {
        throw new Error('No workspace found');
      }

      const workspaceId = userRoles[0].workspace_id;

      const { error } = await supabase
        .from('opportunities')
        .insert({
          property_id: formData.propertyId,
          stage: formData.stage as any,
          opportunity_type: formData.opportunityType as any || null,
          estimated_value: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
          probability_percent: parseInt(formData.probabilityPercent),
          expected_close_date: formData.expectedCloseDate || null,
          competitor: formData.competitor || null,
          notes: formData.notes || null,
          workspace_id: workspaceId,
        });

      if (error) throw error;

      toast.success("Opportunity created successfully!");
      setOpen(false);
      setFormData({
        propertyId: "",
        stage: "discovery",
        opportunityType: "",
        estimatedValue: "",
        probabilityPercent: "50",
        expectedCloseDate: "",
        competitor: "",
        notes: "",
      });
      onOpportunityAdded?.();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error("Failed to create opportunity");
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
            <DialogTitle>Add New Opportunity</DialogTitle>
            <DialogDescription>
              Create a new sales opportunity for tracking.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="property">Property *</Label>
              <Select value={formData.propertyId} onValueChange={(value) => setFormData({...formData, propertyId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.normalized_address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closing">Closing</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Opportunity Type</Label>
                <Select value={formData.opportunityType} onValueChange={(value) => setFormData({...formData, opportunityType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roofing">Roofing</SelectItem>
                    <SelectItem value="garage_door">Garage Door</SelectItem>
                    <SelectItem value="remodel">Remodel</SelectItem>
                    <SelectItem value="siding">Siding</SelectItem>
                    <SelectItem value="windows">Windows</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Estimated Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                  placeholder="25000"
                  min="0"
                  step="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  value={formData.probabilityPercent}
                  onChange={(e) => setFormData({...formData, probabilityPercent: e.target.value})}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="closeDate">Expected Close Date</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitor">Competitor</Label>
                <Input
                  id="competitor"
                  value={formData.competitor}
                  onChange={(e) => setFormData({...formData, competitor: e.target.value})}
                  placeholder="ABC Roofing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about this opportunity..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-copper" disabled={loading || !formData.propertyId}>
              {loading ? "Creating..." : "Create Opportunity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};