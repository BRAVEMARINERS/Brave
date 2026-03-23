import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 shadow-2xl shadow-navy-950/5 border-border/50 rounded-3xl overflow-hidden">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-800 flex items-center justify-center glow-gold-sm">
              <AlertCircle className="h-12 w-12 text-gold-400" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-foreground mb-2 font-sans">404</h1>

          <h2 className="text-xl font-bold text-foreground mb-4 font-sans">
            الصفحة غير موجودة
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed font-sans">
            عذراً، الصفحة التي تبحث عنها غير موجودة.
            <br />
            ربما تم نقلها أو حذفها.
          </p>

          <Button
            onClick={() => setLocation("/")}
            className="gold-gradient text-navy-950 font-bold font-sans hover:opacity-90 rounded-xl glow-gold-sm px-8 h-12"
          >
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
