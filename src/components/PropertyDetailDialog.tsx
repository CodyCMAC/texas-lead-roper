import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MapPin, Home, Calendar, Building, User, Target } from "lucide-react";

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

interface PropertyDetailDialogProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
}

export const PropertyDetailDialog = ({ property, open, onClose }: PropertyDetailDialogProps) => {
  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Property Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Address Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <p className="font-medium text-lg">{property.address_line_1}</p>
              {property.address_line_2 && (
                <p className="text-muted-foreground">{property.address_line_2}</p>
              )}
              <p className="text-muted-foreground">
                {property.city}, {property.state} {property.zip_code}
              </p>
              {property.county && (
                <p className="text-sm text-muted-foreground">
                  County: {property.county}
                </p>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Property Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Home Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Home className="h-3 w-3" />
                  Home Type
                </Label>
                <p className="text-sm bg-muted/30 p-2 rounded">
                  {property.home_type || 'Not specified'}
                </p>
              </div>

              {/* Year Built */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Year Built
                </Label>
                <p className="text-sm bg-muted/30 p-2 rounded">
                  {property.year_built || 'Unknown'}
                </p>
              </div>

              {/* Owner Occupancy */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Owner Occupancy
                </Label>
                <Badge variant="outline" className="w-fit">
                  {property.owner_occupancy}
                </Badge>
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Source
                </Label>
                <Badge variant="secondary" className="w-fit">
                  {property.source}
                </Badge>
              </div>
            </div>

            {/* Coordinates */}
            {(property.latitude && property.longitude) && (
              <div className="space-y-2">
                <Label>Coordinates</Label>
                <div className="bg-muted/30 p-3 rounded-lg text-sm">
                  <p>Latitude: {property.latitude}</p>
                  <p>Longitude: {property.longitude}</p>
                </div>
              </div>
            )}

            {/* Normalized Address */}
            <div className="space-y-2">
              <Label>Normalized Address</Label>
              <div className="bg-muted/30 p-3 rounded-lg text-sm">
                {property.normalized_address}
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              <p>Property ID: {property.id}</p>
              <p>Added: {new Date(property.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};