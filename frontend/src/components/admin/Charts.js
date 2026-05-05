'use client';

import { cn } from '@/lib/utils';

// Simple SVG line chart
export function LineChart({ data, height = 200, color = '#1f5188', valueKey = 'revenue', labelKey = 'day' }) {
  if (!data?.length) return <div className="text-gray-400 text-sm text-center py-12">لا توجد بيانات</div>;
  const values = data.map(d => Number(d[valueKey] || 0));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const w = 800;
  const h = height;
  const padding = { l: 40, r: 10, t: 20, b: 30 };
  const cw = w - padding.l - padding.r;
  const ch = h - padding.t - padding.b;
  const step = data.length > 1 ? cw / (data.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = padding.l + i * step;
    const y = padding.t + ch - ((v - min) / range) * ch;
    return [x, y];
  });
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = `${path} L${points[points.length - 1][0]},${padding.t + ch} L${points[0][0]},${padding.t + ch} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Y-axis grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={padding.l} y1={padding.t + ch * p} x2={padding.l + cw} y2={padding.t + ch * p}
              stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,4" />
      ))}
      <path d={area} fill="url(#chart-grad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
      {/* X-axis labels (sparse) */}
      {data.map((d, i) => (i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)) && (
        <text key={i} x={padding.l + i * step} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
          {String(d[labelKey]).slice(5, 10)}
        </text>
      ))}
    </svg>
  );
}

// Horizontal bars
export function BarList({ items, valueKey = 'revenue', labelKey = 'name', max, format = (v) => v.toLocaleString(), color = 'bg-brand-500' }) {
  if (!items?.length) return <div className="text-gray-400 text-sm text-center py-6">لا توجد بيانات</div>;
  const m = max || Math.max(...items.map(i => Number(i[valueKey] || 0)), 1);

  return (
    <div className="space-y-2.5">
      {items.map((it, i) => {
        const v = Number(it[valueKey] || 0);
        const pct = (v / m) * 100;
        return (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-1 text-sm">
              <span className="font-semibold text-brand-900 truncate">{it[labelKey]}</span>
              <span className="font-bold text-brand-700 ms-2 whitespace-nowrap">{format(v)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Donut/pie chart
export function DonutChart({ items, size = 180, valueKey = 'revenue', labelKey = 'method', colors = ['#1f5188','#f59300','#10b981','#7c3aed','#dc2626','#0891b2','#ea580c','#0ea5e9'] }) {
  if (!items?.length) return <div className="text-gray-400 text-sm text-center py-6">لا توجد بيانات</div>;
  const total = items.reduce((s, it) => s + Number(it[valueKey] || 0), 0) || 1;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let startAngle = -90;

  const arcs = items.map((it, i) => {
    const v = Number(it[valueKey] || 0);
    const pct = v / total;
    const angle = pct * 360;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
    const large = angle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const slice = { path, color: colors[i % colors.length], pct, label: it[labelKey], value: v };
    startAngle = endAngle;
    return slice;
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} stroke="#fff" strokeWidth="2" />)}
        <circle cx={cx} cy={cy} r={r * 0.6} fill="#fff" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0e2342">
          {items.length}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#64748b">items</text>
      </svg>
      <div className="space-y-1.5 text-sm flex-1 min-w-0">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
            <span className="font-semibold text-brand-900 truncate flex-1">{a.label}</span>
            <span className="text-xs text-gray-500">{Math.round(a.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
