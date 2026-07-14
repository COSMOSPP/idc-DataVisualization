import React, { useState } from 'react';
import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  Server, 
  Database, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  FileText, 
  CheckCircle, 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap, 
  Clock,
  Gauge,
  Snowflake,
  Flame,
  Lock,
  Video
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock Data
const alarmTrendData = [
  { name: '05-14', 严重: 15, 一般: 40, 提示: 80 },
  { name: '05-15', 严重: 20, 一般: 52, 提示: 95 },
  { name: '05-16', 严重: 12, 一般: 45, 提示: 75 },
  { name: '05-17', 严重: 25, 一般: 60, 提示: 110 },
  { name: '05-18', 严重: 18, 一般: 48, 提示: 85 },
  { name: '05-19', 严重: 22, 一般: 55, 提示: 90 },
  { name: '05-20', 严重: 28, 一般: 132, 提示: 300 }
];

const alarmLevelData = [
  { name: '严重', value: 28, color: '#FF3B30', pct: '6.1%' },
  { name: '一般', value: 132, color: '#FF9500', pct: '28.7%' },
  { name: '提示', value: 300, color: '#00D4FF', pct: '65.2%' }
];

const alarmTop5 = [
  { type: '电力异常', count: 112, pct: 24.3, color: '#FF3B30' },
  { type: '温度异常', count: 96, pct: 20.9, color: '#FF9500' },
  { type: '网络异常', count: 84, pct: 18.3, color: '#00D4FF' },
  { type: 'UPS异常', count: 68, pct: 14.8, color: '#0066FF' },
  { type: '空调异常', count: 62, pct: 13.5, color: '#34C759' }
];

const systemStatusData = [
  { name: '正常运行', value: 6, color: '#0066FF', pct: '75%' },
  { name: '运行中', value: 1, color: '#34C759', pct: '12.5%' },
  { name: '告警中', value: 1, color: '#FF9500', pct: '12.5%' },
  { name: '离线', value: 0, color: '#6B7280', pct: '0%' }
];

const workorderTrendData = [
  { name: '05-14', 创建: 32, 完成: 25, 超时: 3 },
  { name: '05-15', 创建: 40, 完成: 32, 超时: 4 },
  { name: '05-16', 创建: 45, 完成: 38, 超时: 5 },
  { name: '05-17', 创建: 36, 完成: 30, 超时: 2 },
  { name: '05-18', 创建: 52, 完成: 44, 超时: 6 },
  { name: '05-19', 创建: 58, 完成: 48, 超时: 7 },
  { name: '05-20', 创建: 68, 完成: 28, 超时: 8 }
];

// Room Floor Plan Data
const rooms = [
  { id: 'dfg', name: '柴油发电机房', status: '正常', level: 'success', x: 400, y: 100 },
  { id: 'lzs', name: '冷冻站', status: '运行中', level: 'success', x: 522, y: 170 },
  { id: 'pds', name: '配电室', status: '正常', level: 'success', x: 645, y: 240 },
  { id: 'mra', name: '机房A', status: '▲ 告警 3', level: 'danger', x: 312, y: 190 },
  { id: 'mrb', name: '机房B', status: '正常', level: 'success', x: 487, y: 290 },
  { id: 'bgc', name: '办公室区', status: '正常', level: 'success', x: 172, y: 250 },
  { id: 'jkz', name: '监控中心', status: '正常', level: 'success', x: 295, y: 320 },
  { id: 'mrc', name: '机房C', status: '▲ 告警 2', level: 'warning', x: 400, y: 380 },
];

const cabinets = [
  // Room A (Alarm - Red)
  { x: 1.0, y: 3.5, color: '#FF3B30' },
  { x: 1.0, y: 4.5, color: '#FF3B30' },
  { x: 1.0, y: 5.5, color: '#FF3B30' },
  { x: 2.2, y: 3.5, color: '#FF3B30' },
  { x: 2.2, y: 4.5, color: '#FF3B30' },
  { x: 2.2, y: 5.5, color: '#FF3B30' },
  { x: 3.4, y: 3.5, color: '#FF3B30' },
  { x: 3.4, y: 4.5, color: '#FF3B30' },
  { x: 3.4, y: 5.5, color: '#FF3B30' },

  // Room B (Normal - Cyan)
  { x: 6.0, y: 3.5, color: '#00D4FF' },
  { x: 6.0, y: 4.5, color: '#00D4FF' },
  { x: 6.0, y: 5.5, color: '#00D4FF' },
  { x: 7.2, y: 3.5, color: '#00D4FF' },
  { x: 7.2, y: 4.5, color: '#00D4FF' },
  { x: 7.2, y: 5.5, color: '#00D4FF' },
  { x: 8.4, y: 3.5, color: '#00D4FF' },
  { x: 8.4, y: 4.5, color: '#00D4FF' },
  { x: 8.4, y: 5.5, color: '#00D4FF' },

  // Room C (Alarm - Yellow)
  { x: 7.5, y: 7.5, color: '#FF9500' },
  { x: 7.5, y: 8.5, color: '#FF9500' },
  { x: 8.7, y: 7.5, color: '#FF9500' },
  { x: 8.7, y: 8.5, color: '#FF9500' },

  // 柴油发电机房 (Normal - Cyan)
  { x: 1.0, y: 1.0, color: '#00D4FF' },
  { x: 1.0, y: 2.0, color: '#00D4FF' },

  // 配电室 (Normal - Cyan)
  { x: 8.0, y: 1.0, color: '#00D4FF' },
  { x: 8.0, y: 2.0, color: '#00D4FF' },
];

// Helper components
function KpiDoubleCard({
  titleLeft, valueLeft, unitLeft, trendLeft, isUpLeft, iconLeft,
  titleRight, valueRight, unitRight, trendRight, isUpRight, iconRight
}: {
  titleLeft: string; valueLeft: string; unitLeft: string; trendLeft: string; isUpLeft?: boolean; iconLeft?: React.ReactNode;
  titleRight: string; valueRight: string; unitRight: string; trendRight: string; isUpRight?: boolean; iconRight?: React.ReactNode;
}) {
  return (
    <div className="bg-[#030d26]/60 backdrop-blur-md border border-[#00d4ff]/20 rounded-lg p-3 flex justify-between relative box-shadow-glow hover:border-[#00d4ff]/40 transition-all duration-300">
      {/* Left Metric */}
      <div className="flex-1 flex justify-between items-center pr-3 border-r border-[#00d4ff]/10">
        <div>
          <span className="text-[12px] text-slate-400 block mb-0.5">{titleLeft}</span>
          <span className="text-xl font-bold font-mono text-white block leading-none">
            {valueLeft} <span className="text-[11px] text-slate-400 font-sans font-normal">{unitLeft}</span>
          </span>
          <span className={`text-[10px] block mt-1.5 font-sans ${isUpLeft ? 'text-brand-danger' : 'text-brand-success'}`}>
            {trendLeft}
          </span>
        </div>
        {iconLeft && <div className="p-1.5 rounded bg-[#00d4ff]/5 border border-[#00d4ff]/10">{iconLeft}</div>}
      </div>
      
      {/* Right Metric */}
      <div className="flex-1 flex justify-between items-center pl-3">
        <div>
          <span className="text-[12px] text-slate-400 block mb-0.5">{titleRight}</span>
          <span className="text-xl font-bold font-mono text-white block leading-none">
            {valueRight} <span className="text-[11px] text-slate-400 font-sans font-normal">{unitRight}</span>
          </span>
          <span className={`text-[10px] block mt-1.5 font-sans ${isUpRight ? 'text-brand-danger' : 'text-brand-success'}`}>
            {trendRight}
          </span>
        </div>
        {iconRight && <div className="p-1.5 rounded bg-[#00d4ff]/5 border border-[#00d4ff]/10">{iconRight}</div>}
      </div>

      {/* Corners */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brand-primary pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-brand-primary pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-brand-primary pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brand-primary pointer-events-none"></div>
    </div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const r = 55;
  const strokeWidth = 10;
  const cx = 80;
  const cy = 75;
  const circ = Math.PI * r;
  const strokeDasharray = `${circ} ${circ}`;
  const strokeDashoffset = circ - (score / 100) * circ;
  const needleRotation = -180 + (score / 100) * 180;
  
  return (
    <div className="flex items-center justify-between h-full w-full">
      <div className="relative w-[150px] h-[90px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 160 90">
          {/* Background track */}
          <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke="#0b1e36"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active track */}
          <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))' }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF3B30" />
              <stop offset="30%" stopColor="#FF9500" />
              <stop offset="70%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#34C759" />
            </linearGradient>
          </defs>
          <g transform={`translate(${cx}, ${cy}) rotate(${needleRotation})`}>
            <line
              x1="0"
              y1="0"
              x2={-r + 5}
              y2="0"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }}
            />
            <circle cx="0" cy="0" r="4" fill="#FFF" />
          </g>
        </svg>
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">{score}</span>
          <span className="text-[11px] text-[#34C759] font-medium bg-[#34C759]/10 px-1.5 py-0.5 rounded border border-[#34C759]/20 -mt-0.5">健康</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 pr-2 text-[11px] select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#34C759]" />
          <span className="text-slate-400 w-14">优秀设备</span>
          <span className="text-slate-200 font-mono w-10 text-right">24,526</span>
          <span className="text-slate-500 font-mono text-right">(74.6%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />
          <span className="text-slate-400 w-14">良好设备</span>
          <span className="text-slate-200 font-mono w-10 text-right">6,032</span>
          <span className="text-slate-500 font-mono text-right">(18.3%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF9500]" />
          <span className="text-slate-400 w-14">一般设备</span>
          <span className="text-slate-200 font-mono w-10 text-right">1,856</span>
          <span className="text-slate-500 font-mono text-right">(5.6%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF3B30]" />
          <span className="text-slate-400 w-14">差设备</span>
          <span className="text-slate-200 font-mono w-10 text-right">442</span>
          <span className="text-slate-500 font-mono text-right">(1.5%)</span>
        </div>
      </div>
    </div>
  );
}

function MiniProgressRing({ percent, color }: { percent: number; color: string }) {
  const size = 36;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0b1e36"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 2px ${color}aa)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-white text-[9px]">
        {percent}%
      </div>
    </div>
  );
}

export default function DashboardP005() {
  const [activeTab, setActiveTab] = useState<string>('配电系统');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const tabs = ['配电系统', 'UPS系统', '空调系统', '网络系统', '安防系统', '消防系统', '环境系统', 'IT设备'];

  // Isometric 2D projection converter
  const toSvg = (x: number, y: number) => {
    const x0 = 400;
    const y0 = 35; // shifted up slightly to give space for labels
    const scaleX = 35;
    const scaleY = 20;
    return `${x0 + (x - y) * scaleX},${y0 + (x + y) * scaleY}`;
  };

  return (
    <div className="h-full w-full flex flex-col justify-between gap-4 select-none">
      {/* Top Row: 4 Double KPI Cards */}
      <div className="h-[102px] w-full grid grid-cols-4 gap-4">
        <KpiDoubleCard
          titleLeft="设备总数"
          valueLeft="32,856"
          unitLeft="台"
          trendLeft="同比 ↑ 8.6%"
          isUpLeft={true}
          iconLeft={<Server className="text-[#00D4FF]" size={18} />}
          titleRight="在线设备"
          valueRight="30,568"
          unitRight="台"
          trendRight="在线率 93.0%"
          isUpRight={false}
          iconRight={<Database className="text-[#0066FF]" size={18} />}
        />
        <KpiDoubleCard
          titleLeft="告警总数"
          valueLeft="460"
          unitLeft="条"
          trendLeft="同比 ↓ 12.6%"
          isUpLeft={false}
          iconLeft={<ShieldAlert className="text-[#FF3B30]" size={18} />}
          titleRight="严重告警"
          valueRight="28"
          unitRight="条"
          trendRight="同比 ↓ 20.8%"
          isUpRight={false}
          iconRight={<AlertTriangle className="text-[#FF9500]" size={18} />}
        />
        <KpiDoubleCard
          titleLeft="一般告警"
          valueLeft="132"
          unitLeft="条"
          trendLeft="同比 ↓ 8.2%"
          isUpLeft={false}
          iconLeft={<AlertTriangle className="text-[#FF9500]" size={18} />}
          titleRight="提示告警"
          valueRight="300"
          unitRight="条"
          trendRight="同比 ↓ 9.3%"
          isUpRight={false}
          iconRight={<Info className="text-[#00D4FF]" size={18} />}
        />
        <KpiDoubleCard
          titleLeft="工单总数"
          valueLeft="328"
          unitLeft="单"
          trendLeft="同比 ↑ 6.5%"
          isUpLeft={true}
          iconLeft={<FileText className="text-[#00D4FF]" size={18} />}
          titleRight="待处理工单"
          valueRight="68"
          unitRight="单"
          trendRight="同比 ↓ 10.2%"
          isUpRight={false}
          iconRight={<CheckCircle className="text-[#34C759]" size={18} />}
        />
      </div>

      {/* Middle Row: Left, Center, Right Columns */}
      <div className="h-[685px] w-full grid grid-cols-12 gap-4">
        {/* Left Column: Alarm details */}
        <div className="col-span-3 flex flex-col gap-4 h-full">
          {/* Chart 1: Alarm Trend */}
          <Card title="告警趋势 (近7天)" className="flex-1 min-h-0">
            {/* Custom Legend */}
            <div className="flex gap-4 text-xs justify-end mb-1 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]" />
                <span className="text-slate-400">严重</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF9500]" />
                <span className="text-slate-400">一般</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
                <span className="text-slate-400">提示</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alarmTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} domain={[0, 320]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#02091c', borderColor: 'rgba(0, 212, 255, 0.2)', color: '#fff' }}
                    labelStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="严重" stroke="#FF3B30" strokeWidth={2} dot={{ r: 1.5 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="一般" stroke="#FF9500" strokeWidth={2} dot={{ r: 1.5 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="提示" stroke="#00D4FF" strokeWidth={2} dot={{ r: 1.5 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Alarm level distribution */}
          <Card title="告警级别分布" className="flex-1 min-h-0">
            <div className="flex items-center justify-between h-full w-full">
              <div className="relative w-[120px] h-[120px] flex items-center justify-center select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alarmLevelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={52}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {alarmLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 3px ${entry.color}88)` }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[10px] text-slate-400">总数</span>
                  <span className="text-[16px] font-bold font-mono text-white leading-none mt-0.5">460</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">条</span>
                </div>
              </div>
              
              {/* Legend List */}
              <div className="flex-1 flex flex-col gap-1.5 pl-4 text-xs select-none">
                {alarmLevelData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-slate-200 font-mono font-bold">{entry.value}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({entry.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Chart 3: Alarm types top 5 */}
          <Card title="告警类型 TOP5" className="flex-1 min-h-0">
            <div className="flex flex-col justify-between h-full select-none">
              {/* Table Header */}
              <div className="flex text-[11px] text-slate-400 border-b border-[#00d4ff]/10 pb-1.5 mb-1.5 font-medium">
                <span className="w-[45%]">告警类型</span>
                <span className="w-[25%] text-right">数量</span>
                <span className="w-[30%] text-right">占比</span>
              </div>
              {/* List Content */}
              <div className="flex-1 flex flex-col justify-between gap-1">
                {alarmTop5.map((item, idx) => (
                  <div key={item.type} className="flex flex-col gap-0.5 relative group">
                    <div className="flex items-center text-xs text-white z-10">
                      <span className="w-[45%] flex items-center gap-2">
                        <span className="font-mono text-[10px] w-4 h-4 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/25 flex items-center justify-center text-[#00d4ff]">
                          {idx + 1}
                        </span>
                        {item.type}
                      </span>
                      <span className="w-[25%] text-right font-mono font-bold text-slate-200">{item.count}</span>
                      <span className="w-[30%] text-right font-mono text-slate-400">{item.pct}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-[3px] bg-[#0b1e36] rounded-full overflow-hidden mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: `0 0 4px ${item.color}`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Center Column: Main monitoring view & Subsystem status */}
        <div className="col-span-6 flex flex-col gap-4 h-full">
          {/* Isometric room floor map */}
          <Card 
            title="运维监控总览" 
            className="flex-1 min-h-0"
            extra={
              <div className="flex space-x-1.5 bg-[#030d26]/80 p-0.5 rounded border border-[#00d4ff]/10">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 text-[11px] rounded transition-all duration-200 cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-[#00D4FF] text-[#020a1c] font-bold shadow-[0_0_8px_rgba(0,212,255,0.5)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            }
          >
            {/* Holographic 3D Blueprint layout container */}
            <div className="flex-1 relative flex items-center justify-center bg-radial from-[#041530]/20 to-transparent rounded overflow-hidden select-none">
              
              {/* Outer boundary box */}
              <div className="w-[800px] h-[450px] relative shrink-0">
                
                {/* SVG Drawing Layer */}
                <svg className="w-full h-full absolute inset-0 pointer-events-auto" viewBox="0 0 800 450">
                  {/* Grid Lines */}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <React.Fragment key={i}>
                      {/* Grid X */}
                      <line
                        x1={toSvg(i, 0).split(',')[0]}
                        y1={toSvg(i, 0).split(',')[1]}
                        x2={toSvg(i, 10).split(',')[0]}
                        y2={toSvg(i, 10).split(',')[1]}
                        stroke="rgba(0, 212, 255, 0.08)"
                        strokeWidth="1"
                      />
                      {/* Grid Y */}
                      <line
                        x1={toSvg(0, i).split(',')[0]}
                        y1={toSvg(0, i).split(',')[1]}
                        x2={toSvg(10, i).split(',')[0]}
                        y2={toSvg(10, i).split(',')[1]}
                        stroke="rgba(0, 212, 255, 0.08)"
                        strokeWidth="1"
                      />
                    </React.Fragment>
                  ))}

                  {/* Room Areas: Drawn as SVG Polygons */}
                  {/* 1. 柴油发电机房: (0,0) to (3,3) */}
                  <polygon
                    points={`${toSvg(0, 0)} ${toSvg(3, 0)} ${toSvg(3, 3)} ${toSvg(0, 3)}`}
                    fill={hoveredRoom === 'dfg' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(0, 212, 255, 0.03)'}
                    stroke={hoveredRoom === 'dfg' ? '#00D4FF' : 'rgba(0, 212, 255, 0.35)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('dfg')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 2. 冷冻站: (3,0) to (7,3) */}
                  <polygon
                    points={`${toSvg(3, 0)} ${toSvg(7, 0)} ${toSvg(7, 3)} ${toSvg(3, 3)}`}
                    fill={hoveredRoom === 'lzs' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(0, 212, 255, 0.03)'}
                    stroke={hoveredRoom === 'lzs' ? '#00D4FF' : 'rgba(0, 212, 255, 0.35)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('lzs')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 3. 配电室: (7,0) to (10,3) */}
                  <polygon
                    points={`${toSvg(7, 0)} ${toSvg(10, 0)} ${toSvg(10, 3)} ${toSvg(7, 3)}`}
                    fill={hoveredRoom === 'pds' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(0, 212, 255, 0.03)'}
                    stroke={hoveredRoom === 'pds' ? '#00D4FF' : 'rgba(0, 212, 255, 0.35)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('pds')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 4. 机房A: (0,3) to (5,7) */}
                  <polygon
                    points={`${toSvg(0, 3)} ${toSvg(5, 3)} ${toSvg(5, 7)} ${toSvg(0, 7)}`}
                    fill={hoveredRoom === 'mra' ? 'rgba(255, 59, 48, 0.16)' : 'rgba(255, 59, 48, 0.08)'}
                    stroke={hoveredRoom === 'mra' ? '#FF3B30' : 'rgba(255, 59, 48, 0.4)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('mra')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 5. 机房B: (5,3) to (10,7) */}
                  <polygon
                    points={`${toSvg(5, 3)} ${toSvg(10, 3)} ${toSvg(10, 7)} ${toSvg(5, 7)}`}
                    fill={hoveredRoom === 'mrb' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(0, 212, 255, 0.03)'}
                    stroke={hoveredRoom === 'mrb' ? '#00D4FF' : 'rgba(0, 212, 255, 0.35)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('mrb')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 6. 办公室区: (0,7) to (4,10) */}
                  <polygon
                    points={`${toSvg(0, 7)} ${toSvg(4, 7)} ${toSvg(4, 10)} ${toSvg(0, 10)}`}
                    fill={hoveredRoom === 'bgc' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(0, 212, 255, 0.03)'}
                    stroke={hoveredRoom === 'bgc' ? '#00D4FF' : 'rgba(0, 212, 255, 0.35)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('bgc')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 7. 监控中心: (4,7) to (7,10) */}
                  <polygon
                    points={`${toSvg(4, 7)} ${toSvg(7, 7)} ${toSvg(7, 10)} ${toSvg(4, 10)}`}
                    fill={hoveredRoom === 'jkz' ? 'rgba(0, 212, 255, 0.12)' : 'rgba(0, 212, 255, 0.03)'}
                    stroke={hoveredRoom === 'jkz' ? '#00D4FF' : 'rgba(0, 212, 255, 0.35)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('jkz')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />
                  {/* 8. 机房C: (7,7) to (10,10) */}
                  <polygon
                    points={`${toSvg(7, 7)} ${toSvg(10, 7)} ${toSvg(10, 10)} ${toSvg(7, 10)}`}
                    fill={hoveredRoom === 'mrc' ? 'rgba(255, 149, 0, 0.16)' : 'rgba(255, 149, 0, 0.08)'}
                    stroke={hoveredRoom === 'mrc' ? '#FF9500' : 'rgba(255, 149, 0, 0.4)'}
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRoom('mrc')}
                    onMouseLeave={() => setHoveredRoom(null)}
                  />

                  {/* Render 3D Cabinets inside Rooms */}
                  {cabinets.map((cab, index) => {
                    const dx = 0.55;
                    const dy = 0.55;
                    const h = 24; // Height in pixels
                    
                    const f1Coords = toSvg(cab.x, cab.y).split(',').map(Number);
                    const f2Coords = toSvg(cab.x + dx, cab.y).split(',').map(Number);
                    const f3Coords = toSvg(cab.x + dx, cab.y + dy).split(',').map(Number);
                    const f4Coords = toSvg(cab.x, cab.y + dy).split(',').map(Number);
                    
                    const f1 = { x: f1Coords[0], y: f1Coords[1] };
                    const f2 = { x: f2Coords[0], y: f2Coords[1] };
                    const f3 = { x: f3Coords[0], y: f3Coords[1] };
                    const f4 = { x: f4Coords[0], y: f4Coords[1] };
                    
                    const t1 = { x: f1.x, y: f1.y - h };
                    const t2 = { x: f2.x, y: f2.y - h };
                    const t3 = { x: f3.x, y: f3.y - h };
                    const t4 = { x: f4.x, y: f4.y - h };
                    
                    return (
                      <g key={`cab-${index}`} className="opacity-80 hover:opacity-100 transition-opacity duration-300">
                        {/* Top Face */}
                        <polygon
                          points={`${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                          fill={cab.color}
                          fillOpacity={0.4}
                          stroke={cab.color}
                          strokeWidth={0.5}
                        />
                        {/* Left Front Face */}
                        <polygon
                          points={`${f1.x},${f1.y} ${f4.x},${f4.y} ${t4.x},${t4.y} ${t1.x},${t1.y}`}
                          fill={cab.color}
                          fillOpacity={0.2}
                          stroke={cab.color}
                          strokeWidth={0.5}
                        />
                        {/* Right Front Face */}
                        <polygon
                          points={`${f4.x},${f4.y} ${f3.x},${f3.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                          fill={cab.color}
                          fillOpacity={0.35}
                          stroke={cab.color}
                          strokeWidth={0.5}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Status Pins Overlay */}
                {rooms.map((room) => {
                  const isHovered = hoveredRoom === room.id;
                  
                  let dotGlowClass = 'pulse-glow-green bg-[#34C759]';
                  let statusColor = 'text-[#34C759]';
                  let badgeBg = 'bg-[#34C759]/10 border-[#34C759]/30';
                  
                  if (room.level === 'danger') {
                    dotGlowClass = 'pulse-glow-red bg-[#FF3B30]';
                    statusColor = 'text-[#FF3B30]';
                    badgeBg = 'bg-[#FF3B30]/15 border-[#FF3B30]/40';
                  } else if (room.level === 'warning') {
                    dotGlowClass = 'pulse-glow-yellow bg-[#FF9500]';
                    statusColor = 'text-[#FF9500]';
                    badgeBg = 'bg-[#FF9500]/15 border-[#FF9500]/40';
                  }

                  return (
                    <div 
                      key={room.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 pointer-events-auto z-20"
                      style={{ left: room.x, top: room.y }}
                      onMouseEnter={() => setHoveredRoom(room.id)}
                      onMouseLeave={() => setHoveredRoom(null)}
                    >
                      {/* Interactive Room Banner */}
                      <div className={`flex flex-col items-center justify-center px-2 py-1 rounded border backdrop-blur-sm shadow-lg transition-transform duration-300 ${badgeBg} ${isHovered ? 'scale-110 -translate-y-1' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          {/* Pulsing indicator */}
                          <div className={`w-1.5 h-1.5 rounded-full ${dotGlowClass}`} />
                          <span className="text-[11px] font-bold text-white tracking-wide whitespace-nowrap">{room.name}</span>
                        </div>
                        <div className={`text-[9px] font-medium mt-0.5 whitespace-nowrap ${statusColor}`}>{room.status}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Decorative Grid Lines Overlay (Background effects) */}
                <div className="absolute inset-0 pointer-events-none border border-[#00d4ff]/10 rounded shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]"></div>
              </div>
            </div>

            {/* Subsystems bottom metrics */}
            <div className="h-[105px] w-full grid grid-cols-6 gap-3 select-none">
              {[
                { name: '配电系统', devices: '856台', health: 98, sub: '负载率 68.5%', color: '#34C759' },
                { name: 'UPS系统', devices: '428台', health: 96, sub: '负载率 72.3%', color: '#34C759' },
                { name: '空调系统', devices: '1,256台', health: 94, sub: '负载率 65.2%', color: '#FF9500' },
                { name: '网络系统', devices: '2,856台', health: 99, sub: '带宽使用 56.3%', color: '#34C759' },
                { name: '环境系统', devices: '4,568个', health: 95, sub: '温度合格 98.2%', color: '#34C759' },
                { name: '安防系统', devices: '3,256台', health: 97, sub: '在线率 96.8%', color: '#34C759' }
              ].map((sys) => (
                <div key={sys.name} className="bg-[#030d26]/40 border border-[#00d4ff]/15 rounded p-2 flex flex-col justify-between relative hover:border-[#00d4ff]/35 transition-colors">
                  {/* Sub Header */}
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[11px] font-bold text-white">{sys.name}</span>
                    <span className="text-[9px] text-[#34C759] flex items-center gap-0.5 font-semibold">
                      <span className="w-1 h-1 rounded-full bg-[#34C759] animate-pulse" /> 运行中
                    </span>
                  </div>
                  
                  {/* Body Content */}
                  <div className="flex justify-between items-center gap-1 select-none">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">设备数</span>
                      <span className="text-sm font-bold font-mono text-white leading-none mt-0.5">{sys.devices}</span>
                      <span className="text-[9px] text-[#00D4FF] font-medium font-mono mt-1 whitespace-nowrap">{sys.sub}</span>
                    </div>
                    {/* Health circle */}
                    <MiniProgressRing percent={sys.health} color={sys.color} />
                  </div>

                  {/* Top corner detail line */}
                  <div className="absolute top-0 left-0 w-1 h-[1px] bg-brand-primary" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Workorder and systems status */}
        <div className="col-span-3 flex flex-col gap-4 h-full">
          {/* Chart 1: System Running Status */}
          <Card title="系统运行状态" className="flex-1 min-h-0">
            <div className="flex items-center justify-between h-full w-full">
              <div className="relative w-[100px] h-[100px] flex items-center justify-center select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={systemStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={34}
                      outerRadius={44}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {systemStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 2px ${entry.color}88)` }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[9px] text-slate-400">总数</span>
                  <span className="text-sm font-bold font-mono text-white leading-none">8</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">大类</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 flex flex-col gap-1 pl-4 text-xs select-none">
                {systemStatusData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <div className="text-right flex items-center gap-1.5 font-sans">
                      <span className="text-slate-200 font-mono font-bold">{entry.value}</span>
                      <span className="text-slate-500 font-mono text-[9px]">({entry.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Chart 2: Device Health Rating */}
          <Card title="设备健康度评分" className="flex-1 min-h-0">
            <HealthGauge score={92.5} />
          </Card>

          {/* Block 3: Daily Workorder Details */}
          <Card title="工单处理情况 (今日)" className="flex-1 min-h-0">
            <div className="grid grid-cols-4 gap-2 h-full items-center select-none">
              {[
                { title: '工单总数', count: 68, label: '单', bg: 'bg-[#0066ff]/10 border-[#0066ff]/35 text-[#00D4FF]', icon: <FileText size={14} /> },
                { title: '处理中', count: 32, label: '单', bg: 'bg-[#00D4FF]/10 border-[#00D4FF]/35 text-[#00D4FF]', icon: <Activity size={14} /> },
                { title: '已完成', count: 28, label: '单', bg: 'bg-[#34C759]/10 border-[#34C759]/35 text-[#34C759]', icon: <CheckCircle size={14} /> },
                { title: '超时工单', count: 8, label: '单', bg: 'bg-[#FF3B30]/10 border-[#FF3B30]/35 text-[#FF3B30]', icon: <ShieldAlert size={14} className="animate-pulse" /> }
              ].map((item) => (
                <div key={item.title} className={`h-[82px] border rounded flex flex-col justify-between p-2 text-center hover:bg-opacity-20 transition-all ${item.bg}`}>
                  <span className="text-[10px] text-slate-400 block truncate">{item.title}</span>
                  <div className="flex justify-center my-0.5">{item.icon}</div>
                  <span className="text-base font-bold font-mono block leading-none">
                    {item.count}<span className="text-[10px] font-sans font-normal ml-0.5">{item.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Chart 4: Workorder Trend */}
          <Card title="工单趋势 (近7天)" className="flex-1 min-h-0">
            {/* Custom Legend */}
            <div className="flex gap-4 text-xs justify-end mb-1 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                <span className="text-slate-400">创建</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
                <span className="text-slate-400">完成</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]" />
                <span className="text-slate-400">超时</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workorderTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} domain={[0, 80]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#02091c', borderColor: 'rgba(0, 212, 255, 0.2)', color: '#fff' }}
                    labelStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="创建" stroke="#0066FF" strokeWidth={2} dot={{ r: 1.5 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="完成" stroke="#34C759" strokeWidth={2} dot={{ r: 1.5 }} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="超时" stroke="#FF3B30" strokeWidth={2} dot={{ r: 1.5 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Bar: Horizontal Real-time data row */}
      <div className="h-[75px] w-full bg-[#030d26]/60 backdrop-blur-md border border-[#00d4ff]/20 rounded-lg p-2.5 flex items-center justify-between gap-3 relative box-shadow-glow">
        
        {/* Label Left */}
        <div className="w-[100px] border-r border-[#00d4ff]/25 flex flex-col justify-center select-none shrink-0 leading-tight">
          <span className="text-white text-xs font-bold tracking-wider">实时监测</span>
          <span className="text-[#00D4FF] text-[15px] font-bold font-mono tracking-wider">DATA</span>
        </div>

        {/* 10 dynamic sensor items */}
        <div className="flex-1 flex justify-between gap-2.5 items-center select-none overflow-hidden h-full">
          {[
            { label: '机房温度', val: '24.3', unit: '°C', icon: <Thermometer size={14} className="text-[#00D4FF]" /> },
            { label: '机房湿度', val: '42.6', unit: '%RH', icon: <Droplets size={14} className="text-[#00D4FF]" /> },
            { label: 'PUE值', val: '1.35', unit: '', icon: <Gauge size={14} className="text-[#34C759]" /> },
            { label: 'IT负载', val: '68.5', unit: '%', icon: <Zap size={14} className="text-[#FF9500]" /> },
            { label: '总功率', val: '8,542', unit: 'kW', icon: <Activity size={14} className="text-[#00D4FF]" /> },
            { label: '制冷量', val: '5,632', unit: 'kW', icon: <Snowflake size={14} className="text-[#00D4FF]" /> },
            { label: '水浸检测', val: '正常', unit: '', icon: <Droplets size={14} className="text-[#34C759]" /> },
            { label: '烟感检测', val: '正常', unit: '', icon: <Flame size={14} className="text-[#34C759]" /> },
            { label: '门禁状态', val: '正常', unit: '', icon: <Lock size={14} className="text-[#34C759]" /> },
            { label: '视频监控', val: '运行中', unit: '', icon: <Video size={14} className="text-[#34C759]" /> }
          ].map((sensor) => (
            <div key={sensor.label} className="flex items-center gap-2 flex-1 justify-center bg-[#00d4ff]/3 border border-[#00d4ff]/10 hover:border-[#00d4ff]/25 rounded py-1 px-1.5 transition-colors h-full">
              {/* Icon */}
              <div className="p-1 rounded bg-[#00d4ff]/5 border border-[#00d4ff]/10 shrink-0">
                {sensor.icon}
              </div>
              
              {/* Text details */}
              <div className="flex flex-col shrink-0">
                <span className="text-[10px] text-slate-400 block leading-none">{sensor.label}</span>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[13px] font-bold font-mono text-white leading-none">
                    {sensor.val}
                  </span>
                  {sensor.unit && <span className="text-[9px] text-slate-400 font-sans">{sensor.unit}</span>}
                </div>
                {/* indicator */}
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                  <span className="text-[9px] text-[#34C759] font-medium leading-none">正常</span>
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
