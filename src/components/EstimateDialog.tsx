import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Star } from "lucide-react";
import { toast } from "sonner";

interface EstimateDialogProps {
  children: React.ReactNode;
}

export const EstimateDialog = ({ children }: EstimateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Preview/Generate
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_address: '',
    customer_phone: '',
    customer_email: '',
    project_type: '',
    project_description: '',
    materials_cost: '',
    labor_cost: '',
    additional_costs: '',
    notes: '',
  });

  const calculateTotal = () => {
    const materials = parseFloat(formData.materials_cost) || 0;
    const labor = parseFloat(formData.labor_cost) || 0;
    const additional = parseFloat(formData.additional_costs) || 0;
    return materials + labor + additional;
  };

  const handleNext = () => {
    if (!formData.customer_name || !formData.project_type) {
      toast.error('Please fill in required fields');
      return;
    }
    setStep(2);
  };

  const handleGenerateEstimate = () => {
    // Here you would integrate with a PDF generation library or API
    toast.success('Estimate generated successfully!');
    setOpen(false);
    setStep(1);
    setFormData({
      customer_name: '',
      customer_address: '',
      customer_phone: '',
      customer_email: '',
      project_type: '',
      project_description: '',
      materials_cost: '',
      labor_cost: '',
      additional_costs: '',
      notes: '',
    });
  };

  const resetForm = () => {
    setStep(1);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {step === 1 ? 'Create Estimate' : 'Estimate Preview'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                      placeholder="(817) 555-0123"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_address">Address</Label>
                  <Input
                    id="customer_address"
                    value={formData.customer_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_address: e.target.value }))}
                    placeholder="123 Main St, Fort Worth, TX 76101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_email">Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type *</Label>
                  <Select value={formData.project_type} onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roofing">Roofing</SelectItem>
                      <SelectItem value="garage_door">Garage Door</SelectItem>
                      <SelectItem value="remodel">Remodel</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_description">Description</Label>
                  <Textarea
                    id="project_description"
                    value={formData.project_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, project_description: e.target.value }))}
                    placeholder="Detailed description of the work to be performed..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="materials_cost">Materials Cost</Label>
                    <Input
                      id="materials_cost"
                      type="number"
                      step="0.01"
                      value={formData.materials_cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, materials_cost: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="labor_cost">Labor Cost</Label>
                    <Input
                      id="labor_cost"
                      type="number"
                      step="0.01"
                      value={formData.labor_cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, labor_cost: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additional_costs">Additional Costs</Label>
                    <Input
                      id="additional_costs"
                      type="number"
                      step="0.01"
                      value={formData.additional_costs}
                      onChange={(e) => setFormData(prev => ({ ...prev, additional_costs: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional terms, conditions, or notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="btn-copper flex-1">
                Preview Estimate
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Estimate Preview */}
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold bg-gradient-copper bg-clip-text text-transparent">
                    Lead Wrangler
                  </h2>
                </div>
                <p className="text-muted-foreground">Professional Home Services</p>
                <Separator className="my-4" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2">Estimate For:</h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{formData.customer_name}</p>
                    {formData.customer_address && <p>{formData.customer_address}</p>}
                    {formData.customer_phone && <p>Phone: {formData.customer_phone}</p>}
                    {formData.customer_email && <p>Email: {formData.customer_email}</p>}
                  </div>
                </div>

                <Separator />

                {/* Project Details */}
                <div>
                  <h3 className="font-semibold mb-2">Project Details:</h3>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Type:</span> {formData.project_type}</p>
                    {formData.project_description && (
                      <p><span className="font-medium">Description:</span> {formData.project_description}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div>
                  <h3 className="font-semibold mb-3">Cost Breakdown:</h3>
                  <div className="space-y-2">
                    {formData.materials_cost && (
                      <div className="flex justify-between">
                        <span>Materials:</span>
                        <span>${parseFloat(formData.materials_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {formData.labor_cost && (
                      <div className="flex justify-between">
                        <span>Labor:</span>
                        <span>${parseFloat(formData.labor_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {formData.additional_costs && (
                      <div className="flex justify-between">
                        <span>Additional Costs:</span>
                        <span>${parseFloat(formData.additional_costs).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">
                        ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Additional Notes:</h3>
                      <p className="text-sm">{formData.notes}</p>
                    </div>
                  </>
                )}

                <Separator />
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>This estimate is valid for 30 days from the date of issue.</p>
                  <p className="mt-2">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back to Edit
              </Button>
              <Button onClick={handleGenerateEstimate} className="btn-copper flex-1 gap-2">
                <Download className="h-4 w-4" />
                Generate PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};