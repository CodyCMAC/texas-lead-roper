import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Target, Calendar, User, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { AddLeadDialog } from "@/components/AddLeadDialog";
import { LeadDetailDialog } from "@/components/LeadDetailDialog";

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

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeads();
      fetchProfiles();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          properties!inner(normalized_address, address_line_1, city, state, zip_code),
          contacts(first_name, last_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

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

  const filteredLeads = leads.filter(lead =>
    lead.properties?.normalized_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${lead.contacts?.first_name} ${lead.contacts?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  const getAssignedUserName = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    return profile?.display_name || 'Unknown User';
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailDialogOpen(true);
  };

  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedLead(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Track and manage your sales leads</p>
        </div>
        <AddLeadDialog onLeadAdded={fetchLeads}>
          <Button className="btn-copper gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </AddLeadDialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads by address, contact, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card 
            key={lead.id} 
            className="board-card hover:shadow-copper transition-all duration-300 cursor-pointer" 
            onClick={() => handleLeadClick(lead)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {lead.properties?.normalized_address || 'No Address'}
                  </CardTitle>
                  {lead.contacts && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {lead.contacts.first_name} {lead.contacts.last_name}
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-1 ${getScoreColor(lead.ai_score)}`}>
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{lead.ai_score}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={lead.status as any}>{lead.status}</StatusBadge>
                <Badge variant="outline" className="text-xs">
                  {lead.interest_level}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Source: {lead.source}</span>
              </div>

              {lead.next_followup_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Follow-up: {new Date(lead.next_followup_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lead.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {lead.notes && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {lead.notes}
                </p>
              )}

              {lead.assigned_rep && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Assigned: {getAssignedUserName(lead.assigned_rep)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                {lead.disqual_reason && (
                  <Badge variant="destructive" className="text-xs">
                    Disqualified
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No leads found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first lead.'}
          </p>
          <AddLeadDialog onLeadAdded={fetchLeads}>
            <Button className="btn-copper gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </AddLeadDialog>
        </div>
      )}

      <LeadDetailDialog
        lead={selectedLead}
        open={detailDialogOpen}
        onClose={handleDetailClose}
        onUpdate={fetchLeads}
      />
    </div>
  );
};

export default Leads;