import React, { useState } from 'react';
import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ChinaMap } from '../components/ChinaMap';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar
} from 'recharts';
import { 
  Cpu, 
  Activity, 
  Layers, 
  Database, 
  Zap, 
  Droplet, 
  Globe, 
  CheckCircle,
  AlertTriangle,
  Monitor,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock Data
const utilizationData = [
  { name: '高利用 (>90%)', value: 35, color: '#34C759' },
  { name: '中利用 (70-90%)', value: 32, color: '#00D4FF' },
  { name: '低利用 (50-70%)', value: 22, color: '#0066FF' },
  { name: '空闲 (<50%)', value: 11, color: '#475569' }
];

const computeTrendData = [
  { name: '00:00', AI算力: 450, GPU利用率: 58.4 },
  { name: '04:00', AI算力: 500, GPU利用率: 62.1 },
  { name: '08:00', AI算力: 850, GPU利用率: 70.5 },
  { name: '12:00', AI算力: 920, GPU利用率: 74.8 },
  { name: '16:00', AI算力: 1100, GPU利用率: 76.2 },
  { name: '20:00', AI算力: 1256, GPU利用率: 78.4 }
];

const gpuModelsData = [
  { name: 'H100', value: 42, color: '#7F3DFF' },
  { name: 'A100', value: 28, color: '#00D4FF' },
  { name: 'H20', value: 18, color: '#0066FF' },
  { name: '其他', value: 12, color: '#475569' }
];

const userShareData = [
  { name: '企业用户', value: 46, color: '#00D4FF' },
  { name: '科研机构', value: 24, color: '#0066FF' },
  { name: '互联网', value: 18, color: '#34C759' },
  { name: '其他', value: 12, color: '#475569' }
];

const taskQueues = [
  { type: '大模型训练', count: 2847, pct: 65, color: '#00D4FF' },
  { type: 'AI 推理服务', count: 3260, pct: 75, color: '#0066FF' },
  { type: '科学计算', count: 1243, pct: 35, color: '#34C759' },
  { type: '图像渲染', count: 682, pct: 20, color: '#FF9500' },
  { type: '其他', count: 400, pct: 12, color: '#6B7280' }
];

const gpuAlarms = [
  { level: '严重', msg: '上海集群 · GPU 温度过高', count: 3, time: '14:20', color: 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/30' },
  { level: '严重', msg: '深圳集群 · GPU 节点离线', count: 2, time: '13:48', color: 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/30' },
  { level: '警告', msg: '北京集群 · 功耗异常', count: 5, time: '12:32', color: 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/30' },
  { level: '警告', msg: '成都集群 · 网络延迟高', count: 4, time: '11:05', color: 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/30' }
];

const tempRank = [
  { name: '上海集群-节点A32', temp: 78, color: '#FF3B30' },
  { name: '深圳集群-节点C17', temp: 76, color: '#FF3B30' },
  { name: '北京集群-节点B09', temp: 74, color: '#FF9500' },
  { name: '成都集群-节点D21', temp: 73, color: '#00D4FF' },
  { name: '上海集群-节点A18', temp: 72, color: '#00D4FF' }
];

const failureTrendData = [
  { date: '12/20', count: 12 },
  { date: '12/21', count: 9 },
  { date: '12/22', count: 7 },
  { date: '12/23', count: 11 },
  { date: '12/24', count: 6 },
  { date: '12/25', count: 8 },
  { date: '12/26', count: 5 }
];

// Sub-components
function KpiMiniCard({ title, value, unit, icon, color = 'text-[#00D4FF]' }: {
  title: string; value: string; unit: string; icon: React.ReactNode; color?: string;
}) {
  return (
    <div className="bg-[#030d26]/60 backdrop-blur-md border border-[#00d4ff]/25 rounded-lg p-2.5 flex justify-between items-center relative box-shadow-glow hover:border-[#00d4ff]/45 transition-all duration-300 select-none">
      <div>
        <span className="text-[11px] text-slate-400 block mb-0.5">{title}</span>
        <span className="text-lg font-bold font-mono text-white block leading-none">
          {value} <span className="text-[10px] text-slate-400 font-sans font-normal">{unit}</span>
        </span>
      </div>
      <div className={`p-1.5 rounded bg-[#00d4ff]/5 border border-[#00d4ff]/10 ${color}`}>{icon}</div>
      
      {/* Glow Corner Accents */}
      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-brand-primary pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-brand-primary pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-brand-primary pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-brand-primary pointer-events-none"></div>
    </div>
  );
}

function CompactCard({ title, children, className = '', extra }: {
  title: string; children: React.ReactNode; className?: string; extra?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-[#030d26]/60 backdrop-blur-md border border-[#00d4ff]/20 rounded-lg overflow-hidden flex flex-col relative box-shadow-glow hover:border-[#00d4ff]/45 transition-all duration-300 ${className}`}
    >
      {/* Compact Header */}
      <div className="px-3 py-1.5 border-b border-[#00d4ff]/15 bg-gradient-to-r from-brand-overlay/40 to-transparent flex items-center justify-between relative select-none">
        <div className="flex items-center">
          <div className="w-1 h-3 bg-brand-primary mr-2 rounded-full shadow-[0_0_6px_#00d4ff]" />
          <h3 className="text-[13px] font-bold text-white tracking-wider font-sans">{title}</h3>
        </div>
        {extra && (
          <div className="text-[10px] text-[#00d4ff]/80 hover:text-[#00D4FF] transition-colors cursor-pointer flex items-center z-20">
            {extra}
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
      </div>
      
      {/* Compact Body */}
      <div className="p-2.5 flex-1 flex flex-col relative z-10 min-h-0">
        {children}
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brand-primary pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-brand-primary pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-brand-primary pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brand-primary pointer-events-none"></div>
    </div>
  );
}

function ClusterTower({ color }: { color: string }) {
  return (
    <svg width="20" height="28" viewBox="0 0 24 32" className="overflow-visible drop-shadow-[0_0_6px_rgba(0,212,255,0.7)] animate-pulse">
      {/* 3D Cyber-wireframe tower */}
      <polygon points="12,2 20,8 20,24 12,30 4,24 4,8" fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1.2} />
      <line x1="12" y1="2" x2="12" y2="30" stroke={color} strokeWidth={0.6} strokeDasharray="1.5,1.5" />
      <polygon points="4,10 12,7 20,10 12,13" fill="none" stroke={color} strokeWidth={0.6} />
      <polygon points="4,17 12,14 20,17 12,20" fill="none" stroke={color} strokeWidth={0.6} />
      <polygon points="4,24 12,21 20,24 12,27" fill="none" stroke={color} strokeWidth={0.6} />
    </svg>
  );
}

function GpuChipGraphic() {
  return (
    <div className="flex flex-col items-center select-none transform -translate-x-1/2 -translate-y-1/2">
      <svg width="130" height="75" viewBox="0 0 120 70">
        <ellipse cx="60" cy="45" rx="55" ry="22" fill="none" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" strokeDasharray="4,4" />
        <ellipse cx="60" cy="45" rx="42" ry="17" fill="none" stroke="rgba(0, 212, 255, 0.12)" strokeWidth="1" />
        
        {/* 3D Chip body */}
        <polygon points="60,20 98,37 60,54 22,37" fill="#030c22" stroke="#00D4FF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.75))' }} />
        <polygon points="60,25 90,37 60,49 30,37" fill="rgba(0, 212, 255, 0.25)" stroke="#00D4FF" strokeWidth="0.8" />
        <polygon points="60,30 78,37 60,44 42,37" fill="#00D4FF" fillOpacity={0.65} />
        
        {/* Outward pins */}
        <line x1="60" y1="20" x2="60" y2="10" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity={0.6} />
        <line x1="98" y1="37" x2="108" y2="37" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity={0.6} />
        <line x1="22" y1="37" x2="12" y2="37" stroke="#00D4FF" strokeWidth="0.8" strokeOpacity={0.6} />
      </svg>
      <div className="bg-[#00D4FF]/25 border border-[#00D4FF]/50 rounded px-2.5 py-0.5 text-[9px] font-bold text-[#00D4FF] tracking-widest -mt-3.5 shadow-[0_0_8px_rgba(0,212,255,0.45)]">
        GPU
      </div>
    </div>
  );
}

function NetworkTopology() {
  const nodes = [
    { x: 50, y: 15 },
    { x: 75, y: 25 },
    { x: 85, y: 50 },
    { x: 75, y: 75 },
    { x: 50, y: 85 },
    { x: 25, y: 75 },
    { x: 15, y: 50 },
    { x: 25, y: 25 },
    { x: 50, y: 50 },
  ];
  return (
    <div className="w-[145px] h-[125px] bg-[#030d26]/80 border border-[#00d4ff]/15 rounded p-2 flex flex-col justify-between absolute bottom-4 right-4 z-20 box-shadow-glow">
      <span className="text-[9px] font-bold text-white tracking-wider">AI 网络拓扑</span>
      
      <div className="flex-1 flex items-center justify-center relative select-none">
        <svg width="65" height="65" viewBox="0 0 100 100" className="overflow-visible animate-[spin_25s_linear_infinite]">
          {nodes.map((n1, i) => 
            nodes.map((n2, j) => {
              if (i >= j) return null;
              const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
              const opacity = dist > 60 ? 0.05 : dist > 40 ? 0.15 : 0.4;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="#00D4FF"
                  strokeWidth="0.6"
                  strokeOpacity={opacity}
                />
              );
            })
          )}
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={i === 8 ? 3.5 : 2}
              fill={i === 8 ? '#FF9500' : '#00D4FF'}
              style={{ filter: `drop-shadow(0 0 3px ${i === 8 ? '#FF9500' : '#00D4FF'}88)` }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function DashboardP004() {
  return (
    <div className="h-full w-full flex flex-col justify-start gap-3.5 select-none">
      
      {/* Inline styles for custom map flow-line animation */}
      <style>{`
        @keyframes mapDash {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        .map-flow-line {
          stroke-dasharray: 4, 4;
          animation: mapDash 1.2s linear infinite;
        }
      `}</style>

      {/* Top Row: 7 KPI Cards */}
      <div className="h-[52px] w-full grid grid-cols-7 gap-3">
        <KpiMiniCard title="GPU 总数" value="52,860" unit="台" icon={<Cpu size={16} />} />
        <KpiMiniCard title="GPU 在线数" value="49,732" unit="台" icon={<Monitor size={16} />} />
        <KpiMiniCard title="GPU 利用率" value="78.4" unit="%" icon={<Activity size={16} />} />
        <KpiMiniCard title="AI 算力" value="1,256" unit="PFLOPS" icon={<Database size={16} />} />
        <KpiMiniCard title="AI 任务数" value="12,489" unit="↑" icon={<Layers size={16} />} color="text-brand-success" />
        <KpiMiniCard title="GPU 功耗" value="86.5" unit="MW" icon={<Zap size={16} />} color="text-[#FF9500]" />
        <KpiMiniCard title="液冷系统效率" value="96.8" unit="%" icon={<Droplet size={16} />} />
      </div>

      {/* Middle Row: 3 columns */}
      <div className="flex-1 min-h-0 w-full grid grid-cols-12 gap-4">
        
        {/* Left Column: 4 small stacked charts */}
        <div className="col-span-3 flex flex-col gap-2 h-full">
          {/* Card 1: GPU利用率 donut */}
          <CompactCard title="GPU 利用率" className="flex-1 min-h-0">
            <div className="flex items-center justify-between h-full w-full select-none">
              <div className="relative w-[85px] h-[85px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilizationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={26}
                      outerRadius={36}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {utilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 2px ${entry.color}77)` }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-[14px] font-bold font-mono text-white">78.4%</span>
                  <span className="text-[8px] text-slate-400 mt-1">总体利用</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-1 pl-4 text-[10px]">
                {utilizationData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-slate-200 font-mono font-bold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CompactCard>

          {/* Card 2: 算力趋势 composed area/line */}
          <CompactCard title="算力趋势" className="flex-1 min-h-0">
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={computeTrendData} margin={{ top: 5, right: -5, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                  
                  {/* Left Y for capacity, Right Y for utilization */}
                  <YAxis yAxisId="left" stroke="#00D4FF" fontSize={8} tickLine={false} axisLine={false} domain={[0, 1500]} />
                  <YAxis yAxisId="right" stroke="#FF9500" fontSize={8} tickLine={false} axisLine={false} domain={[0, 100]} orientation="right" />
                  
                  <Tooltip
                    contentStyle={{ backgroundColor: '#02091c', borderColor: 'rgba(0, 212, 255, 0.2)', color: '#fff', fontSize: 10 }}
                  />
                  <defs>
                    <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <Area yAxisId="left" type="monotone" dataKey="AI算力" stroke="#00D4FF" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCompute)" />
                  <Line yAxisId="right" type="monotone" dataKey="GPU利用率" stroke="#FF9500" strokeWidth={1.5} dot={{ r: 1 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CompactCard>

          {/* Card 3: GPU型号占比 donut */}
          <CompactCard title="GPU 型号占比" className="flex-1 min-h-0">
            <div className="flex items-center justify-between h-full w-full select-none">
              <div className="relative w-[85px] h-[85px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gpuModelsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={26}
                      outerRadius={36}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {gpuModelsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 2px ${entry.color}77)` }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-[13px] font-bold font-mono text-white">H100</span>
                  <span className="text-[8px] text-slate-400 mt-1">42%</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-1 pl-4 text-[10px]">
                {gpuModelsData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-slate-200 font-mono font-bold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CompactCard>

          {/* Card 4: 用户资源占比 donut */}
          <CompactCard title="用户资源占比" className="flex-1 min-h-0">
            <div className="flex items-center justify-between h-full w-full select-none">
              <div className="relative w-[85px] h-[85px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={26}
                      outerRadius={36}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {userShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 2px ${entry.color}77)` }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-[12px] font-bold font-mono text-white">企业</span>
                  <span className="text-[8px] text-slate-400 mt-1">46%</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-1 pl-4 text-[10px]">
                {userShareData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-slate-200 font-mono font-bold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CompactCard>
        </div>

        {/* Center Column: Interactive China Map with computing towers and 3D GPU chip */}
        <div className="col-span-6 flex flex-col gap-4 h-full relative">
          <Card title="智算集群分布与流向" className="h-full w-full min-h-0">
            
            <div className="flex-1 relative w-full h-full flex items-center justify-center bg-radial from-[#041530]/20 to-transparent rounded overflow-hidden select-none">
              
              {/* Outer boundary frame */}
              <div className="w-[740px] h-[540px] relative shrink-0">
                
                {/* 1. Vector China Map outline - scaled height to leave space at the bottom */}
                <ChinaMap className="w-full h-[85%] absolute top-0 left-0 opacity-80" />

                {/* 2. Connection flow lines SVG overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* From bottom GPU chip (50, 91) to cluster spots */}
                  {/* Beijing: (66, 32) */}
                  <path d="M 50,91 Q 58,61.5 66,32" fill="none" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.85" className="map-flow-line" />
                  {/* Shanghai: (70, 44) */}
                  <path d="M 50,91 Q 63,67.5 70,44" fill="none" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.85" className="map-flow-line" />
                  {/* Shenzhen: (61, 61) */}
                  <path d="M 50,91 Q 55.5,76 61,61" fill="none" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.85" className="map-flow-line" />
                  {/* Chengdu: (42, 47) */}
                  <path d="M 50,91 Q 46,69 42,47" fill="none" stroke="#00D4FF" strokeWidth="0.4" strokeOpacity="0.85" className="map-flow-line" />
                </svg>

                {/* 3. 3D Cluster Towers at the spots */}
                <div className="absolute left-[66%] top-[26%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <ClusterTower color="#00D4FF" />
                </div>
                <div className="absolute left-[70%] top-[38%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <ClusterTower color="#00D4FF" />
                </div>
                <div className="absolute left-[61%] top-[55%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <ClusterTower color="#00D4FF" />
                </div>
                <div className="absolute left-[42%] top-[41%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <ClusterTower color="#00D4FF" />
                </div>

                {/* 4. Computing cluster HTML info overlays */}
                {/* Beijing */}
                <div className="absolute left-[66%] top-[32%] -translate-x-1/2 z-30 pointer-events-auto">
                  <div className="flex flex-col items-center bg-[#030d26]/85 border border-[#00d4ff]/25 rounded px-2 py-1 shadow-lg hover:border-[#00D4FF] hover:scale-105 transition-all duration-300">
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">北京智算集群</span>
                    <span className="text-[8px] text-slate-400 whitespace-nowrap mt-0.5">GPU: 8,960 台</span>
                    <span className="text-[8px] text-[#00D4FF] font-mono whitespace-nowrap">算力: 214 PFLOPS</span>
                    <span className="text-[8px] text-brand-success font-mono whitespace-nowrap">利用率: 82.6%</span>
                  </div>
                </div>

                {/* Shanghai */}
                <div className="absolute left-[70%] top-[44%] -translate-x-1/2 z-30 pointer-events-auto">
                  <div className="flex flex-col items-center bg-[#030d26]/85 border border-[#00d4ff]/25 rounded px-2 py-1 shadow-lg hover:border-[#00D4FF] hover:scale-105 transition-all duration-300">
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">华东 (上海)</span>
                    <span className="text-[8px] text-slate-400 whitespace-nowrap mt-0.5">GPU: 12,560 台</span>
                    <span className="text-[8px] text-[#00D4FF] font-mono whitespace-nowrap">算力: 298 PFLOPS</span>
                    <span className="text-[8px] text-brand-success font-mono whitespace-nowrap">利用率: 80.4%</span>
                  </div>
                </div>

                {/* Shenzhen */}
                <div className="absolute left-[61%] top-[61%] -translate-x-1/2 z-30 pointer-events-auto">
                  <div className="flex flex-col items-center bg-[#030d26]/85 border border-[#00d4ff]/25 rounded px-2 py-1 shadow-lg hover:border-[#00D4FF] hover:scale-105 transition-all duration-300">
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">华南 (深圳)</span>
                    <span className="text-[8px] text-slate-400 whitespace-nowrap mt-0.5">GPU: 9,320 台</span>
                    <span className="text-[8px] text-[#00D4FF] font-mono whitespace-nowrap">算力: 236 PFLOPS</span>
                    <span className="text-[8px] text-brand-success font-mono whitespace-nowrap">利用率: 79.9%</span>
                  </div>
                </div>

                {/* Chengdu */}
                <div className="absolute left-[42%] top-[47%] -translate-x-1/2 z-30 pointer-events-auto">
                  <div className="flex flex-col items-center bg-[#030d26]/85 border border-[#00d4ff]/25 rounded px-2 py-1 shadow-lg hover:border-[#00D4FF] hover:scale-105 transition-all duration-300">
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">西部 (成都)</span>
                    <span className="text-[8px] text-slate-400 whitespace-nowrap mt-0.5">GPU: 6,480 台</span>
                    <span className="text-[8px] text-[#00D4FF] font-mono whitespace-nowrap">算力: 181 PFLOPS</span>
                    <span className="text-[8px] text-brand-success font-mono whitespace-nowrap">利用率: 76.8%</span>
                  </div>
                </div>

                {/* 5. Giant GPU chip at the bottom-center */}
                <div className="absolute left-[50%] top-[91%] z-20 pointer-events-auto">
                  <GpuChipGraphic />
                </div>

                {/* 6. Dynamic network topology overlay panel */}
                <NetworkTopology />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI tasks, GPU alert, ranks, failure bar */}
        <div className="col-span-3 flex flex-col gap-2 h-full">
          
          {/* Card 1: AI Task Queue progress bars */}
          <CompactCard title="AI 任务队列" className="flex-1 min-h-0" extra={<span className="text-slate-400 text-[10px]">进行中 / 总数: 8,432</span>}>
            <div className="flex flex-col justify-between h-full select-none py-0.5 gap-1.5">
              {taskQueues.map((item) => (
                <div key={item.type} className="flex flex-col">
                  <div className="flex justify-between items-center text-xs text-white">
                    <span>{item.type}</span>
                    <span className="font-mono font-bold text-slate-300">
                      {item.count.toLocaleString()}<span className="text-[9px] text-slate-500 font-sans font-normal ml-0.5">个</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0b1e36] rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 3px ${item.color}`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CompactCard>

          {/* Card 2: GPU Alarms warning list */}
          <CompactCard title="GPU 告警" className="flex-1 min-h-0" extra={<span className="text-brand-danger text-[10px] font-bold">今日告警: 23</span>}>
            <div className="flex flex-col justify-between h-full select-none gap-1">
              {gpuAlarms.map((alarm, idx) => (
                <div key={idx} className={`flex items-center justify-between p-1.5 rounded border text-[10px] ${alarm.color}`}>
                  <div className="flex items-center gap-1.5 w-[75%]">
                    <span className={`px-1 py-0.5 rounded text-[8px] font-bold border ${
                      alarm.level === '严重' ? 'bg-[#FF3B30]/20 border-[#FF3B30]' : 'bg-[#FF9500]/20 border-[#FF9500]'
                    }`}>
                      {alarm.level}
                    </span>
                    <span className="text-slate-200 truncate font-medium">{alarm.msg}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-right w-[10%] font-bold">{alarm.count}条</span>
                  <span className="font-mono text-slate-500 text-right w-[15%]">{alarm.time}</span>
                </div>
              ))}
            </div>
          </CompactCard>

          {/* Card 3: GPU temperature ranking */}
          <CompactCard title="GPU 温度排行" className="flex-1 min-h-0" extra={<span className="text-slate-500 text-[10px]">单位: °C</span>}>
            <div className="flex flex-col justify-between h-full select-none py-0.5 gap-1.5">
              {tempRank.map((item, idx) => (
                <div key={item.name} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-xs text-white leading-none">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-mono font-bold ${
                        idx < 2 ? 'bg-[#FF3B30] text-white' : idx === 2 ? 'bg-[#FF9500] text-[#020a1c]' : 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00d4ff]/30'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 font-medium truncate max-w-[110px]">{item.name}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">{item.temp}°C</span>
                  </div>
                  
                  {/* Temp progress bar */}
                  <div className="w-full h-1.5 bg-[#0b1e36] rounded-full overflow-hidden mt-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.temp / 100) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 3px ${item.color}`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CompactCard>

          {/* Card 4: failure statistics bar chart */}
          <CompactCard title="GPU 故障统计" className="flex-1 min-h-0" extra={<span className="text-slate-500 text-[10px]">近7天</span>}>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureTrendData} margin={{ top: 5, right: 0, left: -32, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} domain={[0, 15]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#02091c', borderColor: 'rgba(0, 212, 255, 0.2)', color: '#fff', fontSize: 10 }}
                  />
                  <Bar dataKey="count" name="故障数" fill="#00D4FF" radius={[3, 3, 0, 0]} style={{ filter: 'drop-shadow(0 0 2px rgba(0, 212, 255, 0.6))' }}>
                    {failureTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.count > 10 ? '#FF3B30' : entry.count > 7 ? '#FF9500' : '#00D4FF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CompactCard>
        </div>
      </div>

      {/* Bottom Bar: 8 real-time sensors */}
      <div className="h-[75px] w-full bg-[#030d26]/60 backdrop-blur-md border border-[#00d4ff]/20 rounded-lg p-2.5 flex items-center justify-between gap-3 relative box-shadow-glow">
        
        {/* Label Left */}
        <div className="w-[100px] border-r border-[#00d4ff]/25 flex flex-col justify-center select-none shrink-0 leading-tight">
          <span className="text-white text-xs font-bold tracking-wider">实时监测</span>
          <span className="text-[#00D4FF] text-[14px] font-bold font-mono tracking-wider">DATA</span>
        </div>

        {/* 8 dynamic sensor items */}
        <div className="flex-1 flex justify-between gap-3 items-center select-none overflow-hidden h-full">
          {[
            { label: 'GPU 在线数量', val: '49,732', unit: '台', icon: <Cpu size={14} className="text-[#00D4FF]" /> },
            { label: 'AI 训练任务', val: '4,289', unit: '个', icon: <Activity size={14} className="text-brand-success" /> },
            { label: '推理任务', val: '8,200', unit: '个', icon: <Layers size={14} className="text-[#0066FF]" /> },
            { label: '网络带宽', val: '3.2', unit: 'Tbps', icon: <Globe size={14} className="text-[#00D4FF]" /> },
            { label: 'InfiniBand 状态', val: '正常', unit: '', icon: <Zap size={14} className="text-[#34C759]" /> },
            { label: '液冷温度', val: '28.6', unit: '°C', icon: <Droplet size={14} className="text-[#FF9500]" /> },
            { label: '今日资源申请', val: '1,842', unit: '次', icon: <FileText size={14} className="text-[#00D4FF]" /> },
            { label: '算力交付率', val: '98.7', unit: '%', icon: <ShieldCheck size={14} className="text-[#34C759]" /> }
          ].map((sensor) => (
            <div key={sensor.label} className="flex items-center gap-2 flex-1 justify-center bg-[#00d4ff]/3 border border-[#00d4ff]/10 hover:border-[#00d4ff]/25 rounded py-1 px-1.5 transition-colors h-full">
              <div className="p-1 rounded bg-[#00d4ff]/5 border border-[#00d4ff]/10 shrink-0">
                {sensor.icon}
              </div>
              <div className="flex flex-col shrink-0">
                <span className="text-[9px] text-slate-400 block leading-none">{sensor.label}</span>
                <div className="flex items-baseline gap-0.5 mt-0.5 leading-none">
                  <span className="text-[12px] font-bold font-mono text-white leading-none">
                    {sensor.val}
                  </span>
                  {sensor.unit && <span className="text-[8px] text-slate-400 font-sans leading-none">{sensor.unit}</span>}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1 h-1 rounded-full bg-[#34C759] animate-pulse" />
                  <span className="text-[8px] text-[#34C759] font-medium leading-none">正常</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small corner neon lines */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brand-primary pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-brand-primary pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-brand-primary pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brand-primary pointer-events-none"></div>
      </div>
    </div>
  );
}
