import React, { useState } from 'react';
import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ChinaMap } from '../components/ChinaMap';
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
  Cell, 
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  Server, 
  Database, 
  CheckSquare, 
  BatteryCharging, 
  Activity, 
  Percent, 
  CloudUpload, 
  ShieldCheck, 
  Radio, 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Cpu, 
  Clock, 
  Network,
  FileText,
  AlertTriangle,
  MapPin
} from 'lucide-react';

// Color definitions matching the premium dark neon style
const DONUT_COLORS_1 = ['#00D4FF', '#34C759', '#FF9500', '#7F3DFF'];
const DONUT_COLORS_2 = ['#00D4FF', '#0066FF', '#34C759', '#FF9500', '#FF3B30'];
const PIE_COLORS_STATUS = ['#34C759', '#00D4FF', '#FF9500', '#FF3B30'];
const PIE_COLORS_LIFECYCLE = ['#00D4FF', '#0066FF', '#34C759', '#7F3DFF'];

// Custom progress ring component for "资源类型利用率"
function ProgressRing({ percent, size = 68, strokeWidth = 5, color = '#00D4FF', title = '', detail = '', subDetail = '' }: { 
  percent: number; 
  size?: number; 
  strokeWidth?: number; 
  color?: string; 
  title?: string; 
  detail?: string;
  subDetail?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2.5 bg-[#030e24]/60 border border-[#00d4ff]/10 rounded-lg flex-1 text-center">
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
            className="transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 3px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-white text-[13px]">
          {percent}%
        </div>
      </div>
      <span className="text-[12px] text-white font-sans font-bold mt-2 whitespace-nowrap">{title}</span>
      <span className="text-[10px] text-slate-400 font-sans mt-0.5 whitespace-nowrap">{detail}</span>
      <span className="text-[9px] text-[#00D4FF]/80 font-mono mt-0.5 whitespace-nowrap">{subDetail}</span>
    </div>
  );
}

export default function DashboardP003() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '1y'>('7d');
  const [selectedType, setSelectedType] = useState<'rack' | 'cabinet' | 'server' | 'ip'>('cabinet');

  // Top Row Metric Data
  const topMetrics = [
    { title: '资源总容量 (机柜)', value: 68542, change: '11.2%', up: true, icon: <Database size={20} className="text-[#00D4FF]" />, color: '#00D4FF' },
    { title: '已用容量', value: 52685, change: '8.6%', up: true, icon: <CheckSquare size={20} className="text-[#34C759]" />, color: '#34C759' },
    { title: '可用容量', value: 15857, change: '16.8%', up: true, icon: <BatteryCharging size={20} className="text-[#0066FF]" />, color: '#0066FF' },
    { title: '平均利用率', value: 76.8, suffix: '%', change: '6.3%', up: true, icon: <Percent size={20} className="text-[#FF9500]" />, color: '#FF9500' },
    { title: '上架率', value: 82.5, suffix: '%', change: '4.8%', up: true, icon: <CloudUpload size={20} className="text-[#00D4FF]" />, color: '#00D4FF' },
    { title: '出租率', value: 68.3, suffix: '%', change: '7.2%', up: true, icon: <ShieldCheck size={20} className="text-[#34C759]" />, color: '#34C759' },
    { title: '带宽使用率', value: 56.3, suffix: '%', change: '3.9%', up: true, icon: <Radio size={20} className="text-[#00D4FF]" />, color: '#00D4FF' },
    { title: 'IP使用率', value: 64.1, suffix: '%', change: '5.5%', up: true, icon: <Globe size={20} className="text-[#34C759]" />, color: '#34C759' },
  ];

  // Left Col - 1. 资源类型分布
  const cabinetTypeData = [
    { name: '标准机柜', value: 42856, pct: '62.5%' },
    { name: '高功率机柜', value: 12658, pct: '18.6%' },
    { name: '智算机柜', value: 8752, pct: '12.8%' },
    { name: '网络机柜', value: 4276, pct: '6.2%' }
  ];

  // Left Col - 2. 资源趋势对比
  const trendData = {
    '7d': [
      { date: '05-14', total: 68542, used: 51200, avail: 17342 },
      { date: '05-15', total: 68542, used: 51600, avail: 16942 },
      { date: '05-16', total: 68542, used: 52100, avail: 16442 },
      { date: '05-17', total: 68542, used: 52300, avail: 16242 },
      { date: '05-18', total: 68542, used: 52450, avail: 16092 },
      { date: '05-19', total: 68542, used: 52600, avail: 15942 },
      { date: '05-20', total: 68542, used: 52685, avail: 15857 },
    ],
    '30d': [
      { date: 'W1', total: 68000, used: 50100, avail: 17900 },
      { date: 'W2', total: 68200, used: 51200, avail: 17000 },
      { date: 'W3', total: 68542, used: 52000, avail: 16542 },
      { date: 'W4', total: 68542, used: 52685, avail: 15857 },
    ],
    '1y': [
      { date: 'Q1', total: 62000, used: 45000, avail: 17000 },
      { date: 'Q2', total: 65000, used: 48000, avail: 17000 },
      { date: 'Q3', total: 67000, used: 51000, avail: 16000 },
      { date: 'Q4', total: 68542, used: 52685, avail: 15857 },
    ]
  };

  // Left Col - 3. 资源利用率分布
  const utilizationRangeData = [
    { name: '90%以上', value: 12856, pct: '18.8%' },
    { name: '70%-90%', value: 22314, pct: '32.6%' },
    { name: '50%-70%', value: 18652, pct: '27.2%' },
    { name: '30%-50%', value: 8543, pct: '12.5%' },
    { name: '30%以下', value: 6177, pct: '9.0%' }
  ];

  // Right Col - 1. TOP10 list
  const top10Regions = [
    { rank: 1, name: '北京数据中心', rate: '92.4%', cap: '2,156' },
    { rank: 2, name: '上海数据中心', rate: '89.7%', cap: '1,856' },
    { rank: 3, name: '深圳数据中心', rate: '87.3%', cap: '1,258' },
    { rank: 4, name: '杭州数据中心', rate: '84.6%', cap: '1,653' },
    { rank: 5, name: '广州数据中心', rate: '81.2%', cap: '1,754' },
    { rank: 6, name: '南京数据中心', rate: '78.6%', cap: '2,256' },
    { rank: 7, name: '成都数据中心', rate: '76.9%', cap: '1,256' },
    { rank: 8, name: '武汉数据中心', rate: '75.3%', cap: '1,356' },
    { rank: 9, name: '西安数据中心', rate: '71.4%', cap: '1,856' },
    { rank: 10, name: '天津数据中心', rate: '70.2%', cap: '1,256' },
  ];

  // Right Col - 2. 机柜状态统计
  const cabinetStatusData = [
    { name: '运行中', value: 46856, pct: '80.4%' },
    { name: '空闲', value: 8652, pct: '14.8%' },
    { name: '维护中', value: 2156, pct: '3.7%' },
    { name: '故障', value: 572, pct: '1.1%' }
  ];

  // Right Col - 3. 资源生命周期分布
  const lifecycleData = [
    { name: '0-1年', value: 12856, pct: '18.8%' },
    { name: '1-3年', value: 22314, pct: '32.6%' },
    { name: '3-5年', value: 18652, pct: '27.2%' },
    { name: '5年以上', value: 14720, pct: '21.4%' }
  ];

  // Right Col - 4. 资源预警
  const resourceWarnings = [
    { label: '高利用率预警 (>90%)', val: 132, color: 'bg-[#FF3B30]', textColor: 'text-[#FF3B30]', border: 'border-[#FF3B30]/30', bgGlow: 'rgba(255, 59, 48, 0.08)' },
    { label: '容量不足预警 (<10%)', val: 88, color: 'bg-[#FF9500]', textColor: 'text-[#FF9500]', border: 'border-[#FF9500]/30', bgGlow: 'rgba(255, 149, 0, 0.08)' },
    { label: '设备老化预警 (>5年)', val: 156, color: 'bg-[#FFCC00]', textColor: 'text-[#FFCC00]', border: 'border-[#FFCC00]/30', bgGlow: 'rgba(255, 204, 0, 0.08)' },
    { label: '温耗异常预警', val: 32, color: 'bg-[#00D4FF]', textColor: 'text-[#00D4FF]', border: 'border-[#00D4FF]/30', bgGlow: 'rgba(0, 212, 255, 0.08)' },
  ];

  // Center Col - Map Hotspots
  const mapHotspots = [
    { id: 'beijing', name: '北京数据中心', left: '59%', top: '35%', pue: '1.22', rate: '92.4%', cap: '2,156 架' },
    { id: 'shanghai', name: '上海数据中心', left: '71%', top: '51%', pue: '1.21', rate: '89.7%', cap: '1,856 架' },
    { id: 'shenzhen', name: '深圳数据中心', left: '60%', top: '69%', pue: '1.24', rate: '87.3%', cap: '1,258 架' },
    { id: 'chengdu', name: '成都数据中心', left: '44%', top: '58%', pue: '1.29', rate: '76.9%', cap: '1,256 架' },
    { id: 'wuhan', name: '武汉数据中心', left: '59%', top: '53%', pue: '1.26', rate: '75.3%', cap: '1,356 架' },
    { id: 'xian', name: '西安数据中心', left: '51%', top: '46%', pue: '1.25', rate: '71.4%', cap: '1,856 架' },
  ];

  // Center Col - Capacity prediction data
  const predictionData = [
    { name: '05月', total: 68542, used: 52685, avail: 15857 },
    { name: '06月', total: 69000, used: 53500, avail: 15500 },
    { name: '07月', total: 70000, used: 54600, avail: 15400 },
    { name: '08月', total: 70500, used: 55400, avail: 15100 },
    { name: '09月', total: 71200, used: 56700, avail: 14500 },
    { name: '10月', total: 72000, used: 58000, avail: 14000 },
    { name: '11月', total: 73000, used: 59200, avail: 13800 },
    { name: '12月', total: 74200, used: 60900, avail: 13300 },
    { name: '01月', total: 75000, used: 62000, avail: 13000 },
    { name: '02月', total: 76500, used: 63500, avail: 13000 },
    { name: '03月', total: 77800, used: 65100, avail: 12700 },
    { name: '04月', total: 79000, used: 66800, avail: 12200 },
  ];

  // Bottom dynamics
  const bottomDynamics = [
    { label: '新增机柜 (今日)', val: '128', unit: '架', change: '12%', up: true, icon: <Layers size={15} /> },
    { label: '下架机柜 (今日)', val: '56', unit: '架', change: '8%', up: false, icon: <Layers size={15} /> },
    { label: '上架设备 (今日)', val: '256', unit: '台', change: '15%', up: true, icon: <Cpu size={15} /> },
    { label: '下架设备 (今日)', val: '98', unit: '台', change: '6%', up: false, icon: <Cpu size={15} /> },
    { label: '新增带宽 (今日)', val: '2.56', unit: 'Tbps', change: '4%', up: true, icon: <Network size={15} /> },
    { label: '新增IP (今日)', val: '1,256', unit: '个', change: '10%', up: true, icon: <Globe size={15} /> },
    { label: '新增域名 (今日)', val: '856', unit: '个', change: '7%', up: true, icon: <FileText size={15} /> },
  ];

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden text-slate-200">
      
      {/* 1. TOP STATS ROW (8 Horizontal Cards) */}
      <div className="grid grid-cols-8 gap-3 mb-3 shrink-0">
        {topMetrics.map((item, idx) => (
          <div 
            key={idx}
            className="bg-[#030e24]/70 border border-[#00d4ff]/15 rounded-md px-3 py-2 flex flex-col relative overflow-hidden group hover:border-[#00d4ff]/40 hover:bg-[#030e24]/90 transition-all duration-300 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-sans tracking-wide leading-tight truncate">{item.title}</span>
              <div className="p-1 rounded bg-[#00d4ff]/5 border border-[#00d4ff]/10 group-hover:border-[#00d4ff]/25 transition-all">
                {item.icon}
              </div>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <AnimatedNumber 
                value={item.value} 
                suffix={item.suffix || ''} 
                className="text-[18px] font-bold font-mono tracking-wide" 
              />
              <span className={`text-[10px] font-bold flex items-center ${item.up ? 'text-brand-success' : 'text-[#FF3B30]'}`}>
                同比 {item.up ? '↑' : '↓'} {item.change}
              </span>
            </div>
            <div 
              className="absolute bottom-0 left-0 w-full h-[1.5px] transition-all" 
              style={{ backgroundColor: `${item.color}55` }}
            />
          </div>
        ))}
      </div>

      {/* 2. MIDDLE GRID: Left, Center, Right Columns */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 mb-3">
        
        {/* LEFT COLUMN: col-span-3 (3 Cards) */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          {/* Card 1: 资源类型分布 */}
          <Card title="资源类型分布" extra="更多 >" className="flex-1 min-h-[170px] max-h-[190px]">
            <div className="flex items-center h-full">
              <div className="w-[45%] h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cabinetTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {cabinetTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS_1[index % DONUT_COLORS_1.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-slate-400">总容量</span>
                  <span className="text-[12px] font-bold font-mono text-white leading-none mt-0.5">68,542</span>
                  <span className="text-[8px] text-slate-500 font-sans mt-0.5">架</span>
                </div>
              </div>
              <div className="w-[55%] pl-2 flex flex-col justify-between py-1 space-y-1 text-[11px]">
                {cabinetTypeData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS_1[idx] }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium text-[10px] ml-1 shrink-0">{item.value.toLocaleString()} ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Card 2: 资源趋势对比 */}
          <Card 
            title="资源趋势对比" 
            extra={
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 select-none">
                <div className="flex border border-[#00d4ff]/20 rounded overflow-hidden">
                  <span className={`px-1.5 py-0.5 cursor-pointer ${selectedRange === '7d' ? 'bg-[#00d4ff]/20 text-white' : 'hover:text-white'}`} onClick={(e) => { e.stopPropagation(); setSelectedRange('7d'); }}>近7天</span>
                  <span className={`px-1.5 py-0.5 border-l border-[#00d4ff]/20 cursor-pointer ${selectedRange === '30d' ? 'bg-[#00d4ff]/20 text-white' : 'hover:text-white'}`} onClick={(e) => { e.stopPropagation(); setSelectedRange('30d'); }}>近30天</span>
                  <span className={`px-1.5 py-0.5 border-l border-[#00d4ff]/20 cursor-pointer ${selectedRange === '1y' ? 'bg-[#00d4ff]/20 text-white' : 'hover:text-white'}`} onClick={(e) => { e.stopPropagation(); setSelectedRange('1y'); }}>近一年</span>
                </div>
              </div>
            }
            className="flex-1 min-h-[190px] max-h-[220px]"
          >
            <div className="h-full w-full min-h-0 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData[selectedRange]} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#102A43" opacity={0.25} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff', fontSize: 10 }} />
                  <Line type="monotone" dataKey="total" name="总容量" stroke="#00D4FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="used" name="已用容量" stroke="#34C759" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="avail" name="可用容量" stroke="#0066FF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Card 3: 资源利用率分布 */}
          <Card title="资源利用率分布" extra="更多 >" className="flex-1 min-h-[170px] max-h-[190px]">
            <div className="flex items-center h-full">
              <div className="w-[45%] h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilizationRangeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={48}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {utilizationRangeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS_2[index % DONUT_COLORS_2.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-slate-400 font-sans">总容量</span>
                  <span className="text-[12px] font-bold font-mono text-white leading-none mt-0.5">68,542</span>
                  <span className="text-[8px] text-slate-500 font-sans mt-0.5">架</span>
                </div>
              </div>
              <div className="w-[55%] pl-2 flex flex-col justify-between py-1 space-y-1 text-[11px]">
                {utilizationRangeData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS_2[idx] }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium text-[10px] ml-1 shrink-0">{item.value.toLocaleString()} ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* CENTER COLUMN: col-span-6 (China Map & Bottom Dials + Prediction) */}
        <div className="col-span-6 flex flex-col gap-3 min-h-0">
          
          {/* Main Map Visualizer */}
          <Card title="全国资源热力分布" className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex-1 w-full relative flex items-center justify-center min-h-0 py-2">
              <ChinaMap className="w-auto h-full max-h-[360px] opacity-85" />
              
              {/* Interactive City Nodes overlay */}
              {mapHotspots.map((city) => (
                <div 
                  key={city.id} 
                  className="absolute cursor-pointer transition-all duration-300 select-none group"
                  style={{ left: city.left, top: city.top }}
                  onMouseEnter={() => setHoveredCity(city.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-5 h-5 rounded-full bg-[#00D4FF]/30 border border-[#00D4FF] animate-ping opacity-60 pointer-events-none" />
                    <MapPin size={16} className="text-[#00D4FF] filter drop-shadow-[0_0_4px_#00D4FF] relative z-10 transition-transform group-hover:scale-125" />
                  </div>

                  {/* Popover city details on hover */}
                  <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#020a1c]/95 border border-[#00d4ff]/40 shadow-[0_0_15px_rgba(0,212,255,0.4)] rounded-lg p-2.5 w-[140px] text-white z-30 transition-opacity duration-300 pointer-events-none ${hoveredCity === city.id ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                    <h4 className="text-[12px] font-bold border-b border-[#00D4FF]/35 pb-1 mb-1.5 flex items-center text-[#00D4FF] tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] mr-1.5" />
                      {city.name}
                    </h4>
                    <div className="space-y-1 text-[10px] text-slate-300 font-sans">
                      <div className="flex justify-between"><span>利用率:</span><span className="font-mono font-bold text-white">{city.rate}</span></div>
                      <div className="flex justify-between"><span>可用容量:</span><span className="font-mono text-[#0066FF]">{city.cap}</span></div>
                      <div className="flex justify-between"><span>PUE指标:</span><span className="font-mono text-brand-success font-bold">{city.pue}</span></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-2.5 left-4 bg-[#030e24]/70 border border-[#00d4ff]/10 rounded px-2.5 py-1.5 flex flex-col font-sans select-none pointer-events-none shadow">
                <span className="text-[10px] text-slate-400">利用率级别</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[9px] text-slate-400">低</span>
                  <div className="w-24 h-2 rounded bg-gradient-to-r from-[#00D4FF] via-[#34C759] to-[#FF3B30]" />
                  <span className="text-[9px] text-slate-400">高</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Sub-row Grid of Dials & Trends */}
          <div className="grid grid-cols-12 gap-3 min-h-[170px] max-h-[190px]">
            {/* Left Card: 资源类型利用率 */}
            <div className="col-span-7 flex flex-col min-w-0">
              <Card title="资源类型利用率" extra="更多 >" className="h-full flex-1">
                <div className="flex items-center justify-between gap-2 h-full py-1">
                  <ProgressRing percent={78.6} title="标准机柜" detail="已用 33,682" subDetail="利用率 78.6%" />
                  <ProgressRing percent={82.4} title="高功率" detail="已用 10,436" subDetail="利用率 82.4%" color="#34C759" />
                  <ProgressRing percent={88.7} title="智算机柜" detail="已用 7,766" subDetail="利用率 88.7%" color="#FF9500" />
                  <ProgressRing percent={65.2} title="网络机柜" detail="已用 2,786" subDetail="利用率 65.2%" color="#7F3DFF" />
                </div>
              </Card>
            </div>

            {/* Right Card: 未来容量预测 */}
            <div className="col-span-5 flex flex-col min-w-0">
              <Card title="资源容量预测 (未来12个月)" extra="机架 | 线性预测" className="h-full flex-1">
                <div className="h-full w-full min-h-0 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictionData} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
                      <defs>
                        <linearGradient id="glowTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="glowUsed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34C759" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#102A43" opacity={0.25} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff', fontSize: 10 }} />
                      <Area type="monotone" dataKey="total" name="总资源预测" stroke="#00D4FF" strokeWidth={1.5} fillOpacity={1} fill="url(#glowTotal)" />
                      <Area type="monotone" dataKey="used" name="已用资源预测" stroke="#34C759" strokeWidth={1.5} fillOpacity={1} fill="url(#glowUsed)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: col-span-3 (4 Cards) */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          
          {/* Card 1: 区域资源利用率 TOP10 */}
          <Card title="区域资源利用率 TOP10" extra="更多 >" className="flex-1 min-h-[170px] max-h-[220px]">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 mt-1">
              <table className="w-full text-[11px] font-sans text-slate-300">
                <thead>
                  <tr className="border-b border-[#00d4ff]/15 text-slate-400 text-left font-medium pb-1 flex w-full">
                    <th className="w-1/6 pl-1.5">排名</th>
                    <th className="w-2/5">区域</th>
                    <th className="w-1/4">利用率</th>
                    <th className="w-1/4 text-right pr-1.5">可用容量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#00d4ff]/5 flex flex-col w-full mt-1">
                  {top10Regions.map((region, index) => (
                    <tr key={index} className="flex py-1.5 items-center w-full hover:bg-[#00d4ff]/5 transition-colors rounded">
                      <td className="w-1/6 pl-1.5">
                        <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white ${
                          region.rank === 1 ? 'bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]' : 
                          region.rank === 2 ? 'bg-[#FF9500] shadow-[0_0_6px_#FF9500]' : 
                          region.rank === 3 ? 'bg-[#FFCC00] shadow-[0_0_6px_#FFCC00]' : 
                          'bg-slate-700'
                        }`}>
                          {region.rank}
                        </span>
                      </td>
                      <td className="w-2/5 font-sans font-medium text-white truncate">{region.name}</td>
                      <td className="w-1/4 font-mono font-bold text-[#FF3B30]">{region.rate}</td>
                      <td className="w-1/4 font-mono text-[#00D4FF] text-right pr-1.5">{region.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Card 2: 机柜状态统计 */}
          <Card title="机柜状态统计" extra="更多 >" className="flex-1 min-h-[120px] max-h-[140px]">
            <div className="flex items-center h-full">
              <div className="w-[45%] h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cabinetStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={38}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {cabinetStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS_STATUS[index % PIE_COLORS_STATUS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-slate-400 leading-none">总数</span>
                  <span className="text-[11px] font-bold font-mono text-white mt-0.5">58,542</span>
                  <span className="text-[8px] text-slate-500 font-sans mt-0.5">架</span>
                </div>
              </div>
              <div className="w-[55%] pl-2 flex flex-col justify-between py-0.5 space-y-0.5 text-[10px]">
                {cabinetStatusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS_STATUS[idx] }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-mono text-[9px] shrink-0">{item.value.toLocaleString()} ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Card 3: 资源生命周期分布 */}
          <Card title="资源生命周期分布" extra="更多 >" className="flex-1 min-h-[120px] max-h-[140px]">
            <div className="flex items-center h-full">
              <div className="w-[45%] h-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lifecycleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={38}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {lifecycleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS_LIFECYCLE[index % PIE_COLORS_LIFECYCLE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-slate-400 leading-none">总数</span>
                  <span className="text-[11px] font-bold font-mono text-white mt-0.5">68,542</span>
                  <span className="text-[8px] text-slate-500 font-sans mt-0.5">架</span>
                </div>
              </div>
              <div className="w-[55%] pl-2 flex flex-col justify-between py-0.5 space-y-0.5 text-[10px]">
                {lifecycleData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS_LIFECYCLE[idx] }} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-mono text-[9px] shrink-0">{item.value.toLocaleString()} ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Card 4: 资源预警 */}
          <Card title="资源预警" extra="更多 >" className="flex-1 min-h-[130px] max-h-[155px]">
            <div className="flex flex-col justify-between h-full space-y-1 py-1">
              {resourceWarnings.map((warning, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between px-2.5 py-1 border rounded text-[11px] ${warning.border} hover:bg-[#00d4ff]/5 transition-all`}
                  style={{ backgroundColor: warning.bgGlow }}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={12} className={warning.textColor} />
                    <span className="text-slate-300 font-sans">{warning.label}</span>
                  </div>
                  <span className={`font-mono font-bold text-[12px] ${warning.textColor}`}>{warning.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
      </div>

      {/* 3. BOTTOM ROW: Real-time Dynamics Bar */}
      <div className="bg-[#02091c]/70 border border-[#00d4ff]/15 rounded-md px-6 py-2.5 flex items-center justify-between shrink-0 shadow-inner">
        <div className="flex items-center space-x-2 text-[#00D4FF] border-r border-slate-700/60 pr-6 shrink-0 font-sans font-bold">
          <Clock size={16} className="animate-pulse" />
          <span className="text-[13px] tracking-wider uppercase">实时资源动态</span>
        </div>
        <div className="flex-1 flex justify-around pl-4 items-center">
          {bottomDynamics.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 group cursor-pointer font-sans">
              <div className="p-1.5 rounded-full bg-[#00d4ff]/5 border border-[#00d4ff]/15 text-[#00D4FF] group-hover:bg-[#00d4ff]/15 group-hover:scale-110 transition-all duration-300 shadow animate-none">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-[14px] font-bold font-mono text-white leading-none">{item.val}</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-none">{item.unit}</span>
                  <span className={`text-[9px] font-bold leading-none pl-1 flex items-center ${item.up ? 'text-brand-success' : 'text-[#FF3B30]'}`}>
                    {item.up ? '↑' : '↓'} {item.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
