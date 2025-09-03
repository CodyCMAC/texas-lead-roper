import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Star className="h-12 w-12 text-primary mr-3" />
          <h1 className="text-2xl font-bold bg-gradient-copper bg-clip-text text-transparent">
            Lead Wrangler
          </h1>
        </div>
        
        <div className="board-card p-8">
          <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
          <h3 className="text-xl font-semibold mb-4">Nothing to wrangle here</h3>
          <p className="text-muted-foreground mb-6">
            Looks like this lead got away. The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/">
            <Button className="btn-copper gap-2">
              <Home className="h-4 w-4" />
              Head Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
