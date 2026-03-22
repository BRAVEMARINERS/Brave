import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Building2, Briefcase, Shield, FileText,
  Loader2, CheckCircle2, XCircle, Eye, Ban, UserCheck, Trash2,
  Plus, Edit, BarChart3, Image, HelpCircle, Anchor,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ tab?: string }>();
  const activeTab = params.tab || "overview";

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) navigate("/");
  }, [loading, isAuthenticated, user, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin text-gold-500" /></div>
    </div>
  );

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground font-sans mt-1">Manage your BraveMarines platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => navigate(`/admin/${v}`)}>
          <TabsList className="mb-8 bg-secondary/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="font-sans gap-2"><BarChart3 className="h-4 w-4" /> Overview</TabsTrigger>
            <TabsTrigger value="users" className="font-sans gap-2"><Users className="h-4 w-4" /> Users</TabsTrigger>
            <TabsTrigger value="companies" className="font-sans gap-2"><Building2 className="h-4 w-4" /> Companies</TabsTrigger>
            <TabsTrigger value="jobs" className="font-sans gap-2"><Briefcase className="h-4 w-4" /> Jobs</TabsTrigger>
            <TabsTrigger value="verification" className="font-sans gap-2"><Shield className="h-4 w-4" /> Verification</TabsTrigger>
            <TabsTrigger value="blogs" className="font-sans gap-2"><FileText className="h-4 w-4" /> Blog</TabsTrigger>
            <TabsTrigger value="sliders" className="font-sans gap-2"><Image className="h-4 w-4" /> Sliders</TabsTrigger>
            <TabsTrigger value="faqs" className="font-sans gap-2"><HelpCircle className="h-4 w-4" /> FAQs</TabsTrigger>
            <TabsTrigger value="lookups" className="font-sans gap-2"><Anchor className="h-4 w-4" /> Lookups</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="companies"><CompaniesTab /></TabsContent>
          <TabsContent value="jobs"><JobsTab /></TabsContent>
          <TabsContent value="verification"><VerificationTab /></TabsContent>
          <TabsContent value="blogs"><BlogsTab /></TabsContent>
          <TabsContent value="sliders"><SlidersTab /></TabsContent>
          <TabsContent value="faqs"><FaqsTab /></TabsContent>
          <TabsContent value="lookups"><LookupsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  const cards = [
    { label: "Total Users", value: stats?.userCount ?? 0, icon: Users, color: "text-blue-500" },
    { label: "Seafarers", value: stats?.seafarerCount ?? 0, icon: Anchor, color: "text-gold-500" },
    { label: "Companies", value: stats?.companyCount ?? 0, icon: Building2, color: "text-green-500" },
    { label: "Active Jobs", value: stats?.jobCount ?? 0, icon: Briefcase, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <c.icon className={`h-8 w-8 ${c.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground font-sans">{c.value}</p>
            <p className="text-sm text-muted-foreground font-sans">{c.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading } = trpc.admin.users.useQuery();
  const utils = trpc.useUtils();
  const updateMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => { toast.success("User updated"); utils.admin.users.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">All Users ({users?.length || 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Email</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Type</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Role</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u: any) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="p-3">{u.name || "—"}</td>
                  <td className="p-3 text-muted-foreground">{u.email || "—"}</td>
                  <td className="p-3"><Badge variant="outline" className="capitalize">{u.accountType || "seafarer"}</Badge></td>
                  <td className="p-3"><Badge className={u.role === "admin" ? "bg-gold-400/10 text-gold-600" : ""}>{u.role}</Badge></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {u.isVerified && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Verified</Badge>}
                      {u.isBlocked && <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Blocked</Badge>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => updateMutation.mutate({ id: u.id, role: u.role === "admin" ? "user" : "admin" })}
                        title={u.role === "admin" ? "Remove admin" : "Make admin"}>
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateMutation.mutate({ id: u.id, isBlocked: !u.isBlocked })}
                        title={u.isBlocked ? "Unblock" : "Block"} className={u.isBlocked ? "text-green-600" : "text-red-600"}>
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CompaniesTab() {
  const { data: companies, isLoading } = trpc.admin.companies.useQuery();
  const utils = trpc.useUtils();
  const approveMutation = trpc.admin.approveCompany.useMutation({
    onSuccess: () => { toast.success("Company updated"); utils.admin.companies.invalidate(); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">Companies ({companies?.length || 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {companies?.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold font-sans">{c.nameEn}</h4>
                  {c.isApproved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground font-sans">{c.email} • Reg: {c.registrationNumber}</p>
              </div>
              <Button size="sm" variant={c.isApproved ? "outline" : "default"}
                onClick={() => approveMutation.mutate({ id: c.id, approved: !c.isApproved })}
                className={!c.isApproved ? "gold-gradient text-navy-950 font-sans" : "font-sans"}>
                {c.isApproved ? "Revoke" : "Approve"}
              </Button>
            </div>
          ))}
          {(!companies || companies.length === 0) && <p className="text-center text-muted-foreground font-sans py-8">No companies registered</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function JobsTab() {
  const { data: jobs, isLoading } = trpc.admin.jobs.useQuery();
  const utils = trpc.useUtils();
  const deleteMutation = trpc.admin.deleteJob.useMutation({
    onSuccess: () => { toast.success("Job deleted"); utils.admin.jobs.invalidate(); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">All Jobs ({jobs?.length || 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs?.map((j: any) => (
            <div key={j.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div>
                <h4 className="font-semibold font-sans">{j.titleEn}</h4>
                <p className="text-sm text-muted-foreground font-sans">
                  {j.salary && `${j.salary} ${j.currency || "USD"}`} • Posted {new Date(j.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: j.id })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!jobs || jobs.length === 0) && <p className="text-center text-muted-foreground font-sans py-8">No jobs posted</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationTab() {
  const { data: requests, isLoading } = trpc.admin.verificationRequests.useQuery({});
  const utils = trpc.useUtils();
  const reviewMutation = trpc.admin.reviewVerification.useMutation({
    onSuccess: () => { toast.success("Verification reviewed"); utils.admin.verificationRequests.invalidate(); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">Verification Requests ({requests?.length || 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests?.map((r: any) => (
            <div key={r.id} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold font-sans">User #{r.userId} - {r.requestType}</p>
                  <p className="text-sm text-muted-foreground font-sans">Submitted {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge className={r.status === "pending" ? "bg-yellow-100 text-yellow-700" : r.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {r.status}
                </Badge>
              </div>
              {r.notes && <p className="text-sm text-muted-foreground font-sans mb-3">Notes: {r.notes}</p>}
              {r.documentUrl && (
                <a href={r.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gold-500 font-sans hover:underline">View Document</a>
              )}
              {r.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => reviewMutation.mutate({ id: r.id, status: "approved" })}
                    className="gold-gradient text-navy-950 font-sans">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => reviewMutation.mutate({ id: r.id, status: "rejected", adminNotes: "Documents insufficient" })}
                    className="font-sans text-destructive">
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
          {(!requests || requests.length === 0) && <p className="text-center text-muted-foreground font-sans py-8">No verification requests</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function BlogsTab() {
  const { data: blogs, isLoading } = trpc.admin.blogs.useQuery();
  const utils = trpc.useUtils();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titleEn: "", contentEn: "", excerptEn: "", isPublished: true });

  const createMutation = trpc.admin.createBlog.useMutation({
    onSuccess: () => { toast.success("Blog created"); utils.admin.blogs.invalidate(); setShowForm(false); setForm({ titleEn: "", contentEn: "", excerptEn: "", isPublished: true }); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.admin.deleteBlog.useMutation({
    onSuccess: () => { toast.success("Blog deleted"); utils.admin.blogs.invalidate(); },
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-sans">Blog Posts ({blogs?.length || 0})</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} className="gold-gradient text-navy-950 font-sans">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-6 rounded-xl bg-secondary/30 border border-border/50 space-y-4">
            <div className="space-y-2">
              <Label className="font-sans">Title</Label>
              <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="font-sans" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Excerpt</Label>
              <Input value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} className="font-sans" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Content (Markdown)</Label>
              <Textarea value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} className="font-sans min-h-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
              <Label className="font-sans">Published</Label>
            </div>
            <Button onClick={() => createMutation.mutate(form)} className="gold-gradient text-navy-950 font-sans" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create Post
            </Button>
          </div>
        )}
        <div className="space-y-3">
          {blogs?.map((b: any) => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div>
                <h4 className="font-semibold font-sans">{b.titleEn}</h4>
                <p className="text-sm text-muted-foreground font-sans">{b.isPublished ? "Published" : "Draft"}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: b.id })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SlidersTab() {
  const { data: sliders, isLoading } = trpc.admin.sliders.useQuery();
  const utils = trpc.useUtils();
  const deleteMutation = trpc.admin.deleteSlider.useMutation({
    onSuccess: () => { toast.success("Slider deleted"); utils.admin.sliders.invalidate(); },
  });

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="font-sans">Homepage Sliders ({sliders?.length || 0})</CardTitle></CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-sans mb-4">Manage homepage slider images and content.</p>
        <div className="space-y-3">
          {sliders?.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-3">
                {s.imageUrl && <img src={s.imageUrl} alt="" className="w-16 h-10 object-cover rounded" />}
                <div>
                  <h4 className="font-semibold font-sans">{s.titleEn || "Untitled"}</h4>
                  <p className="text-sm text-muted-foreground font-sans">{s.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: s.id })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!sliders || sliders.length === 0) && <p className="text-center text-muted-foreground font-sans py-8">No sliders configured</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function FaqsTab() {
  const { data: faqs, isLoading } = trpc.admin.faqs.useQuery();
  const utils = trpc.useUtils();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ questionEn: "", answerEn: "", isActive: true });

  const upsertMutation = trpc.admin.upsertFaq.useMutation({
    onSuccess: () => { toast.success("FAQ saved"); utils.admin.faqs.invalidate(); setShowForm(false); setForm({ questionEn: "", answerEn: "", isActive: true }); },
  });
  const deleteMutation = trpc.admin.deleteFaq.useMutation({
    onSuccess: () => { toast.success("FAQ deleted"); utils.admin.faqs.invalidate(); },
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-sans">FAQs ({faqs?.length || 0})</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} className="gold-gradient text-navy-950 font-sans">
          <Plus className="h-4 w-4 mr-2" /> Add FAQ
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-6 rounded-xl bg-secondary/30 border border-border/50 space-y-4">
            <div className="space-y-2">
              <Label className="font-sans">Question</Label>
              <Input value={form.questionEn} onChange={(e) => setForm({ ...form, questionEn: e.target.value })} className="font-sans" />
            </div>
            <div className="space-y-2">
              <Label className="font-sans">Answer</Label>
              <Textarea value={form.answerEn} onChange={(e) => setForm({ ...form, answerEn: e.target.value })} className="font-sans" />
            </div>
            <Button onClick={() => upsertMutation.mutate({ id: null, ...form })} className="gold-gradient text-navy-950 font-sans">Save FAQ</Button>
          </div>
        )}
        <div className="space-y-3">
          {faqs?.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div>
                <h4 className="font-semibold font-sans">{f.questionEn}</h4>
                <p className="text-sm text-muted-foreground font-sans line-clamp-1">{f.answerEn}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: f.id })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LookupsTab() {
  const { data: ranks } = trpc.lookups.ranks.useQuery();
  const { data: shipTypes } = trpc.lookups.shipTypes.useQuery();
  const utils = trpc.useUtils();
  const [rankForm, setRankForm] = useState({ nameEn: "", department: "deck" as const });
  const [shipForm, setShipForm] = useState({ nameEn: "" });

  const upsertRank = trpc.admin.upsertRank.useMutation({
    onSuccess: () => { toast.success("Rank saved"); utils.lookups.ranks.invalidate(); setRankForm({ nameEn: "", department: "deck" }); },
  });
  const deleteRank = trpc.admin.deleteRank.useMutation({
    onSuccess: () => { toast.success("Rank deleted"); utils.lookups.ranks.invalidate(); },
  });
  const upsertShipType = trpc.admin.upsertShipType.useMutation({
    onSuccess: () => { toast.success("Ship type saved"); utils.lookups.shipTypes.invalidate(); setShipForm({ nameEn: "" }); },
  });
  const deleteShipType = trpc.admin.deleteShipType.useMutation({
    onSuccess: () => { toast.success("Ship type deleted"); utils.lookups.shipTypes.invalidate(); },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle className="font-sans">Ranks ({ranks?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input value={rankForm.nameEn} onChange={(e) => setRankForm({ ...rankForm, nameEn: e.target.value })} placeholder="Rank name" className="font-sans" />
            <Select value={rankForm.department} onValueChange={(v: any) => setRankForm({ ...rankForm, department: v })}>
              <SelectTrigger className="w-32 font-sans"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="deck">Deck</SelectItem>
                <SelectItem value="engine">Engine</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => upsertRank.mutate({ id: null, ...rankForm })} className="gold-gradient text-navy-950 font-sans shrink-0">Add</Button>
          </div>
          <div className="space-y-2">
            {ranks?.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <span className="font-sans font-medium">{r.nameEn}</span>
                  <Badge variant="outline" className="ml-2 text-xs capitalize">{r.department}</Badge>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteRank.mutate({ id: r.id })}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="font-sans">Ship Types ({shipTypes?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input value={shipForm.nameEn} onChange={(e) => setShipForm({ nameEn: e.target.value })} placeholder="Ship type name" className="font-sans" />
            <Button onClick={() => upsertShipType.mutate({ id: null, ...shipForm })} className="gold-gradient text-navy-950 font-sans shrink-0">Add</Button>
          </div>
          <div className="space-y-2">
            {shipTypes?.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="font-sans font-medium">{s.nameEn}</span>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteShipType.mutate({ id: s.id })}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
