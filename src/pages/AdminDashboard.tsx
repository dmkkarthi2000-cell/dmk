import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Youtube, CalendarPlus, Newspaper, Image, Settings, LogOut, Plus, Trash2, Pencil, Phone, Mail, MapPin, Share2, RefreshCw, Loader2, Play, ListVideo, Video, LayoutDashboard, ExternalLink } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { motion } from 'framer-motion';

const SectionCard = ({ icon: Icon, title, description, children }: { icon: any; title: string; description?: string; children: React.ReactNode }) => (
  <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
    <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
      <div className="flex items-center gap-2.5 md:gap-3">
        <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-primary/10">
          <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base md:text-lg font-bold">{title}</CardTitle>
          {description && <CardDescription className="text-[10px] md:text-xs mt-0.5">{description}</CardDescription>}
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">{children}</CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdmin();
  const admin = useAdminData();

  const settings = admin.settingsQuery.data?.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.value }), {}) || {};

  const [heroContent, setHeroContent] = useState({ title: '', subtitle: '', tagline: '' });
  const [aboutContent, setAboutContent] = useState({ title: '', leader: '', description: '', stats: [] as any[] });
  const [contactInfo, setContactInfo] = useState({ address: '', phone: '', email: '' });
  const [footerContent, setFooterContent] = useState({ title: '', description: '' });
  const [socialMedia, setSocialMedia] = useState<any[]>([]);

  const [newEvent, setNewEvent] = useState({ title: '', date: '', category: '', image: '', description: '' });
  const [newGallery, setNewGallery] = useState({ src: '', alt: '', description: '' });
  const [newNews, setNewNews] = useState({ headline: '', url: '', image: '', source: '', publish_date: '' });
  const [newChannel, setNewChannel] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [singleVideoUrl, setSingleVideoUrl] = useState('');
  const [singleVideoLabel, setSingleVideoLabel] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistLabel, setPlaylistLabel] = useState('');
  const [videoFilter, setVideoFilter] = useState<string>('all');

  const [editEvent, setEditEvent] = useState<any>(null);
  const [editNews, setEditNews] = useState<any>(null);
  const [editGallery, setEditGallery] = useState<any>(null);
  const [editVideo, setEditVideo] = useState<any>(null);

  useEffect(() => {
    if (settings.hero_content) setHeroContent(settings.hero_content);
    if (settings.about_content) setAboutContent(settings.about_content);
    if (settings.contact_info) setContactInfo(settings.contact_info);
    if (settings.footer_content) setFooterContent(settings.footer_content);
    if (settings.social_media) setSocialMedia(settings.social_media);
  }, [admin.settingsQuery.data]);

  if (!isAuthenticated) return <Navigate to="/admin" />;

  const saveAllSettings = () => {
    admin.updateSettingMutation.mutate({ id: 'hero_content', value: heroContent });
    admin.updateSettingMutation.mutate({ id: 'about_content', value: aboutContent });
    admin.updateSettingMutation.mutate({ id: 'contact_info', value: contactInfo });
    admin.updateSettingMutation.mutate({ id: 'footer_content', value: footerContent });
    admin.updateSettingMutation.mutate({ id: 'social_media', value: socialMedia });
  };

  const handleAddStat = () => setAboutContent({ ...aboutContent, stats: [...(aboutContent.stats || []), { label: '', value: '' }] });
  const updateStat = (i: number, field: string, val: string) => { const s = [...(aboutContent.stats || [])]; s[i] = { ...s[i], [field]: val }; setAboutContent({ ...aboutContent, stats: s }); };
  const removeStat = (i: number) => setAboutContent({ ...aboutContent, stats: aboutContent.stats.filter((_: any, idx: number) => idx !== i) });
  const handleAddSocial = () => setSocialMedia([...socialMedia, { platform: '', name: '', followers: '', url: '' }]);
  const updateSocial = (i: number, field: string, val: string) => { const items = [...socialMedia]; items[i] = { ...items[i], [field]: val }; setSocialMedia(items); };
  const removeSocial = (i: number) => setSocialMedia(socialMedia.filter((_: any, idx: number) => idx !== i));

  const statsCards = [
    { label: 'Videos', value: admin.videosQuery.data?.length || 0, icon: Video, color: 'text-red-500' },
    { label: 'Events', value: admin.eventsQuery.data?.length || 0, icon: CalendarPlus, color: 'text-blue-500' },
    { label: 'Gallery', value: admin.galleryQuery.data?.length || 0, icon: Image, color: 'text-green-500' },
    { label: 'News', value: admin.newsQuery.data?.length || 0, icon: Newspaper, color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-dmk-gradient">
              <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-bold leading-none">DMK Admin</h1>
              <p className="hidden xs:block text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">Content Management</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 md:gap-2 h-8 md:h-9 text-xs" onClick={logout}>
            <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" /> <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statsCards.map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
                  <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl bg-muted ${s.color}`}>
                    <s.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-black leading-none">{s.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="content" className="space-y-4 md:space-y-6">
          <div className="relative">
            <TabsList className="flex items-center justify-start h-auto w-full bg-card/80 backdrop-blur-sm border border-border/50 p-1 overflow-x-auto no-scrollbar">
              <div className="flex w-full min-w-max md:min-w-0 md:grid md:grid-cols-6 md:w-full gap-1">
                <TabsTrigger value="content" className="flex-1 md:flex-none gap-1.5 text-xs py-2 md:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground select-none"><Settings className="h-3.5 w-3.5" /> Content</TabsTrigger>
                <TabsTrigger value="youtube" className="flex-1 md:flex-none gap-1.5 text-xs py-2 md:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground select-none"><Youtube className="h-3.5 w-3.5" /> YouTube</TabsTrigger>
                <TabsTrigger value="events" className="flex-1 md:flex-none gap-1.5 text-xs py-2 md:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground select-none"><CalendarPlus className="h-3.5 w-3.5" /> Events</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 md:flex-none gap-1.5 text-xs py-2 md:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground select-none"><Image className="h-3.5 w-3.5" /> Gallery</TabsTrigger>
                <TabsTrigger value="news" className="flex-1 md:flex-none gap-1.5 text-xs py-2 md:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground select-none"><Newspaper className="h-3.5 w-3.5" /> News</TabsTrigger>
                <TabsTrigger value="social" className="flex-1 md:flex-none gap-1.5 text-xs py-2 md:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground select-none"><Share2 className="h-3.5 w-3.5" /> Social</TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* ==================== CONTENT TAB ==================== */}
          <TabsContent value="content">
            <div className="space-y-6">
              <SectionCard icon={Settings} title="Hero Section" description="Main banner content">
                <div className="space-y-3">
                  <div><Label className="text-xs font-medium">Title</Label><Input value={heroContent.title || ''} onChange={e => setHeroContent({ ...heroContent, title: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Subtitle</Label><Input value={heroContent.subtitle || ''} onChange={e => setHeroContent({ ...heroContent, subtitle: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Tagline</Label><Input value={heroContent.tagline || ''} onChange={e => setHeroContent({ ...heroContent, tagline: e.target.value })} className="mt-1" /></div>
                </div>
              </SectionCard>

              <SectionCard icon={Settings} title="About Section" description="Leader info and stats">
                <div className="space-y-3">
                  <div><Label className="text-xs font-medium">Section Title</Label><Input value={aboutContent.title || ''} onChange={e => setAboutContent({ ...aboutContent, title: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Leader Name</Label><Input value={aboutContent.leader || ''} onChange={e => setAboutContent({ ...aboutContent, leader: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Description</Label><Textarea rows={3} value={aboutContent.description || ''} onChange={e => setAboutContent({ ...aboutContent, description: e.target.value })} className="mt-1" /></div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-medium">Stats</Label>
                      <Button size="sm" variant="outline" onClick={handleAddStat} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" /> Add</Button>
                    </div>
                    {(aboutContent.stats || []).map((stat: any, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <Input placeholder="Value" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="h-9" />
                        <Input placeholder="Label" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="h-9" />
                        <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => removeStat(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon={Phone} title="Contact Information" description="Address, phone and email">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><Label className="text-xs font-medium">Address</Label><Input value={contactInfo.address || ''} onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Phone</Label><Input value={contactInfo.phone || ''} onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Email</Label><Input value={contactInfo.email || ''} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} className="mt-1" /></div>
                </div>
              </SectionCard>

              <SectionCard icon={Settings} title="Footer Content">
                <div className="space-y-3">
                  <div><Label className="text-xs font-medium">Title</Label><Input value={footerContent.title || ''} onChange={e => setFooterContent({ ...footerContent, title: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Description</Label><Textarea value={footerContent.description || ''} onChange={e => setFooterContent({ ...footerContent, description: e.target.value })} className="mt-1" /></div>
                </div>
              </SectionCard>

              <SectionCard icon={Settings} title="Theme Colors" description="HSL color values">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs font-medium">Primary</Label><Input placeholder="e.g. 10 90% 45%" value={settings.theme_colors?.primary || ''} onChange={e => admin.updateSettingMutation.mutate({ id: 'theme_colors', value: { ...settings.theme_colors, primary: e.target.value } })} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Secondary</Label><Input placeholder="e.g. 0 0% 15%" value={settings.theme_colors?.secondary || ''} onChange={e => admin.updateSettingMutation.mutate({ id: 'theme_colors', value: { ...settings.theme_colors, secondary: e.target.value } })} className="mt-1" /></div>
                </div>
              </SectionCard>

              <Button className="shadow-dmk w-full sm:w-auto" size="lg" onClick={saveAllSettings}>Save All Content Settings</Button>
            </div>
          </TabsContent>

          {/* ==================== SOCIAL TAB ==================== */}
          <TabsContent value="social">
            <SectionCard icon={Share2} title="Social Media Links" description="Manage platform links and follower counts">
              <div className="space-y-3">
                {socialMedia.map((item: any, i: number) => (
                  <div key={i} className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-muted/30 rounded-xl border border-border/50">
                    <div className="space-y-1 xs:col-span-1"><Label className="text-[10px] font-medium md:hidden">Platform</Label><Input placeholder="Platform" value={item.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} className="h-9 text-sm" /></div>
                    <div className="space-y-1 xs:col-span-1"><Label className="text-[10px] font-medium md:hidden">Name</Label><Input placeholder="Display Name" value={item.name} onChange={e => updateSocial(i, 'name', e.target.value)} className="h-9 text-sm" /></div>
                    <div className="space-y-1 xs:col-span-1"><Label className="text-[10px] font-medium md:hidden">Followers</Label><Input placeholder="Followers" value={item.followers} onChange={e => updateSocial(i, 'followers', e.target.value)} className="h-9 text-sm" /></div>
                    <div className="space-y-1 xs:col-span-1"><Label className="text-[10px] font-medium md:hidden">URL</Label><Input placeholder="URL" value={item.url} onChange={e => updateSocial(i, 'url', e.target.value)} className="h-9 text-sm" /></div>
                    <div className="flex items-end xs:col-span-1"><Button size="sm" variant="ghost" className="h-9 w-full md:w-9 text-destructive" onClick={() => removeSocial(i)}><Trash2 className="h-3.5 w-3.5 mr-2 md:mr-0" /> <span className="md:hidden">Remove</span></Button></div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleAddSocial}><Plus className="h-4 w-4 mr-1" /> Add Platform</Button>
                  <Button size="sm" className="shadow-dmk" onClick={() => admin.updateSettingMutation.mutate({ id: 'social_media', value: socialMedia })}>Save Social Media</Button>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ==================== YOUTUBE TAB ==================== */}
          <TabsContent value="youtube">
            <div className="space-y-6">
              <SectionCard icon={Youtube} title="Channel Sync" description="Add YouTube channels to auto-fetch videos, shorts & playlists">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input placeholder="Channel Name" value={newChannelName} onChange={e => setNewChannelName(e.target.value)} />
                    <Input placeholder="Channel URL (e.g. https://youtube.com/@DMK)" value={newChannel} onChange={e => setNewChannel(e.target.value)} />
                    <Button onClick={() => { if (newChannel && newChannelName) { admin.addChannelMutation.mutate({ url: newChannel, name: newChannelName, enabled: true }); setNewChannel(''); setNewChannelName(''); } }}><Plus className="h-4 w-4 mr-1" /> Add Channel</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow className="bg-muted/30"><TableHead className="text-[11px] md:text-sm">Name</TableHead><TableHead className="text-[11px] md:text-sm">URL</TableHead><TableHead className="text-center text-[11px] md:text-sm">Videos</TableHead><TableHead className="text-center text-[11px] md:text-sm">Shorts</TableHead><TableHead className="text-center text-[11px] md:text-sm">Playlists</TableHead><TableHead className="text-center text-[11px] md:text-sm">Active</TableHead><TableHead className="text-[11px] md:text-sm">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {admin.channelsQuery.data?.map((ch: any) => (
                          <TableRow key={ch.id} className="hover:bg-muted/20">
                            <TableCell className="font-semibold text-xs md:text-sm">{ch.name}</TableCell>
                            <TableCell><span className="text-xs text-muted-foreground max-w-[120px] truncate block">{ch.url}</span></TableCell>
                            <TableCell className="text-center"><Switch checked={ch.sync_videos !== false} onCheckedChange={(v) => admin.updateChannelMutation.mutate({ id: ch.id, sync_videos: v })} /></TableCell>
                            <TableCell className="text-center"><Switch checked={ch.sync_shorts !== false} onCheckedChange={(v) => admin.updateChannelMutation.mutate({ id: ch.id, sync_shorts: v })} /></TableCell>
                            <TableCell className="text-center"><Switch checked={ch.sync_playlists === true} onCheckedChange={(v) => admin.updateChannelMutation.mutate({ id: ch.id, sync_playlists: v })} /></TableCell>
                            <TableCell className="text-center"><Switch checked={ch.enabled} onCheckedChange={(v) => admin.updateChannelMutation.mutate({ id: ch.id, enabled: v })} /></TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="gap-1 h-8" onClick={() => admin.syncChannelMutation.mutate(ch.id)} disabled={admin.syncChannelMutation.isPending}>
                                  {admin.syncChannelMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} Sync
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => admin.deleteChannelMutation.mutate(ch.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </SectionCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard icon={Play} title="Add Single Video" description="Paste any YouTube video or shorts URL">
                  <div className="space-y-3">
                    <Input placeholder="Label (optional)" value={singleVideoLabel} onChange={e => setSingleVideoLabel(e.target.value)} />
                    <Input placeholder="Video URL" value={singleVideoUrl} onChange={e => setSingleVideoUrl(e.target.value)} />
                    <Button className="w-full" onClick={() => { if (singleVideoUrl) { admin.addSingleVideoMutation.mutate({ video_url: singleVideoUrl, channel_name: singleVideoLabel || undefined }); setSingleVideoUrl(''); setSingleVideoLabel(''); } }} disabled={admin.addSingleVideoMutation.isPending}>
                      {admin.addSingleVideoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />} Add Video
                    </Button>
                  </div>
                </SectionCard>

                <SectionCard icon={ListVideo} title="Sync Playlist" description="Fetch all videos from a playlist URL">
                  <div className="space-y-3">
                    <Input placeholder="Label (optional)" value={playlistLabel} onChange={e => setPlaylistLabel(e.target.value)} />
                    <Input placeholder="Playlist URL" value={playlistUrl} onChange={e => setPlaylistUrl(e.target.value)} />
                    <Button className="w-full" onClick={() => { if (playlistUrl) { admin.syncPlaylistMutation.mutate({ playlist_url: playlistUrl, channel_name: playlistLabel || undefined }); setPlaylistUrl(''); setPlaylistLabel(''); } }} disabled={admin.syncPlaylistMutation.isPending}>
                      {admin.syncPlaylistMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />} Sync Playlist
                    </Button>
                  </div>
                </SectionCard>
              </div>

              {/* Videos List */}
              <SectionCard icon={Video} title={`All Videos (${admin.videosQuery.data?.length || 0})`} description="Manage synced videos">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'video', 'short'].map(f => (
                      <Button key={f} size="sm" variant={videoFilter === f ? 'default' : 'outline'} className="h-8 text-xs" onClick={() => setVideoFilter(f)}>
                        {f === 'all' ? 'All' : f === 'video' ? 'Videos' : 'Shorts'}
                        <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1">
                          {f === 'all' ? admin.videosQuery.data?.length || 0 : admin.videosQuery.data?.filter((v: any) => v.category === f).length || 0}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow className="bg-muted/30"><TableHead className="w-16 md:w-24 text-[11px] md:text-sm">Thumb</TableHead><TableHead className="text-[11px] md:text-sm">Title</TableHead><TableHead className="text-[11px] md:text-sm">Channel</TableHead><TableHead className="text-[11px] md:text-sm">Type</TableHead><TableHead className="text-[11px] md:text-sm">Date</TableHead><TableHead className="text-right text-[11px] md:text-sm">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {admin.videosQuery.data?.filter((v: any) => videoFilter === 'all' || v.category === videoFilter).map((v: any) => (
                          <TableRow key={v.id} className="hover:bg-muted/20">
                            <TableCell>
                              <div className="relative w-14 h-9 md:w-20 md:h-12 rounded md:rounded-md overflow-hidden">
                                <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Play className="h-2.5 w-2.5 md:h-3 md:w-3 text-white fill-white" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><p className="max-w-[200px] truncate text-sm font-medium">{v.title}</p></TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{v.channel_name || '—'}</Badge></TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] ${v.category === 'short' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary/10 text-primary border-primary/20'}`} variant="outline">
                                {v.category || 'video'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(v.publish_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditVideo(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => admin.deleteVideoMutation.mutate(v.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </SectionCard>
            </div>
          </TabsContent>

          {/* ==================== EVENTS TAB ==================== */}
          <TabsContent value="events">
            <SectionCard icon={CalendarPlus} title="Events Management" description="Create and manage events">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-4 bg-muted/20 rounded-xl border border-border/50">
                  <div className="space-y-1"><Label className="text-xs font-medium">Title</Label><Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="h-9 text-sm" /></div>
                  <div className="space-y-1"><Label className="text-xs font-medium">Date</Label><Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="h-9 text-sm" /></div>
                  <div className="space-y-1"><Label className="text-xs font-medium">Category</Label><Input value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="h-9 text-sm" /></div>
                  <div className="space-y-1"><Label className="text-xs font-medium">Image URL</Label><Input value={newEvent.image} onChange={e => setNewEvent({...newEvent, image: e.target.value})} className="h-9 text-sm" /></div>
                  <div className="md:col-span-2 space-y-1"><Label className="text-xs font-medium">Description</Label><Textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="text-sm" /></div>
                </div>
                <Button onClick={() => { if (newEvent.title && newEvent.date) { admin.addEventMutation.mutate(newEvent); setNewEvent({ title: '', date: '', category: '', image: '', description: '' }); } }} className="shadow-dmk w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" /> Add Event</Button>
<br />
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="bg-muted/30"><TableHead className="text-[11px] md:text-sm">Image</TableHead><TableHead className="text-[11px] md:text-sm">Date</TableHead><TableHead className="text-[11px] md:text-sm">Title</TableHead><TableHead className="text-[11px] md:text-sm">Category</TableHead><TableHead className="text-right text-[11px] md:text-sm">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {admin.eventsQuery.data?.map((ev: any) => (
                        <TableRow key={ev.id} className="hover:bg-muted/20">
                          <TableCell>{ev.image && <img src={ev.image} alt="" className="w-12 h-8 md:w-16 md:h-10 object-cover rounded" />}</TableCell>
                          <TableCell className="text-[10px] md:text-sm whitespace-nowrap">{new Date(ev.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold text-xs md:text-sm">{ev.title}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px] md:text-xs px-1 h-5">{ev.category}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditEvent(ev)}><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => admin.deleteEventMutation.mutate(ev.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ==================== GALLERY TAB ==================== */}
          <TabsContent value="gallery">
            <SectionCard icon={Image} title="Gallery Management" description="Add and manage gallery images">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/20 rounded-xl border border-border/50">
                  <div><Label className="text-xs font-medium">Image URL</Label><Input value={newGallery.src} onChange={e => setNewGallery({...newGallery, src: e.target.value})} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Alt Text</Label><Input value={newGallery.alt} onChange={e => setNewGallery({...newGallery, alt: e.target.value})} className="mt-1" /></div>
                  <div className="md:col-span-2"><Label className="text-xs font-medium">Description</Label><Input value={newGallery.description} onChange={e => setNewGallery({...newGallery, description: e.target.value})} className="mt-1" /></div>
                </div>
                <Button onClick={() => { if (newGallery.src) { admin.addGalleryMutation.mutate(newGallery); setNewGallery({ src: '', alt: '', description: '' }); } }} className="shadow-dmk"><Plus className="h-4 w-4 mr-2" /> Add Image</Button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {admin.galleryQuery.data?.map((img: any) => (
                    <div key={img.id} className="relative group rounded-lg md:rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <img src={img.src} alt={img.alt || ''} className="w-full h-24 md:h-36 object-cover" />
                      <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 md:gap-2 text-primary-foreground">
                        <button onClick={() => setEditGallery(img)} className="bg-primary p-1.5 md:p-2 rounded-full hover:scale-110 transition-transform"><Pencil className="h-3 w-3 md:h-3.5 md:w-3.5" /></button>
                        <button onClick={() => admin.deleteGalleryMutation.mutate(img.id)} className="bg-destructive p-1.5 md:p-2 rounded-full hover:scale-110 transition-transform"><Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" /></button>
                      </div>
                      <div className="p-1.5 md:p-2 bg-card">
                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">{img.alt || img.description || 'No description'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* ==================== NEWS TAB ==================== */}
          <TabsContent value="news">
            <SectionCard icon={Newspaper} title="News Management" description="Add and manage news articles">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-4 bg-muted/20 rounded-xl border border-border/50">
                  <div><Label className="text-xs font-medium">Headline</Label><Input value={newNews.headline} onChange={e => setNewNews({...newNews, headline: e.target.value})} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Source</Label><Input value={newNews.source} onChange={e => setNewNews({...newNews, source: e.target.value})} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">URL</Label><Input value={newNews.url} onChange={e => setNewNews({...newNews, url: e.target.value})} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Image URL</Label><Input value={newNews.image} onChange={e => setNewNews({...newNews, image: e.target.value})} className="mt-1" /></div>
                  <div><Label className="text-xs font-medium">Publish Date</Label><Input type="date" value={newNews.publish_date} onChange={e => setNewNews({...newNews, publish_date: e.target.value})} className="mt-1" /></div>
                </div>
                <Button onClick={() => { if (newNews.headline && newNews.url) { admin.addNewsMutation.mutate(newNews); setNewNews({ headline: '', url: '', image: '', source: '', publish_date: '' }); } }} className="shadow-dmk w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" /> Add News</Button>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="bg-muted/30"><TableHead className="text-[11px] md:text-sm">Image</TableHead><TableHead className="text-[11px] md:text-sm">Headline</TableHead><TableHead className="text-[11px] md:text-sm">Source</TableHead><TableHead className="text-[11px] md:text-sm">Date</TableHead><TableHead className="text-center text-[11px] md:text-sm">Active</TableHead><TableHead className="text-right text-[11px] md:text-sm">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {admin.newsQuery.data?.map((n: any) => (
                        <TableRow key={n.id} className="hover:bg-muted/20">
                          <TableCell>{n.image && <img src={n.image} alt="" className="w-12 h-8 md:w-16 md:h-10 object-cover rounded" />}</TableCell>
                          <TableCell><p className="max-w-[150px] md:max-w-[200px] truncate font-semibold text-xs md:text-sm">{n.headline}</p></TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px] md:text-xs px-1 h-5">{n.source}</Badge></TableCell>
                          <TableCell className="text-[10px] md:text-xs text-muted-foreground">{new Date(n.publish_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center"><Switch checked={n.enabled} onCheckedChange={(v) => admin.updateNewsMutation.mutate({ id: n.id, enabled: v })} className="scale-75 md:scale-100" /></TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditNews(n)}><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => admin.deleteNewsMutation.mutate(n.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* ==================== EDIT EVENT DIALOG ==================== */}
      <Dialog open={!!editEvent} onOpenChange={() => setEditEvent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit Event</DialogTitle>
            <DialogDescription>Update event details below</DialogDescription>
          </DialogHeader>
          {editEvent && (
            <div className="space-y-3">
              <div><Label className="text-xs">Title</Label><Input value={editEvent.title} onChange={e => setEditEvent({...editEvent, title: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Date</Label><Input type="date" value={editEvent.date?.split('T')[0]} onChange={e => setEditEvent({...editEvent, date: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Category</Label><Input value={editEvent.category} onChange={e => setEditEvent({...editEvent, category: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Image URL</Label><Input value={editEvent.image} onChange={e => setEditEvent({...editEvent, image: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Description</Label><Textarea value={editEvent.description || ''} onChange={e => setEditEvent({...editEvent, description: e.target.value})} className="mt-1" /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEvent(null)}>Cancel</Button>
            <Button className="shadow-dmk" onClick={() => { admin.updateEventMutation.mutate(editEvent); setEditEvent(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== EDIT NEWS DIALOG ==================== */}
      <Dialog open={!!editNews} onOpenChange={() => setEditNews(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit News</DialogTitle>
            <DialogDescription>Update news article details</DialogDescription>
          </DialogHeader>
          {editNews && (
            <div className="space-y-3">
              <div><Label className="text-xs">Headline</Label><Input value={editNews.headline} onChange={e => setEditNews({...editNews, headline: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Source</Label><Input value={editNews.source} onChange={e => setEditNews({...editNews, source: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">URL</Label><Input value={editNews.url} onChange={e => setEditNews({...editNews, url: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Image URL</Label><Input value={editNews.image} onChange={e => setEditNews({...editNews, image: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Publish Date</Label><Input type="date" value={editNews.publish_date?.split('T')[0]} onChange={e => setEditNews({...editNews, publish_date: e.target.value})} className="mt-1" /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditNews(null)}>Cancel</Button>
            <Button className="shadow-dmk" onClick={() => { admin.updateNewsMutation.mutate(editNews); setEditNews(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== EDIT GALLERY DIALOG ==================== */}
      <Dialog open={!!editGallery} onOpenChange={() => setEditGallery(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit Gallery Image</DialogTitle>
            <DialogDescription>Update image details</DialogDescription>
          </DialogHeader>
          {editGallery && (
            <div className="space-y-3">
              <div><Label className="text-xs">Image URL</Label><Input value={editGallery.src} onChange={e => setEditGallery({...editGallery, src: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Alt Text</Label><Input value={editGallery.alt || ''} onChange={e => setEditGallery({...editGallery, alt: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Description</Label><Input value={editGallery.description || ''} onChange={e => setEditGallery({...editGallery, description: e.target.value})} className="mt-1" /></div>
              {editGallery.src && <img src={editGallery.src} alt="" className="w-full h-40 object-cover rounded-xl" />}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGallery(null)}>Cancel</Button>
            <Button className="shadow-dmk" onClick={() => { admin.updateGalleryMutation.mutate(editGallery); setEditGallery(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== EDIT VIDEO DIALOG ==================== */}
      <Dialog open={!!editVideo} onOpenChange={() => setEditVideo(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit Video</DialogTitle>
            <DialogDescription>Update video title, channel name, category and more</DialogDescription>
          </DialogHeader>
          {editVideo && (
            <div className="space-y-3">
              {editVideo.thumbnail && (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={editVideo.thumbnail} alt="" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <Play className="h-8 w-8 text-background" />
                  </div>
                </div>
              )}
              <div><Label className="text-xs">Title</Label><Input value={editVideo.title} onChange={e => setEditVideo({...editVideo, title: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Channel Name</Label><Input value={editVideo.channel_name || ''} onChange={e => setEditVideo({...editVideo, channel_name: e.target.value})} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Category</Label><Input value={editVideo.category || 'video'} onChange={e => setEditVideo({...editVideo, category: e.target.value})} className="mt-1" /></div>
                <div><Label className="text-xs">Source Type</Label><Input value={editVideo.source_type || 'channel'} onChange={e => setEditVideo({...editVideo, source_type: e.target.value})} className="mt-1" /></div>
              </div>
              <div><Label className="text-xs">Thumbnail URL</Label><Input value={editVideo.thumbnail} onChange={e => setEditVideo({...editVideo, thumbnail: e.target.value})} className="mt-1" /></div>
              <div><Label className="text-xs">Video URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={editVideo.url} onChange={e => setEditVideo({...editVideo, url: e.target.value})} />
                  <Button variant="outline" size="icon" className="shrink-0" asChild><a href={editVideo.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a></Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditVideo(null)}>Cancel</Button>
            <Button className="shadow-dmk" onClick={() => { admin.updateVideoMutation.mutate(editVideo); setEditVideo(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
