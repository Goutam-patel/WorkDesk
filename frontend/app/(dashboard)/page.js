'use client';

import { useMemo } from 'react';
import { Clock3, FolderKanban, Sparkles, Users2, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { H1, H2, Body } from '../../components/ui/Typography';

const stats = [
  { label: 'Active Leads', value: '128', trend: { label: '+12% from last week', positive: true }, icon: <Users2 size={22} strokeWidth={2.2} /> },
  { label: 'Pipeline Value', value: '$842k', trend: { label: '+8.2% MoM', positive: true }, icon: <TrendingUp size={22} strokeWidth={2.2} /> },
  { label: 'Open Tasks', value: '36', trend: { label: '5 due today', positive: false }, icon: <FolderKanban size={22} strokeWidth={2.2} /> },
  { label: 'Response Time', value: '2.1h', trend: { label: '-18% faster', positive: true }, icon: <Clock3 size={22} strokeWidth={2.2} /> }
];

const funnelBars = [
  { label: 'New', value: 78 },
  { label: 'Contacted', value: 64 },
  { label: 'Qualified', value: 52 },
  { label: 'Proposal', value: 40 },
  { label: 'Won', value: 28 }
];

const trendBars = [
  { label: 'Mon', value: 40 },
  { label: 'Tue', value: 72 },
  { label: 'Wed', value: 58 },
  { label: 'Thu', value: 82 },
  { label: 'Fri', value: 74 },
  { label: 'Sat', value: 38 },
  { label: 'Sun', value: 46 }
];

const activities = [
  { time: '10m ago', title: 'Lead converted to Qualified', detail: 'Acme Labs moved from Contacted to Qualified.' },
  { time: '32m ago', title: 'Task updated', detail: 'Board review task was moved to In Progress.' },
  { time: '1h ago', title: 'New lead added', detail: 'Inbound demo request from Northstar Studios.' },
  { time: '3h ago', title: 'Proposal sent', detail: 'Commercial proposal shared with Horizon Group.' }
];

export default function DashboardHome() {
  const { user } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <section className="section-stagger space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <Card className="relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,122,26,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(36,200,219,0.2),transparent_36%)]" />
          <div className="relative z-10 space-y-5">
            <span className="brand-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
              <Sparkles size={14} />
              WorkDesk Overview
            </span>
            <H1>
              {greeting}, {user?.name || 'Operator'}.
            </H1>
            <Body className="max-w-2xl">
              Your command center is live with realtime lead movement, fast task handoff, and clean visual priority.
            </Body>
            <div className="flex flex-wrap gap-3">
              <Button>
                <span className="inline-flex items-center gap-2">
                  <Plus size={16} /> Create Lead
                </span>
              </Button>
              <Button variant="secondary">Open Kanban</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <H2 className="mb-4">Activity</H2>
          <div className="space-y-4">
            {activities.map((item) => (
              <div key={item.time} className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">{item.title}</p>
                  <span className="text-xs text-[color:var(--muted)]">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatsCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Revenue Trend"
          subtitle="Last 7 days"
          bars={trendBars}
          legend={[
            { label: 'Booked calls', dotClass: 'bg-amber-400' },
            { label: 'Closed revenue', dotClass: 'bg-cyan-400' }
          ]}
        />
        <ChartCard
          title="Sales Funnel"
          subtitle="Lead status distribution"
          bars={funnelBars.map((bar, index) => ({
            ...bar,
            className: index === funnelBars.length - 1 ? 'bg-gradient-to-t from-emerald-500 to-teal-400' : 'bg-gradient-to-t from-orange-500 to-cyan-400'
          }))}
          legend={[
            { label: 'Conversions', dotClass: 'bg-emerald-400' },
            { label: 'Drop-off', dotClass: 'bg-orange-400' }
          ]}
        />
      </div>
    </section>
  );
}
