import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Home, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { AddPropertyDialog } from "@/components/AddPropertyDialog";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";

interface Property {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  normalized_address: string;
  home_type?: string;
  year_built?: number;
  owner_occupancy: string;
  source: string;
  created_at: string;
  county?: string;
  latitude?: number;
  longitude?: number;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.normalized_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setDetailDialogOpen(true);
  };

  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedProperty(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property database</p>
        </div>
        <AddPropertyDialog onPropertyAdded={fetchProperties}>
          <Button className="btn-copper gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </AddPropertyDialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties by address or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card 
            key={property.id} 
            className="board-card hover:shadow-copper transition-all duration-300 cursor-pointer" 
            onClick={() => handlePropertyClick(property)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-start gap-2">
                <Home className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{property.address_line_1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.city}, {property.state} {property.zip_code}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {property.owner_occupancy}
                </Badge>
                {property.year_built && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {property.year_built}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <Badge variant="secondary">{property.source}</Badge>
                {property.home_type && (
                  <span className="text-muted-foreground">{property.home_type}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first property.'}
          </p>
          <AddPropertyDialog onPropertyAdded={fetchProperties}>
            <Button className="btn-copper gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </AddPropertyDialog>
        </div>
      )}

      <PropertyDetailDialog
        property={selectedProperty}
        open={detailDialogOpen}
        onClose={handleDetailClose}
      />
    </div>
  );
};

export default Properties;