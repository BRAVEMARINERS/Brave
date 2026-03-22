import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  User, FileText, Upload, Shield, Bell, Briefcase, Building2,
  Loader2, CheckCircle2, Clock, XCircle, Camera, Trash2, Ship,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ tab?: string }>();
  const activeTab = params.tab || "profile";

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [loading, isAuthenticated, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-sans mt-1">Manage your profile and applications</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => navigate(`/dashboard/${v}`)}>
          <TabsList className="mb-8 bg-secondary/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="profile" className="font-sans gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
            <TabsTrigger value="documents" className="font-sans gap-2"><FileText className="h-4 w-4" /> Documents</TabsTrigger>
            <TabsTrigger value="applications" className="font-sans gap-2"><Briefcase className="h-4 w-4" /> Applications</TabsTrigger>
            <TabsTrigger value="verification" className="font-sans gap-2"><Shield className="h-4 w-4" /> Verification</TabsTrigger>
            <TabsTrigger value="notifications" className="font-sans gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileTab /></TabsContent>
          <TabsContent value="documents"><DocumentsTab /></TabsContent>
          <TabsContent value="applications"><ApplicationsTab /></TabsContent>
          <TabsContent value="verification"><VerificationTab /></TabsContent>
          <TabsContent value="notifications"><NotificationsTab /></TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

function ProfileTab() {
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const { data: ranks } = trpc.lookups.ranks.useQuery();
  const { data: countries } = trpc.lookups.countries.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState<Record<string, any>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (profile?.seafarer && !initialized) {
      setForm({
        firstNameEn: profile.seafarer.firstNameEn || "",
        lastNameEn: profile.seafarer.lastNameEn || "",
        phone: profile.seafarer.phone || "",
        rankId: profile.seafarer.rankId?.toString() || "",
        countryId: profile.seafarer.countryId?.toString() || "",
        experienceMonths: profile.seafarer.experienceMonths?.toString() || "",
        availabilityStatus: profile.seafarer.availabilityStatus || "available",
        bio: profile.seafarer.bio || "",
      });
      setInitialized(true);
    }
  }, [profile, initialized]);

  const updateMutation = trpc.profile.updateSeafarer.useMutation({
    onSuccess: () => { toast.success("Profile updated!"); utils.profile.get.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    updateMutation.mutate({
      firstNameEn: form.firstNameEn || undefined,
      lastNameEn: form.lastNameEn || undefined,
      phone: form.phone || undefined,
      rankId: form.rankId ? parseInt(form.rankId) : undefined,
      countryId: form.countryId ? parseInt(form.countryId) : undefined,
      experienceMonths: form.experienceMonths ? parseInt(form.experienceMonths) : undefined,
      availabilityStatus: form.availabilityStatus as any || undefined,
      bio: form.bio || undefined,
    });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Avatar Card */}
      <Card className="border-border/50">
        <CardContent className="p-6 text-center">
          <div className="w-32 h-32 rounded-full bg-navy-950/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {profile?.user?.avatarUrl ? (
              <img src={profile.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-navy-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground font-sans">{profile?.user?.name || "User"}</h3>
          <p className="text-sm text-muted-foreground font-sans">{profile?.user?.email}</p>
          <div className="mt-3 flex justify-center gap-2">
            {profile?.user?.isVerified && (
              <Badge className="bg-gold-400/10 text-gold-600 border-gold-400/30">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
              </Badge>
            )}
            <Badge variant="outline" className="font-sans capitalize">{profile?.user?.accountType || "seafarer"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="lg:col-span-2 border-border/50">
        <CardHeader>
          <CardTitle className="font-sans">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans">First Name</Label>
              <Input value={form.firstNameEn || ""} onChange={(e) => setForm({ ...form, firstNameEn: e.target.value })} className="h-11 font-sans" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Last Name</Label>
              <Input value={form.lastNameEn || ""} onChange={(e) => setForm({ ...form, lastNameEn: e.target.value })} className="h-11 font-sans" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans">Phone</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 font-sans" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Rank</Label>
              <Select value={form.rankId || ""} onValueChange={(v) => setForm({ ...form, rankId: v })}>
                <SelectTrigger className="h-11 font-sans"><SelectValue placeholder="Select rank" /></SelectTrigger>
                <SelectContent>
                  {ranks?.map((r) => <SelectItem key={r.id} value={r.id.toString()} className="font-sans">{r.nameEn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans">Country</Label>
              <Select value={form.countryId || ""} onValueChange={(v) => setForm({ ...form, countryId: v })}>
                <SelectTrigger className="h-11 font-sans"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries?.map((c) => <SelectItem key={c.id} value={c.id.toString()} className="font-sans">{c.nameEn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Experience (months)</Label>
              <Input type="number" value={form.experienceMonths || ""} onChange={(e) => setForm({ ...form, experienceMonths: e.target.value })} className="h-11 font-sans" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-sans">Availability Status</Label>
            <Select value={form.availabilityStatus || "available"} onValueChange={(v) => setForm({ ...form, availabilityStatus: v })}>
              <SelectTrigger className="h-11 font-sans"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available" className="font-sans">Available</SelectItem>
                <SelectItem value="onboard" className="font-sans">On Board</SelectItem>
                <SelectItem value="unavailable" className="font-sans">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-sans">Bio</Label>
            <Textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="font-sans min-h-[100px]" placeholder="Tell us about your maritime experience..." />
          </div>
          <Button onClick={handleSave} className="gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentsTab() {
  const { data: docs, isLoading } = trpc.profile.getDocuments.useQuery();
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.profile.uploadFile.useMutation({
    onSuccess: () => { toast.success("Document uploaded!"); utils.profile.getDocuments.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.profile.deleteDocument.useMutation({
    onSuccess: () => { toast.success("Document deleted!"); utils.profile.getDocuments.invalidate(); },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({ fileBase64: base64, fileName: file.name, fileType: file.type, purpose: "document", docType: "certificate" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-sans">Documents & Certificates</CardTitle>
        <div>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} className="gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : docs && docs.length > 0 ? (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gold-500" />
                  <div>
                    <p className="font-semibold font-sans text-foreground">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground font-sans">{doc.docType} • Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="font-sans">View</Button>
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: doc.id })} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans">No documents uploaded yet</p>
            <p className="text-sm text-muted-foreground/70 font-sans mt-1">Upload your certificates, licenses, and other maritime documents</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ApplicationsTab() {
  const { data: apps, isLoading } = trpc.jobs.myApplications.useQuery();

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    reviewed: "bg-blue-100 text-blue-800 border-blue-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">My Applications</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : apps && apps.length > 0 ? (
          <div className="space-y-3">
            {apps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-gold-500" />
                  <div>
                    <p className="font-semibold font-sans text-foreground">Job #{app.jobId}</p>
                    <p className="text-xs text-muted-foreground font-sans">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={statusColors[app.status as string] || ""}>{app.status}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans">No applications yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VerificationTab() {
  const { data: verification, isLoading } = trpc.verification.status.useQuery();
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState("");

  const requestMutation = trpc.verification.request.useMutation({
    onSuccess: () => { toast.success("Verification request submitted!"); utils.verification.status.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        requestMutation.mutate({ documentBase64: base64, fileName: file.name, fileType: file.type, notes });
      };
      reader.readAsDataURL(file);
    } else {
      requestMutation.mutate({ notes });
    }
  };

  const statusIcon: Record<string, any> = {
    pending: <Clock className="h-8 w-8 text-yellow-500" />,
    approved: <CheckCircle2 className="h-8 w-8 text-green-500" />,
    rejected: <XCircle className="h-8 w-8 text-red-500" />,
  };

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">Account Verification</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : verification ? (
          <div className="text-center py-8">
            {statusIcon[verification.status as string]}
            <h3 className="text-xl font-bold text-foreground mt-4 font-sans capitalize">{verification.status}</h3>
            <p className="text-muted-foreground font-sans mt-2">
              {verification.status === "pending" ? "Your verification request is being reviewed." :
               verification.status === "approved" ? "Your account has been verified!" :
               "Your request was not approved. You can submit a new request."}
            </p>
            {verification.adminNotes && (
              <p className="text-sm text-muted-foreground font-sans mt-4 bg-secondary/30 p-4 rounded-lg">
                Admin Notes: {verification.adminNotes}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <p className="text-muted-foreground font-sans">Submit your verification documents to get a verified badge on your profile.</p>
            <div className="space-y-2">
              <Label className="font-sans">Verification Document</Label>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm font-sans file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-400/10 file:text-gold-600 hover:file:bg-gold-400/20" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Additional Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="font-sans" placeholder="Any additional information..." />
            </div>
            <Button type="submit" className="gold-gradient text-navy-950 font-semibold font-sans hover:opacity-90" disabled={requestMutation.isPending}>
              {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
              Submit Verification Request
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function NotificationsTab() {
  const { data: notifications, isLoading } = trpc.notifications.list.useQuery();
  const utils = trpc.useUtils();

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
  });
  const markAllMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => { toast.success("All marked as read"); utils.notifications.list.invalidate(); },
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-sans">Notifications</CardTitle>
        {notifications && notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} className="font-sans">Mark All Read</Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                n.isRead ? "bg-background border-border/50" : "bg-gold-400/5 border-gold-400/20"
              }`} onClick={() => !n.isRead && markReadMutation.mutate({ id: n.id })}>
                <Bell className={`h-5 w-5 mt-0.5 shrink-0 ${n.isRead ? "text-muted-foreground" : "text-gold-500"}`} />
                <div>
                  <p className="font-semibold font-sans text-foreground">{n.titleEn}</p>
                  <p className="text-sm text-muted-foreground font-sans">{n.messageEn}</p>
                  <p className="text-xs text-muted-foreground/60 font-sans mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-sans">No notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
