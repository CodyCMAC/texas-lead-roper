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
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <img 
                  src="/lovable-uploads/9369e2ca-627f-4e1a-a3dd-9f7c86ba2d5f.png" 
                  alt="Cody - Lead Wrangler Developer" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <p className="text-muted-foreground leading-relaxed text-center">
                hi im Cody, do i look familiar? i build this last night (tuesday night) out of spite for jonny.... no i do not have any friends.
              </p>
            </div>
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
              eventually ill finish "CMAC Operating System"
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