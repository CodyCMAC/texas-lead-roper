import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, DollarSign, Calendar, Target, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { AddOpportunityDialog } from "@/components/AddOpportunityDialog";

interface Opportunity {
  id: string;
  stage: string;
  opportunity_type?: string;
  estimated_value?: number;
  probability_percent: number;
  expected_close_date?: string;
  competitor?: string;
  notes?: string;
  created_at: string;
  properties?: {
    normalized_address: string;
  };
}

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOpportunities();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          properties!inner(normalized_address)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.properties?.normalized_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.opportunity_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'discovery': return 'bg-blue-500';
      case 'proposal': return 'bg-amber-500';
      case 'negotiation': return 'bg-orange-500';
      case 'closing': return 'bg-green-500';
      case 'won': return 'bg-success';
      case 'lost': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground">Manage your sales pipeline</p>
        </div>
        <AddOpportunityDialog onOpportunityAdded={fetchOpportunities}>
          <Button className="btn-copper gap-2">
            <Plus className="h-4 w-4" />
            Add Opportunity
          </Button>
        </AddOpportunityDialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search opportunities by address, stage, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="board-card hover:shadow-copper transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {opportunity.properties?.normalized_address || 'No Address'}
                  </CardTitle>
                  {opportunity.opportunity_type && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {opportunity.opportunity_type}
                    </Badge>
                  )}
                </div>
                <div className={`w-3 h-3 rounded-full ${getStageColor(opportunity.stage)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stage: {opportunity.stage}</span>
                  <div className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    <span className="font-medium">{opportunity.probability_percent}%</span>
                  </div>
                </div>
                <Progress value={opportunity.probability_percent} className="h-2" />
              </div>

              {opportunity.estimated_value && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-primary">
                    {formatCurrency(opportunity.estimated_value)}
                  </span>
                </div>
              )}

              {opportunity.expected_close_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Expected close: {new Date(opportunity.expected_close_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {opportunity.competitor && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">vs {opportunity.competitor}</span>
                </div>
              )}

              {opportunity.notes && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {opportunity.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(opportunity.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first opportunity.'}
          </p>
          <AddOpportunityDialog onOpportunityAdded={fetchOpportunities}>
            <Button className="btn-copper gap-2">
              <Plus className="h-4 w-4" />
              Add Opportunity
            </Button>
          </AddOpportunityDialog>
        </div>
      )}
    </div>
  );
};

export default Opportunities;