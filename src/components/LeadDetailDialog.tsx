import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, User, Target, TrendingUp, Phone, Mail, MapPin, Tag, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface Profile {
  id: string;
  display_name: string;
  user_id: string;
}

interface Lead {
  id: string;
  status: string;
  interest_level: string;
  source: string;
  ai_score: number;
  notes?: string;
  next_followup_date?: string;
  disqual_reason?: string;
  tags?: string[];
  created_at: string;
  assigned_rep?: string;
  properties?: {
    normalized_address: string;
    address_line_1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  contacts?: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
}

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadDetailDialog = ({ lead, open, onClose, onUpdate }: LeadDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editData, setEditData] = useState({
    assigned_rep: '',
    status: '',
    interest_level: '',
    notes: '',
    next_followup_date: '',
    tags: [] as string[]
  });
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchProfiles();
      if (lead) {
        setEditData({
          assigned_rep: lead.assigned_rep || '',
          status: lead.status,
          interest_level: lead.interest_level,
          notes: lead.notes || '',
          next_followup_date: lead.next_followup_date || '',
          tags: lead.tags || []
        });
      }
    }
  }, [open, lead]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, user_id');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const canEdit = user && (user.id === lead?.assigned_rep || !lead?.assigned_rep);

  const handleSave = async () => {
    if (!lead) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          assigned_rep: editData.assigned_rep || null,
          status: editData.status as any,
          interest_level: editData.interest_level as any,
          notes: editData.notes,
          next_followup_date: editData.next_followup_date || null,
          tags: editData.tags.length > 0 ? editData.tags : null
        })
        .eq('id', lead.id);

      if (error) throw error;

      toast.success('Lead updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const getAssignedUserName = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    return profile?.display_name || 'Unknown User';
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Lead Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              {canEdit && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Property
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium">{lead.properties?.normalized_address || 'No Address'}</p>
              {lead.properties && (
                <p className="text-sm text-muted-foreground mt-1">
                  {lead.properties.city}, {lead.properties.state} {lead.properties.zip_code}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {lead.contacts && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="font-medium">
                  {lead.contacts.first_name} {lead.contacts.last_name}
                </p>
                {lead.contacts.email && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Mail className="h-3 w-3" />
                    {lead.contacts.email}
                  </div>
                )}
                {lead.contacts.phone && (
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {lead.contacts.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lead Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lead Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Assigned Rep */}
              <div className="space-y-2">
                <Label>Assigned To</Label>
                {isEditing && canEdit ? (
                  <Select
                    value={editData.assigned_rep}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, assigned_rep: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.user_id} value={profile.user_id}>
                          {profile.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm bg-muted/30 p-2 rounded">
                    {lead.assigned_rep ? getAssignedUserName(lead.assigned_rep) : 'Unassigned'}
                  </p>
                )}
              </div>

              {/* AI Score */}
              <div className="space-y-2">
                <Label>AI Score</Label>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">{lead.ai_score}</span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                {isEditing && canEdit ? (
                  <Select
                    value={editData.status}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="disqualified">Disqualified</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={lead.status as any}>{lead.status}</StatusBadge>
                )}
              </div>

              {/* Interest Level */}
              <div className="space-y-2">
                <Label>Interest Level</Label>
                {isEditing && canEdit ? (
                  <Select
                    value={editData.interest_level}
                    onValueChange={(value) => setEditData(prev => ({ ...prev, interest_level: value }))}
                  >
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
                ) : (
                  <Badge variant="outline">{lead.interest_level}</Badge>
                )}
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label>Source</Label>
                <p className="text-sm bg-muted/30 p-2 rounded">{lead.source}</p>
              </div>

              {/* Next Follow-up */}
              <div className="space-y-2">
                <Label>Next Follow-up Date</Label>
                {isEditing && canEdit ? (
                  <Input
                    type="date"
                    value={editData.next_followup_date}
                    onChange={(e) => setEditData(prev => ({ ...prev, next_followup_date: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    {lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleDateString() : 'Not set'}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-3 w-3" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              {isEditing && canEdit ? (
                <Textarea
                  value={editData.notes}
                  onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add notes about this lead..."
                  className="min-h-[100px]"
                />
              ) : (
                <div className="bg-muted/30 p-3 rounded-lg min-h-[60px]">
                  {lead.notes || 'No notes added yet.'}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
              <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
              {lead.disqual_reason && (
                <p className="text-destructive">Disqualification Reason: {lead.disqual_reason}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};