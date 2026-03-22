import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { CDN } from "@shared/constants";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => { setSent(true); toast.success("Reset link sent!"); },
    onError: (err) => toast.error(err.message || "Failed to send reset link"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotMutation.mutate({ email, origin: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={CDN.LOGO} alt="BraveMarines" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground font-sans mt-2">Enter your email to receive a reset link</p>
          </div>
          <Card className="border-border/50 shadow-xl">
            <CardContent className="p-8">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Check Your Email</h3>
                  <p className="text-muted-foreground font-sans mb-6">We've sent a password reset link to <strong>{email}</strong></p>
                  <Link href="/login"><Button variant="outline" className="font-sans">Back to Login</Button></Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-sans font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="name@example.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 font-sans" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90"
                    disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Send Reset Link
                  </Button>
                  <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground font-sans">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
