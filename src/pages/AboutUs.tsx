import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
          <p className="text-muted-foreground">
            Learn more about Lead Wrangler and our mission
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤠 Our Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Born in the heart of Fort Worth, Texas, Lead Wrangler was created to help 
              real estate professionals manage their leads, properties, and opportunities 
              with the efficiency of a seasoned cowboy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              To provide real estate professionals with powerful, intuitive tools 
              to wrangle their leads, manage properties, and close more deals - 
              all with that Texas-sized customer service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⭐ Why Choose Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Comprehensive lead management system</li>
              <li>• Property and opportunity tracking</li>
              <li>• Service ticket management</li>
              <li>• Task organization and scheduling</li>
              <li>• Built for Texas real estate professionals</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📍 Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Fort Worth, Texas</strong><br />
              Proudly serving the Lone Star State and beyond with 
              cutting-edge real estate management solutions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}