import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { CDN } from "@shared/constants";
import { Link, useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => { setDone(true); toast.success("Password reset successfully!"); },
    onError: (err) => toast.error(err.message || "Failed to reset password"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    resetMutation.mutate({ token, password });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={CDN.LOGO} alt="BraveMarines" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">New Password</h1>
          </div>
          <Card className="border-border/50 shadow-xl">
            <CardContent className="p-8">
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-gold-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Password Updated!</h3>
                  <p className="text-muted-foreground font-sans mb-6">You can now sign in with your new password.</p>
                  <Link href="/login"><Button className="gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90">Sign In</Button></Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-sans font-medium">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="Min 6 characters" value={password}
                        onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 font-sans" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="Confirm password" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12 font-sans" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90"
                    disabled={resetMutation.isPending}>
                    {resetMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Reset Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
