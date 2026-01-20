import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, Wrench, Calendar, User, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { AddServiceTicketDialog } from "@/components/AddServiceTicketDialog";

interface ServiceTicket {
  id: string;
  ticket_type: string;
  priority: string;
  status: string;
  description: string;
  outcome_notes?: string;
  target_date?: string;
  created_at: string;
  properties?: {
    normalized_address: string;
  };
  contacts?: {
    first_name: string;
    last_name: string;
  };
}

const Service = () => {
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('service_tickets')
        .select(`
          *,
          properties!inner(normalized_address),
          contacts(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching service tickets:', error);
      toast.error('Failed to load service tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.properties?.normalized_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticket_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${ticket.contacts?.first_name} ${ticket.contacts?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'low': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold tracking-tight">Service Tickets</h1>
          <p className="text-muted-foreground">Track and manage service requests</p>
        </div>
        <AddServiceTicketDialog onTicketAdded={fetchTickets}>
          <Button className="btn-copper gap-2">
            <Plus className="h-4 w-4" />
            Add Service Ticket
          </Button>
        </AddServiceTicketDialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets by address, type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="board-card hover:shadow-copper transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">
                    {ticket.ticket_type}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {ticket.properties?.normalized_address || 'No Address'}
                  </p>
                  {ticket.contacts && (
                    <p className="text-xs text-muted-foreground">
                      {ticket.contacts.first_name} {ticket.contacts.last_name}
                    </p>
                  )}
                </div>
                <div className={`flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
                  {getPriorityIcon(ticket.priority)}
                  <span className="text-xs font-medium capitalize">{ticket.priority}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusBadge status={ticket.status as any}>{ticket.status}</StatusBadge>

              <p className="text-sm line-clamp-3">
                {ticket.description}
              </p>

              {ticket.target_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Target: {new Date(ticket.target_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {ticket.outcome_notes && (
                <div className="p-2 bg-muted/50 rounded text-xs">
                  <strong>Outcome:</strong> {ticket.outcome_notes}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                <Wrench className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No service tickets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first service ticket.'}
          </p>
          <AddServiceTicketDialog onTicketAdded={fetchTickets}>
            <Button className="btn-copper gap-2">
              <Plus className="h-4 w-4" />
              Add Service Ticket
            </Button>
          </AddServiceTicketDialog>
        </div>
      )}
    </div>
  );
};

export default Service;