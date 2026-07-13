import React, { useState } from 'react';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Server, 
  Database, 
  Thermometer, 
  Droplet, 
  Zap, 
  Cloud, 
  Bell, 
  Cpu, 
  Layers, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Lock, 
  MapPin, 
  Play,
  Wind,
  Settings,
  Eye,
  AlertOctagon,
  Unlock,
  AlertTriangle,
  ArrowLeft,
  Info
} from 'lucide-react';

type Level = 'campus' | 'building' | 'floor' | 'room' | 'cabinet' | 'device';

// Recharts cost/trend mock data
const energyTrendData = {
  '24h': [
    { name: '06:00', 电力: 800, 制冷: 300, IT负载: 500, PUE: 1.35 },
    { name: '10:00', 电力: 1200, 制冷: 450, IT负载: 750, PUE: 1.34 },
    { name: '14:00', 电力: 1500, 制冷: 550, IT负载: 950, PUE: 1.32 },
    { name: '18:00', 电力: 1400, 制冷: 500, IT负载: 900, PUE: 1.33 },
    { name: '22:00', 电力: 1100, 制冷: 400, IT负载: 700, PUE: 1.35 },
    { name: '02:00', 电力: 900, 制冷: 320, IT负载: 580, PUE: 1.36 },
    { name: '06:00', 电力: 850, 制冷: 310, IT负载: 540, PUE: 1.35 }
  ],
  '7d': [
    { name: '周一', 电力: 1100, 制冷: 400, IT负载: 700, PUE: 1.34 },
    { name: '周二', 电力: 1250, 制冷: 460, IT负载: 790, PUE: 1.33 },
    { name: '周三', 电力: 1300, 制冷: 480, IT负载: 820, PUE: 1.32 },
    { name: '周四', 电力: 1280, 制冷: 470, IT负载: 810, PUE: 1.33 },
    { name: '周五', 电力: 1350, 制冷: 510, IT负载: 840, PUE: 1.31 },
    { name: '周六', 电力: 1150, font: 12, 制冷: 420, IT负载: 730, PUE: 1.35 },
    { name: '周日', 电力: 1080, 制冷: 390, IT负载: 690, PUE: 1.36 }
  ],
  '30d': [
    { name: '06-25', 电力: 1200, 制冷: 440, IT负载: 760, PUE: 1.33 },
    { name: '06-30', 电力: 1280, 制冷: 470, IT负载: 810, PUE: 1.32 },
    { name: '07-05', 电力: 1320, 制冷: 490, IT负载: 830, PUE: 1.32 },
    { name: '07-10', 电力: 1250, 制冷: 460, IT负载: 790, PUE: 1.34 },
    { name: '07-15', 电力: 1300, 制冷: 480, IT负载: 820, PUE: 1.33 }
  ]
};

// Device specific trend
const deviceTrendData = [
  { time: '14:00', CPU: 45, RAM: 60, TEMP: 62 },
  { time: '14:10', CPU: 58, RAM: 62, TEMP: 68 },
  { time: '14:20', CPU: 80, RAM: 71, TEMP: 75 },
  { time: '14:30', CPU: 92, RAM: 78, TEMP: 85 }
];

export default function DashboardP002() {
  const [level, setLevel] = useState<Level>('campus');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['hfidc', 'hddq', 'shlgyq', 'a1'])
  );
  
  // Drill-down sub-states
  const [selectedFloor, setSelectedFloor] = useState('2F');
  const [selectedRoom, setSelectedRoom] = useState('02');
  const [selectedCabinet, setSelectedCabinet] = useState('C-108');
  const [selectedDevice, setSelectedDevice] = useState('SRV-20');
  
  // Overlay indicators
  const [tempOverlay, setTempOverlay] = useState(false);
  const [smokeOverlay, setSmokeOverlay] = useState(false);
  const [waterOverlay, setWaterOverlay] = useState(false);
  const [accessOverlay, setAccessOverlay] = useState(false);
  const [locationOverlay, setLocationOverlay] = useState(false);
  const [alarmOverlay, setAlarmOverlay] = useState(false);

  // Popup panels
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [topologyPanelOpen, setTopologyPanelOpen] = useState(false);
  const [layerToggles, setLayerToggles] = useState({
    grid3d: true,
    pipes: true,
    buildingShell: true,
    waterLoop: false,
    powerNet: false
  });

  // Hover states
  const [hoveredCabinet, setHoveredCabinet] = useState<string | null>(null);
  const [cabinetHoverData, setCabinetHoverData] = useState<{ load: string; temp: string } | null>(null);

  // Tabs and toggles
  const [energySubTab, setEnergySubTab] = useState<'电力' | '制冷' | 'IT负载' | 'PUE'>('电力');
  const [energyPeriod, setEnergyPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [alarmTab, setAlarmTab] = useState<'全部' | '严重' | '重要' | '一般' | '提示'>('全部');
  const [bottomTab, setBottomTab] = useState('environment');
  const [hoveredA1, setHoveredA1] = useState(false);

  // Resource Tree Toggle
  const toggleNode = (nodeId: string) => {
    const next = new Set(expandedNodes);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    setExpandedNodes(next);
  };

  // Device Stats Pie Chart Data
  const deviceStatsData = [
    { name: '正常', value: 2356, color: '#34C759' },
    { name: '告警', value: 320, color: '#FF9500' },
    { name: '异常', value: 120, color: '#FF3B30' },
    { name: '离线', value: 60, color: '#64748B' }
  ];

  // Alarm list items
  const alarmItems = [
    { content: '精密空调A1-2F-03高温告警', level: '严重', time: '14:34:56', color: 'text-[#FF3B30]' },
    { content: 'UPS电源A1-2F-02输入异常', level: '重要', time: '14:31:22', color: 'text-[#FF9500]' },
    { content: '配电柜A1-2F-01负载过高', level: '一般', time: '14:29:10', color: 'text-[#FFCC00]' },
    { content: '温湿度传感器A1-2F-05离线', level: '提示', time: '14:25:33', color: 'text-[#00D4FF]' },
    { content: '烟感探测器A1-2F-06触发告警', level: '严重', time: '14:24:11', color: 'text-[#FF3B30]' }
  ];

  const filteredAlarms = alarmItems.filter(item => {
    if (alarmTab === '全部') return true;
    return item.level === alarmTab;
  });

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200 select-none">
      
      {/* Top Main Section (3-column grid layout) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          
          {/* Resource Tree Card */}
          <Card title="资源树" className="flex-1 min-h-0 flex flex-col">
            {/* Search Input */}
            <div className="relative mb-3.5 shrink-0">
              <input 
                type="text"
                placeholder="搜索机房/机柜/设备"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#07142b]/60 border border-[#00d4ff]/25 rounded-md px-3.5 py-1.5 pl-9 text-[13px] text-white focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/50 transition-all font-sans placeholder-slate-500"
              />
              <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
            </div>

            {/* Tree View (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar text-[13px] font-sans space-y-1.5 pr-1">
              
              {/* Root: 合肥IDC */}
              <div>
                <div 
                  onClick={() => toggleNode('hfidc')}
                  className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 transition-colors"
                >
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedNodes.has('hfidc') ? '' : '-rotate-90'}`} />
                  <Database size={14} className="text-[#00D4FF]" />
                  <span className="font-medium">合肥IDC(128)</span>
                </div>

                {expandedNodes.has('hfidc') && (
                  <div className="ml-4 pl-2 border-l border-brand-primary/10 space-y-1 mt-1">
                    
                    {/* Node 1: 华东大区 */}
                    <div>
                      <div 
                        onClick={() => toggleNode('hddq')}
                        className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 transition-colors"
                      >
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedNodes.has('hddq') ? '' : '-rotate-90'}`} />
                        <Layers size={14} className="text-[#00D4FF]/80" />
                        <span>华东大区(46)</span>
                      </div>

                      {expandedNodes.has('hddq') && (
                        <div className="ml-4 pl-2 border-l border-brand-primary/10 space-y-1 mt-1">
                          
                          {/* Node: 上海临港园区 */}
                          <div>
                            <div 
                              onClick={() => toggleNode('shlgyq')}
                              className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 transition-colors"
                            >
                              <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedNodes.has('shlgyq') ? '' : '-rotate-90'}`} />
                              <Server size={14} className="text-[#FF9500]" />
                              <span>上海临港园区</span>
                            </div>

                            {expandedNodes.has('shlgyq') && (
                              <div className="ml-4 pl-2 border-l border-brand-primary/10 space-y-1 mt-1">
                                
                                {/* A1机楼 (Active/Expanded) */}
                                <div>
                                  <div 
                                    onClick={() => {
                                      toggleNode('a1');
                                      setLevel('building');
                                    }}
                                    className={`flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer transition-colors ${level === 'building' ? 'bg-[#00D4FF]/25 border border-[#00D4FF]/40 text-white font-bold' : 'hover:bg-brand-primary/10'}`}
                                  >
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedNodes.has('a1') ? '' : '-rotate-90'}`} />
                                    <Cpu size={14} className="text-[#00D4FF]" />
                                    <span>A1机楼</span>
                                  </div>

                                  {expandedNodes.has('a1') && (
                                    <div className="ml-5 space-y-1 mt-0.5 font-mono">
                                      {['1F', '2F', '3F', '4F', '5F'].map(f => (
                                        <div 
                                          key={f}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFloor(f);
                                            setLevel('floor');
                                          }}
                                          className={`py-0.5 px-2 rounded cursor-pointer transition-colors ${selectedFloor === f && level === 'floor' ? 'text-[#00D4FF] bg-[#00d4ff]/10 font-bold border-l-2 border-[#00D4FF]' : 'text-slate-400 hover:text-white'}`}
                                        >
                                          • {f}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* A2机楼 */}
                                <div className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 text-slate-400">
                                  <ChevronRight size={14} />
                                  <Cpu size={14} />
                                  <span>A2机楼</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Node: 其他园区 */}
                          <div className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 text-slate-400">
                            <ChevronRight size={14} />
                            <span>广州南沙园区</span>
                          </div>
                          <div className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 text-slate-400">
                            <ChevronRight size={14} />
                            <span>南京江北园区</span>
                          </div>
                          <div className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 text-slate-400">
                            <ChevronRight size={14} />
                            <span>杭州萧山园区</span>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* Node 2: 华北大区 */}
                    <div className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 text-slate-400">
                      <ChevronRight size={14} />
                      <Layers size={14} />
                      <span>华北大区(32)</span>
                    </div>

                    {/* Node 3: 华南大区 */}
                    <div className="flex items-center space-x-2 py-1 px-1.5 rounded cursor-pointer hover:bg-brand-primary/10 text-slate-400">
                      <ChevronRight size={14} />
                      <Layers size={14} />
                      <span>华南大区(28)</span>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </Card>

          {/* Environmental Monitoring Card */}
          <Card title="环境监测 (A1机楼-2F)" extra="更多 >" className="h-[210px] shrink-0">
            <div className="grid grid-cols-3 gap-2.5 h-full">
              {[
                { val: '23.5℃', label: '温度', icon: <Thermometer size={14} className="text-[#00D4FF]" /> },
                { val: '46.2%', label: '湿度', icon: <Droplet size={14} className="text-[#00D4FF]" /> },
                { val: '620 ppm', label: 'CO₂', icon: <Cloud size={14} className="text-[#00D4FF]" /> },
                { val: '0.02 ppm', label: 'TVOC', icon: <Activity size={14} className="text-[#00D4FF]" /> },
                { val: '>10 Lux', label: '光照度', icon: <Zap size={14} className="text-[#00D4FF]" /> },
                { val: '1.25 m/s', label: '风速', icon: <Wind size={14} className="text-[#00D4FF]" /> }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#030e24]/80 border border-[#00d4ff]/10 rounded p-2 flex flex-col justify-between hover:border-[#00d4ff]/40 transition-colors shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-sans">{item.label}</span>
                    {item.icon}
                  </div>
                  <div className="text-[15px] font-bold text-white tracking-wide mt-1.5 font-mono">{item.val}</div>
                  {/* Subtle horizontal glow bar */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/20 to-transparent" />
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* ================= CENTER COLUMN ================= */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0">
          
          {/* Visual Panel */}
          <div className="flex-1 min-h-0 relative border border-[#00d4ff]/20 bg-[#030d26]/40 backdrop-blur-md rounded-lg overflow-hidden flex flex-col">
            
            {/* Top bar with sub-tabs */}
            <div className="h-[46px] shrink-0 border-b border-[#00d4ff]/15 bg-gradient-to-r from-brand-overlay/30 to-transparent flex items-center justify-between px-4 z-20">
              <div className="flex space-x-2">
                {[
                  { id: 'campus', label: '园区视图' },
                  { id: 'building', label: '楼体视图' },
                  { id: 'floor', label: '楼层视图' },
                  { id: 'room', label: '机房视图' },
                  { id: 'cabinet', label: '机柜视图' },
                  { id: 'device', label: '设备视图' }
                ].map((tab) => {
                  const isActive = level === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setLevel(tab.id as Level)}
                      className={`text-[12.5px] px-3.5 py-1.5 transition-all duration-300 font-medium tracking-wide relative rounded cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#0066FF] to-[#00D4FF]/80 text-white font-bold border-b border-[#00D4FF] shadow-[0_2px_8px_rgba(0,102,255,0.3)]' 
                          : 'text-slate-400 hover:text-white hover:bg-brand-overlay/20 border border-[#00d4ff]/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Scene (with dynamic views) */}
            <div className="flex-1 min-h-0 relative flex justify-center items-center overflow-hidden w-full h-full">
              
              <AnimatePresence mode="wait">
                
                {/* 1. CAMPUS VIEW */}
                {level === 'campus' && (
                  <motion.div
                    key="campus-scene"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Render generated 3D image as background */}
                    <img 
                      src={`${import.meta.env.BASE_URL}datacenter_campus.png`} 
                      alt="Datacenter Campus 3D" 
                      className="w-full h-full object-cover"
                    />

                    {/* Glowing A1 Building Hotspot Overlay */}
                    <div 
                      className="absolute left-[24%] top-[23%] w-[25%] h-[25%] cursor-pointer z-10"
                      onMouseEnter={() => setHoveredA1(true)}
                      onMouseLeave={() => setHoveredA1(false)}
                      onClick={() => setLevel('building')}
                    >
                      {/* Highlight border on hover */}
                      <div className={`absolute inset-0 border border-[#00D4FF] rounded-lg transition-opacity duration-300 pointer-events-none ${hoveredA1 ? 'opacity-100 bg-[#00D4FF]/10 shadow-[0_0_15px_#00D4FF]' : 'opacity-0'}`} />
                      
                      {/* Neon Floating Tag */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#020a1c]/80 border border-[#00D4FF] shadow-[0_0_8px_#00D4FF] px-3 py-1 rounded text-white text-[12px] font-bold tracking-wider whitespace-nowrap">
                        A1机楼
                      </div>
                    </div>

                    {/* Other mock building tags */}
                    <div className="absolute left-[54%] top-[14%] bg-[#020a1c]/60 border border-slate-600 px-2 py-0.5 rounded text-slate-300 text-[11px] pointer-events-none">
                      B1机房
                    </div>
                    <div className="absolute left-[22%] top-[50%] bg-[#020a1c]/60 border border-slate-600 px-2 py-0.5 rounded text-slate-300 text-[11px] pointer-events-none">
                      制冷中心
                    </div>
                    <div className="absolute left-[78%] top-[28%] bg-[#020a1c]/60 border border-slate-600 px-2 py-0.5 rounded text-slate-300 text-[11px] pointer-events-none">
                      监控中心
                    </div>
                    <div className="absolute left-[62%] top-[51%] bg-[#020a1c]/60 border border-slate-600 px-2 py-0.5 rounded text-slate-300 text-[11px] pointer-events-none">
                      动力中心
                    </div>

                    {/* Pop-up Info Tooltip for A1 Building */}
                    <div className={`absolute left-[36%] top-[34%] w-[270px] bg-[#020a1c]/90 border border-[#00d4ff]/40 rounded-lg p-3.5 shadow-[0_0_20px_rgba(0,212,255,0.25)] backdrop-blur-md z-30 transition-all duration-300 ${hoveredA1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 pointer-events-none translate-y-2 scale-95'}`}>
                      <div className="flex justify-between items-center border-b border-[#00d4ff]/20 pb-1.5 mb-2.5">
                        <span className="text-[14px] font-bold text-white tracking-wide">A1机楼</span>
                        <span className="text-[11px] text-[#34C759] flex items-center gap-1 font-medium bg-[#34C759]/10 px-1.5 py-0.5 rounded border border-[#34C759]/20">正常 &gt;</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px] font-sans">
                        <div className="flex justify-between"><span className="text-slate-400">2F机房总数</span><span className="text-white font-mono font-bold">8台</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">机柜总数</span><span className="text-white font-mono font-bold">1,280</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">已用数</span><span className="text-white font-mono font-bold">808</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">空置数</span><span className="text-white font-mono font-bold">472</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">使用率</span><span className="text-[#FF9500] font-mono font-bold">68.5%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">总功率</span><span className="text-white font-mono font-bold">1,280 kW</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">PUE</span><span className="text-[#00D4FF] font-mono font-bold">1.32</span></div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">状态</span>
                          <span className="text-[#34C759] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#34C759] rounded-full animate-ping animate-breathe" />
                            运行中
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sensor Toggled Overlays (floating indicators on Campus Map) */}
                    {tempOverlay && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute left-[34%] top-[20%] bg-[#00D4FF] text-[#020a1c] font-bold font-mono text-[11px] px-1.5 py-0.5 rounded shadow-[0_0_8px_#00D4FF] animate-pulse">A1: 23.5℃</div>
                        <div className="absolute left-[64%] top-[14%] bg-[#00D4FF] text-[#020a1c] font-bold font-mono text-[11px] px-1.5 py-0.5 rounded shadow-[0_0_8px_#00D4FF] animate-pulse">B1: 24.1℃</div>
                        <div className="absolute left-[72%] top-[55%] bg-[#00D4FF] text-[#020a1c] font-bold font-mono text-[11px] px-1.5 py-0.5 rounded shadow-[0_0_8px_#00D4FF] animate-pulse">动力: 35.2℃</div>
                        <div className="absolute left-[16%] top-[55%] bg-[#00D4FF] text-[#020a1c] font-bold font-mono text-[11px] px-1.5 py-0.5 rounded shadow-[0_0_8px_#00D4FF] animate-pulse">制冷: 16.8℃</div>
                      </div>
                    )}

                    {smokeOverlay && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute left-[34%] top-[25%] bg-[#34C759] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />A1: 正常</div>
                        <div className="absolute left-[64%] top-[18%] bg-[#34C759] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full" />B1: 正常</div>
                        <div className="absolute left-[54%] top-[58%] bg-[#FF9500] text-[#020a1c] font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 animate-bounce"><span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />动力: 极微烟雾</div>
                      </div>
                    )}

                    {waterOverlay && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute left-[20%] top-[45%] bg-[#FF3B30] text-white font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 shadow-[0_0_8px_#FF3B30] animate-bounce"><AlertOctagon size={10} /> 制冷: 管道渗漏</div>
                        <div className="absolute left-[34%] top-[28%] bg-[#34C759] text-white text-[10px] px-1.5 py-0.5 rounded">A1: 无漏水</div>
                        <div className="absolute left-[64%] top-[22%] bg-[#34C759] text-white text-[10px] px-1.5 py-0.5 rounded">B1: 无漏水</div>
                      </div>
                    )}

                    {accessOverlay && (
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute left-[31%] top-[30%] bg-[#34C759] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><Lock size={10} /> A1: 锁定</div>
                        <div className="absolute left-[78%] top-[34%] bg-[#FF9500] text-[#020a1c] font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><Unlock size={10} /> 监控: 开启</div>
                      </div>
                    )}

                    {locationOverlay && (
                      <div className="absolute inset-0 pointer-events-none z-20 font-mono text-[9px] text-[#00D4FF]">
                        <div className="absolute left-[24%] top-[34%] bg-[#020a1c]/80 border border-[#00D4FF] p-1 rounded">
                          A1: X=432.5, Y=180.2
                        </div>
                        <div className="absolute left-[54%] top-[25%] bg-[#020a1c]/80 border border-[#00D4FF] p-1 rounded">
                          B1: X=680.1, Y=240.4
                        </div>
                      </div>
                    )}

                    {alarmOverlay && (
                      <div className="absolute inset-0 pointer-events-none z-20 animate-pulse">
                        <div className="absolute left-[32%] top-[23%] bg-[#FF3B30] text-white font-bold p-1 rounded-full animate-ping"><Bell size={18} /></div>
                        <div className="absolute left-[58%] top-[12%] bg-[#FF9500] text-white font-bold p-1 rounded-full animate-ping"><Bell size={16} /></div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. BUILDING VIEW */}
                {level === 'building' && (
                  <motion.div
                    key="building-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-0 flex flex-col p-6 overflow-hidden bg-[#02091c]/95"
                  >
                    <div className="flex justify-between items-center border-b border-brand-primary/20 pb-2 mb-4 shrink-0">
                      <span className="text-[15px] font-bold text-white tracking-wider flex items-center gap-2">
                        <Cpu size={16} className="text-[#00D4FF]" /> A1机楼 - 楼层拓扑选择
                      </span>
                      <button 
                        onClick={() => setLevel('campus')} 
                        className="text-[12px] text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={12} /> 返回园区视图
                      </button>
                    </div>

                    {/* Interactive 3D Stacked Floor List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-center items-center gap-3">
                      {['5F', '4F', '3F', '2F', '1F'].map((fl, idx) => {
                        const isWarning = fl === '3F';
                        return (
                          <div
                            key={fl}
                            onClick={() => {
                              setSelectedFloor(fl);
                              setLevel('floor');
                            }}
                            className={`w-[85%] max-w-[480px] p-3 border rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer flex justify-between items-center relative overflow-hidden ${
                              isWarning 
                                ? 'bg-[#FF9500]/5 border-[#FF9500]/40 hover:border-[#FF9500] hover:bg-[#FF9500]/10 shadow-[0_0_10px_rgba(255,149,0,0.1)]' 
                                : 'bg-[#031026]/70 border-[#00d4ff]/25 hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 shadow-[0_0_10px_rgba(0,212,255,0.05)]'
                            }`}
                          >
                            <div className="flex items-center space-x-3.5 z-10">
                              <span className="text-xl font-mono font-bold text-white">{fl}</span>
                              <div className="flex flex-col text-left">
                                <span className="text-[13px] font-sans font-medium text-slate-200">核心机房层</span>
                                <span className="text-[11px] text-slate-400">机柜装载: {idx * 15 + 40}% | 空调运行正常</span>
                              </div>
                            </div>
                            <div className="text-right z-10 font-sans flex items-center gap-3">
                              <div className="flex flex-col text-[11px] text-slate-400">
                                <span>PUE: {isWarning ? '1.38' : '1.32'}</span>
                                <span>温湿度: 23℃ / 45%</span>
                              </div>
                              <span className={`text-[11.5px] px-2 py-0.5 rounded font-bold ${isWarning ? 'bg-[#FF9500]/25 text-[#FF9500]' : 'bg-[#34C759]/25 text-[#34C759]'}`}>
                                {isWarning ? '一般告警' : '正常'}
                              </span>
                            </div>
                            {/* Glow footer line */}
                            <div className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent ${isWarning ? 'via-[#FF9500]/30' : 'via-[#00D4FF]/30'} to-transparent`} />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* 3. FLOOR VIEW */}
                {level === 'floor' && (
                  <motion.div
                    key="floor-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-0 flex flex-col p-6 overflow-hidden bg-[#02091c]/95"
                  >
                    <div className="flex justify-between items-center border-b border-brand-primary/20 pb-2 mb-4 shrink-0">
                      <span className="text-[15px] font-bold text-white tracking-wider flex items-center gap-2">
                        <Layers size={16} className="text-[#00D4FF]" /> A1机楼 · {selectedFloor} - 机房平面分布
                      </span>
                      <button 
                        onClick={() => setLevel('building')} 
                        className="text-[12px] text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={12} /> 返回楼体视图
                      </button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 max-w-[640px] mx-auto w-full items-center justify-center py-4">
                      {['01', '02', '03', '04'].map((room) => {
                        const isWarning = room === '03';
                        return (
                          <div
                            key={room}
                            onClick={() => {
                              setSelectedRoom(room);
                              setLevel('room');
                            }}
                            className={`p-4 border rounded-xl flex flex-col justify-between h-[160px] cursor-pointer transition-all duration-300 hover:scale-[1.03] ${
                              isWarning 
                                ? 'bg-[#FF9500]/5 border-[#FF9500]/40 hover:border-[#FF9500] hover:bg-[#FF9500]/10 shadow-[0_0_12px_rgba(255,149,0,0.1)]' 
                                : 'bg-[#031026]/70 border-[#00d4ff]/20 hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 shadow-[0_0_12px_rgba(0,212,255,0.05)]'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col text-left">
                                <span className="text-[15px] font-bold text-white font-sans">{room}号机房</span>
                                <span className="text-[11.5px] text-slate-400 mt-0.5">微模块容量: 120机柜</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isWarning ? 'bg-[#FF9500]/25 text-[#FF9500]' : 'bg-[#34C759]/25 text-[#34C759]'}`}>
                                {isWarning ? '一般告警' : '正常'}
                              </span>
                            </div>

                            <div className="space-y-1.5 font-sans text-[12px] text-slate-300 text-left border-t border-[#00d4ff]/10 pt-2 mt-2">
                              <div className="flex justify-between"><span>实装机柜:</span><span className="text-white font-mono font-bold">{isWarning ? '78台' : '92台'}</span></div>
                              <div className="flex justify-between"><span>机柜装载率:</span><span className="text-[#00D4FF] font-mono font-bold">{isWarning ? '65%' : '76.6%'}</span></div>
                              <div className="flex justify-between"><span>平均PUE:</span><span className="text-white font-mono">{isWarning ? '1.39' : '1.31'}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* 4. ROOM VIEW */}
                {level === 'room' && (
                  <motion.div
                    key="room-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-0 flex flex-col p-6 overflow-hidden bg-[#02091c]/95"
                  >
                    <div className="flex justify-between items-center border-b border-brand-primary/20 pb-2 mb-3.5 shrink-0">
                      <span className="text-[15px] font-bold text-white tracking-wider flex items-center gap-2">
                        <Database size={16} className="text-[#00D4FF]" /> A1机楼 · {selectedFloor} · {selectedRoom}号机房 - 机柜阵列图
                      </span>
                      <button 
                        onClick={() => setLevel('floor')} 
                        className="text-[12px] text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={12} /> 返回楼层视图
                      </button>
                    </div>

                    {/* Matrix map of 50 cabinets */}
                    <div className="flex-1 flex flex-col justify-center items-center gap-4 min-h-0 relative">
                      <div className="grid grid-cols-10 gap-2 p-3 bg-[#030e26]/60 border border-[#00d4ff]/20 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.05)] w-[90%] max-w-[580px]">
                        {Array.from({ length: 50 }).map((_, i) => {
                          const id = `C-1${String(i + 1).padStart(2, '0')}`;
                          const isCritical = i === 12;
                          const isWarning = i === 25 || i === 38;
                          const isEmpty = i % 8 === 0;
                          
                          let bgClass = 'bg-[#00d4ff]/10 border-[#00d4ff]/30 hover:border-[#00D4FF] hover:bg-[#00d4ff]/20';
                          if (isCritical) bgClass = 'bg-[#FF3B30]/20 border-[#FF3B30] animate-pulse';
                          if (isWarning) bgClass = 'bg-[#FF9500]/20 border-[#FF9500] animate-breathe';
                          if (isEmpty) bgClass = 'bg-slate-800/40 border-slate-700/50 cursor-default';

                          return (
                            <div
                              key={id}
                              onMouseEnter={(e) => {
                                if (isEmpty) return;
                                setHoveredCabinet(id);
                                setCabinetHoverData({
                                  load: isCritical ? '6.8 kW' : (isWarning ? '5.2 kW' : '3.8 kW'),
                                  temp: isCritical ? '28.5℃' : (isWarning ? '25.6℃' : '22.4℃')
                                });
                              }}
                              onMouseLeave={() => {
                                setHoveredCabinet(null);
                                setCabinetHoverData(null);
                              }}
                              onClick={() => {
                                if (isEmpty) return;
                                setSelectedCabinet(id);
                                setLevel('cabinet');
                              }}
                              className={`h-7 border rounded transition-all cursor-pointer ${bgClass}`}
                            />
                          );
                        })}
                      </div>

                      {/* Cabinet Tooltip Popup */}
                      {hoveredCabinet && cabinetHoverData && (
                        <div className="absolute top-[8%] bg-[#020a1c]/95 border border-[#00d4ff]/50 rounded-lg p-2.5 shadow-2xl backdrop-blur text-[12.5px] min-w-[150px] text-left z-20">
                          <div className="font-bold text-white border-b border-[#00d4ff]/20 pb-1 mb-1.5">{hoveredCabinet}机柜</div>
                          <div className="space-y-1 font-sans text-slate-300">
                            <div className="flex justify-between"><span>当前负荷:</span><span className="text-white font-bold font-mono">{cabinetHoverData.load}</span></div>
                            <div className="flex justify-between"><span>机柜温度:</span><span className="text-white font-bold font-mono">{cabinetHoverData.temp}</span></div>
                            <div className="flex justify-between"><span>U位数量:</span><span className="text-white font-mono">42U</span></div>
                          </div>
                        </div>
                      )}

                      {/* Legends */}
                      <div className="flex justify-center gap-4 text-[11.5px] font-sans border-t border-[#00d4ff]/10 pt-2.5 w-full max-w-[480px]">
                        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#00d4ff]/10 border border-[#00d4ff]/40 rounded-sm" /> 正常</div>
                        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#FF9500]/25 border border-[#FF9500] rounded-sm" /> 告警</div>
                        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#FF3B30]/25 border border-[#FF3B30] rounded-sm animate-pulse" /> 异常</div>
                        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-800/40 border border-slate-700 rounded-sm" /> 空置</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. CABINET VIEW */}
                {level === 'cabinet' && (
                  <motion.div
                    key="cabinet-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 flex flex-col p-6 overflow-hidden bg-[#02091c]/95"
                  >
                    <div className="flex justify-between items-center border-b border-brand-primary/20 pb-2 mb-4 shrink-0">
                      <span className="text-[15px] font-bold text-white tracking-wider flex items-center gap-2">
                        <Server size={16} className="text-[#00D4FF]" /> A1机楼 · {selectedFloor} · {selectedRoom}号机房 · {selectedCabinet}机柜 - U位模型视图
                      </span>
                      <button 
                        onClick={() => setLevel('room')} 
                        className="text-[12px] text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={12} /> 返回机房视图
                      </button>
                    </div>

                    <div className="flex-1 flex gap-8 items-center justify-center min-h-0">
                      {/* 42U Vertical visual list */}
                      <div className="w-[180px] h-[90%] border-2 border-[#1e293b] bg-[#070e1b] rounded-md p-1.5 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar shadow-inner">
                        {Array.from({ length: 42 }).reverse().map((_, i) => {
                          const u = i + 1;
                          const hasDevice = u === 40 || u === 32 || u === 20 || u === 12;
                          const isWarning = u === 20;
                          
                          let bgClass = 'bg-[#0f1d38]/20 border-b border-slate-800/40 text-slate-600';
                          if (hasDevice) {
                            bgClass = isWarning 
                              ? 'bg-[#FF9500]/25 border border-[#FF9500]/60 text-white font-bold cursor-pointer hover:bg-[#FF9500]/30 animate-pulse'
                              : 'bg-[#00D4FF]/15 border border-[#00d4ff]/40 text-[#00D4FF] font-bold cursor-pointer hover:bg-[#00d4ff]/25';
                          }

                          return (
                            <div
                              key={u}
                              onClick={() => {
                                if (!hasDevice) return;
                                setSelectedDevice(isWarning ? 'SRV-20 (核心服务器)' : `SRV-${u} (计算节点)`);
                                setLevel('device');
                              }}
                              className={`h-5 w-full flex items-center px-1 text-[10px] rounded-sm transition-all ${bgClass}`}
                            >
                              <span className="w-5 font-mono">{u}U</span>
                              {hasDevice && (
                                <span className="flex-1 truncate text-left text-[9px] font-sans ml-1 text-slate-200">
                                  {isWarning ? 'SRV-20 (告警)' : `SRV-${u}`}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Cabinet statistics specs */}
                      <div className="w-[220px] space-y-4 text-left font-sans">
                        <div className="bg-[#030e26]/60 border border-[#00d4ff]/25 p-3 rounded-lg shadow-sm">
                          <span className="text-[13px] font-bold text-white border-b border-[#00d4ff]/15 pb-1 mb-2 block">容量指标</span>
                          <div className="space-y-1.5 text-[12px]">
                            <div className="flex justify-between"><span className="text-slate-400">总U数</span><span className="text-white font-mono">42 U</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">空置U数</span><span className="text-[#00D4FF] font-mono">18 U</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">使用率</span><span className="text-white font-mono font-bold">57.1%</span></div>
                          </div>
                        </div>

                        <div className="bg-[#030e26]/60 border border-[#00d4ff]/25 p-3 rounded-lg shadow-sm">
                          <span className="text-[13px] font-bold text-white border-b border-[#00d4ff]/15 pb-1 mb-2 block">能效负载</span>
                          <div className="space-y-1.5 text-[12px]">
                            <div className="flex justify-between"><span className="text-slate-400">额定功耗</span><span className="text-white font-mono">8.0 kW</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">当前负荷</span><span className="text-[#FF9500] font-mono font-bold">5.2 kW</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">输入电压</span><span className="text-white font-mono">220 V</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">机柜温度</span><span className="text-white font-mono">24.5 ℃</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. DEVICE VIEW */}
                {level === 'device' && (
                  <motion.div
                    key="device-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 flex flex-col p-6 overflow-hidden bg-[#02091c]/95"
                  >
                    <div className="flex justify-between items-center border-b border-brand-primary/20 pb-2 mb-4 shrink-0">
                      <span className="text-[15px] font-bold text-white tracking-wider flex items-center gap-2">
                        <Cpu size={16} className="text-[#00D4FF]" /> 设备诊断 - {selectedDevice}
                      </span>
                      <button 
                        onClick={() => setLevel('cabinet')} 
                        className="text-[12px] text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={12} /> 返回机柜视图
                      </button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 items-center justify-center min-h-0 py-2">
                      {/* Specs card */}
                      <div className="bg-[#030e26]/60 border border-[#00d4ff]/20 p-4 rounded-xl shadow-lg h-[95%] flex flex-col text-left">
                        <div className="flex items-center gap-3.5 border-b border-[#00d4ff]/15 pb-2.5 mb-3.5">
                          <div className="p-2 bg-[#FF9500]/10 border border-[#FF9500] rounded-lg text-[#FF9500]">
                            <Server size={26} className="animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[15px] font-bold text-white block">核心应用服务器 SRV-20</span>
                            <span className="text-[11.5px] text-[#FF9500] font-mono mt-0.5">运行诊断: 警告 - 核心温度偏高</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2 text-[12px] overflow-y-auto custom-scrollbar font-sans pr-1">
                          <div className="flex justify-between border-b border-slate-800 pb-1.5"><span className="text-slate-400">系统型号</span><span className="text-white">Huawei FusionServer 2288H V5</span></div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5"><span className="text-slate-400">处理器</span><span className="text-white">Intel Xeon Gold 6248 (2.5GHz / 20C) * 2</span></div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5"><span className="text-slate-400">总内存</span><span className="text-white">512 GB DDR4 ECC RAM</span></div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5"><span className="text-slate-400">网卡配置</span><span className="text-white">10 Gbps SFP+ Dual Port * 2</span></div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5"><span className="text-slate-400">操作系统</span><span className="text-white">EulerOS 2.8 Standard Server edition</span></div>
                        </div>
                      </div>

                      {/* Performance metrics charts */}
                      <div className="h-[95%] flex flex-col gap-3 min-h-0">
                        {/* 4 grid stats */}
                        <div className="grid grid-cols-2 gap-2 shrink-0">
                          {[
                            { label: 'CPU温度', val: '85°C', color: 'text-[#FF9500]' },
                            { label: 'CPU使用率', val: '92%', color: 'text-white' },
                            { label: '内存使用率', val: '78%', color: 'text-white' },
                            { label: '风扇转速', val: '6,500 RPM', color: 'text-white' }
                          ].map((metric, idx) => (
                            <div key={idx} className="bg-[#030d24]/60 border border-[#00d4ff]/10 rounded p-2 text-left">
                              <span className="text-[10px] text-slate-400">{metric.label}</span>
                              <div className={`text-[17px] font-bold font-mono tracking-wide mt-1 ${metric.color}`}>{metric.val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Line trend area */}
                        <div className="flex-1 bg-[#030e26]/60 border border-[#00d4ff]/20 rounded-xl p-3 flex flex-col justify-between min-h-0 text-[10px]">
                          <span className="text-[11.5px] font-sans font-medium text-slate-300 text-left mb-1.5 block">负载趋势 (今日诊断时段)</span>
                          <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="90%">
                              <AreaChart data={deviceTrendData} margin={{ top: 2, right: 2, left: -25, bottom: 2 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} />
                                <Tooltip contentStyle={{ backgroundColor: '#020a1c', borderColor: '#00d4ff', color: '#fff', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="CPU" stroke="#FF9500" fill="rgba(255, 149, 0, 0.15)" strokeWidth={1.5} />
                                <Area type="monotone" dataKey="TEMP" stroke="#FF3B30" fill="rgba(255, 59, 48, 0.1)" strokeWidth={1.5} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Sidebar float panel overlay controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-3.5 z-20">
                {/* Top overlay block */}
                <div className="bg-[#020a1c]/80 border border-[#00d4ff]/20 rounded-md p-1.5 flex flex-col gap-1.5 shadow-[0_0_8px_rgba(0,0,0,0.5)] backdrop-blur">
                  {[
                    { icon: <Bell size={16} />, label: '告警', active: alarmOverlay, action: () => setAlarmOverlay(!alarmOverlay) },
                    { icon: <Layers size={16} />, label: '图层', active: layerPanelOpen, action: () => setLayerPanelOpen(!layerPanelOpen) },
                    { icon: <Settings size={16} />, label: '拓扑', active: topologyPanelOpen, action: () => setTopologyPanelOpen(!topologyPanelOpen) }
                  ].map((ctrl, i) => (
                    <button 
                      key={i} 
                      title={ctrl.label}
                      onClick={ctrl.action}
                      className={`p-1.5 rounded transition-all cursor-pointer ${ctrl.active ? 'bg-[#00D4FF] text-[#020a1c] shadow-[0_0_6px_#00D4FF]' : 'hover:bg-[#00D4FF]/20 text-[#00D4FF]'}`}
                    >
                      {ctrl.icon}
                    </button>
                  ))}
                </div>

                {/* Right vertical toolbar overlay */}
                <div className="bg-[#020a1c]/80 border border-[#00d4ff]/20 rounded-md p-1.5 flex flex-col gap-1.5 shadow-[0_0_8px_rgba(0,0,0,0.5)] backdrop-blur">
                  {[
                    { icon: <Thermometer size={16} />, label: '测温', active: tempOverlay, action: () => setTempOverlay(!tempOverlay) },
                    { icon: <Activity size={16} />, label: '烟感', active: smokeOverlay, action: () => setSmokeOverlay(!smokeOverlay) },
                    { icon: <Droplet size={16} />, label: '漏水', active: waterOverlay, action: () => setWaterOverlay(!waterOverlay) },
                    { icon: <Lock size={16} />, label: '门禁', active: accessOverlay, action: () => setAccessOverlay(!accessOverlay) },
                    { icon: <MapPin size={16} />, label: '定位', active: locationOverlay, action: () => setLocationOverlay(!locationOverlay) }
                  ].map((ctrl, i) => (
                    <button 
                      key={i} 
                      title={ctrl.label}
                      onClick={ctrl.action}
                      className={`p-1.5 rounded transition-all cursor-pointer ${ctrl.active ? 'bg-[#00D4FF] text-[#020a1c] shadow-[0_0_6px_#00D4FF]' : 'hover:bg-[#00D4FF]/20 text-[#00D4FF]'}`}
                    >
                      {ctrl.icon}
                    </button>
                  ))}
                  <button className="bg-[#00D4FF] hover:bg-[#00D4FF]/80 text-[#020a1c] font-bold text-[10px] py-1 rounded shadow-sm text-center cursor-pointer">
                    2D
                  </button>
                </div>
              </div>

              {/* FLOATING DIALOGS */}
              
              {/* Layer Toggles Panel Popup */}
              {layerPanelOpen && (
                <div className="absolute right-16 top-[5%] bg-[#020a1c]/95 border border-[#00d4ff]/40 rounded-lg p-3 shadow-2xl backdrop-blur text-[12px] min-w-[130px] text-left z-30">
                  <div className="font-bold text-white border-b border-[#00d4ff]/20 pb-1 mb-2">图层管理</div>
                  <div className="space-y-1.5 font-sans">
                    {Object.entries(layerToggles).map(([key, val]) => (
                      <label key={key} className="flex items-center space-x-2.5 cursor-pointer text-slate-300 hover:text-white">
                        <input 
                          type="checkbox" 
                          checked={val} 
                          onChange={() => setLayerToggles({ ...layerToggles, [key]: !val })}
                          className="accent-[#00D4FF]"
                        />
                        <span>
                          {key === 'grid3d' && '3D网格'}
                          {key === 'pipes' && '管道模型'}
                          {key === 'buildingShell' && '建筑外壳'}
                          {key === 'waterLoop' && '供水回路'}
                          {key === 'powerNet' && '供配电网'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Logical Topology Popup Modal */}
              {topologyPanelOpen && (
                <div className="absolute right-16 top-[20%] w-[200px] bg-[#020a1c]/95 border border-[#00d4ff]/40 rounded-lg p-3 shadow-2xl backdrop-blur text-[12px] text-left z-30 font-sans">
                  <div className="font-bold text-white border-b border-[#00d4ff]/20 pb-1 mb-2">逻辑拓扑连接</div>
                  <div className="space-y-1 text-slate-300 relative pl-3.5 border-l border-[#00d4ff]/20">
                    <div className="relative"><span className="absolute -left-5 top-1 w-2.5 h-2.5 bg-[#FF9500] rounded-full" />临港园区</div>
                    <div className="relative mt-2"><span className="absolute -left-5 top-1 w-2.5 h-2.5 bg-[#00D4FF] rounded-full" />A1机楼</div>
                    <div className="relative mt-2"><span className="absolute -left-5 top-1 w-2.5 h-2.5 bg-[#00D4FF] rounded-full" />2F机房</div>
                    <div className="relative mt-2"><span className="absolute -left-5 top-1 w-2.5 h-2.5 bg-[#00D4FF] rounded-full" />C-108机柜</div>
                    <div className="relative mt-2"><span className="absolute -left-5 top-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full animate-pulse" />SRV-20核心设备</div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom tabs inside visual panel container */}
            <div className="h-[52px] shrink-0 border-t border-[#00d4ff]/15 bg-gradient-to-r from-transparent via-[#030d24]/60 to-transparent flex items-center justify-center space-x-2 z-20">
              {[
                { id: 'environment', label: '环境监测', icon: <Cloud size={14} /> },
                { id: 'energy', label: '能耗监测', icon: <Zap size={14} /> },
                { id: 'power', label: '配电系统', icon: <Layers size={14} /> },
                { id: 'cooling', label: '制冷系统', icon: <Wind size={14} /> },
                { id: 'network', label: '网络拓扑', icon: <Cpu size={14} /> },
                { id: 'video', label: '视频监控', icon: <Eye size={14} /> }
              ].map((tab) => {
                const isActive = bottomTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setBottomTab(tab.id)}
                    className={`flex items-center space-x-1.5 text-[12px] px-4 py-1.5 rounded border transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-[#00d4ff]/10 border-[#00D4FF] text-[#00D4FF] font-bold shadow-[0_0_6px_rgba(0,212,255,0.15)]' 
                        : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          
          {/* Device Status Card */}
          <Card title="设备状态统计 (A1机楼)" className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 flex items-center justify-between min-h-0 relative pr-2">
              
              {/* Pie Chart and Total counter */}
              <div className="w-[120px] h-[120px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStatsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={56}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {deviceStatsData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-slate-400 leading-tight">设备总数</span>
                  <span className="text-[19px] font-bold text-white font-mono tracking-tight leading-tight">2,856</span>
                </div>
              </div>

              {/* Status List Labels */}
              <div className="flex-1 space-y-1.5 ml-4 text-[12.5px] font-sans">
                {deviceStatsData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold font-mono">{item.value.toLocaleString()}</span>
                      <span className="text-slate-400 text-[11px] font-mono ml-1.5">
                        {((item.value / 2856) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </Card>

          {/* Energy Trend Card */}
          <Card title="机房能耗趋势 (A1机楼)" className="flex-1 min-h-0 flex flex-col">
            {/* Sub-tabs and filters inside header block */}
            <div className="flex justify-between items-center mb-3 shrink-0">
              {/* Metric tabs */}
              <div className="flex space-x-1 border border-slate-800 rounded p-0.5 bg-[#030d24]/60">
                {(['电力', '制冷', 'IT负载', 'PUE'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEnergySubTab(tab)}
                    className={`text-[10.5px] px-2 py-0.5 rounded transition-all font-medium cursor-pointer ${energySubTab === tab ? 'bg-[#00D4FF] text-[#020a1c] font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Period tabs */}
              <div className="flex space-x-1.5 text-[10.5px] text-slate-400">
                {[
                  { id: '24h', label: '近24小时' },
                  { id: '7d', label: '近7天' },
                  { id: '30d', label: '近30天' }
                ].map(p => (
                  <span 
                    key={p.id}
                    onClick={() => setEnergyPeriod(p.id as '24h' | '7d' | '30d')}
                    className={`cursor-pointer transition-colors ${energyPeriod === p.id ? 'text-[#00D4FF] font-bold border-b border-[#00D4FF]' : 'hover:text-white'}`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Area Chart visualization */}
            <div className="flex-1 min-h-0 text-[10px]">
              <div className="text-[10px] text-slate-400 mb-1">单位: {energySubTab === 'PUE' ? '' : 'kW'}</div>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart 
                  data={energyTrendData[energyPeriod]} 
                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020a1c', borderColor: '#00d4ff', color: '#fff', fontSize: '11px' }}
                    labelClassName="text-slate-400 font-bold"
                  />
                  <Area 
                    type="monotone" 
                    dataKey={energySubTab} 
                    stroke="#00D4FF" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Real-time Alarms Card */}
          <Card title="实时告警 (A1机楼)" extra="更多 >" className="flex-1 min-h-0 flex flex-col">
            {/* Filter tabs */}
            <div className="flex space-x-1.5 mb-2.5 shrink-0 border-b border-slate-800 pb-1.5">
              {(['全部', '严重', '重要', '一般', '提示'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAlarmTab(tab)}
                  className={`text-[11px] px-2.5 py-0.5 rounded transition-all font-medium cursor-pointer ${
                    alarmTab === tab 
                      ? 'bg-[#00D4FF]/15 border border-[#00D4FF] text-[#00D4FF]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Alarm List (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar text-[11.5px] font-sans space-y-2 pr-1">
              {filteredAlarms.length > 0 ? (
                filteredAlarms.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center bg-[#071329]/40 hover:bg-[#071329]/80 border border-[#00d4ff]/10 hover:border-[#00d4ff]/30 p-2 rounded transition-colors"
                  >
                    <div className="flex items-center space-x-1.5 max-w-[70%]">
                      <AlertOctagon size={13} className={item.color} />
                      <span className="text-slate-200 truncate">{item.content}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${item.color}`}>{item.level}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{item.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-[12px]">
                  无活跃警报事件
                </div>
              )}
            </div>
          </Card>

        </div>

      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="h-[180px] shrink-0 grid grid-cols-4 gap-4">
        
        {/* PUE Card */}
        <Card title="PUE 实时监控" className="flex flex-col">
          <div className="flex-1 flex items-center justify-between pr-4">
            {/* PUE Dial Gauge */}
            <div className="w-[100px] h-[100px] relative flex justify-center items-center shrink-0">
              <svg width="90" height="90" viewBox="0 0 90 90">
                {/* Background Ring */}
                <circle 
                  cx="45" cy="45" r="36" 
                  stroke="rgba(0, 212, 255, 0.1)" strokeWidth="6" 
                  fill="transparent" 
                />
                {/* Indicator Arc */}
                <circle 
                  cx="45" cy="45" r="36" 
                  stroke="#00D4FF" strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray="226" 
                  strokeDashoffset="75" 
                  strokeLinecap="round"
                  className="shadow-glow"
                />
              </svg>
              {/* Metric center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 leading-tight">PUE</span>
                <span className="text-[20px] font-bold text-white font-mono leading-tight">1.35</span>
              </div>
            </div>

            {/* Averages */}
            <div className="flex-1 flex flex-col gap-2 ml-4 text-[13px] font-sans justify-center">
              <div className="flex justify-between items-center border-b border-[#00d4ff]/10 pb-1.5">
                <span className="text-slate-400">本月平均</span>
                <span className="text-white font-bold font-mono">1.32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">本年平均</span>
                <span className="text-white font-bold font-mono">1.28</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Energy Overview Card */}
        <Card title="能耗概览 (今日)" className="flex flex-col">
          <div className="flex-1 grid grid-cols-2 gap-2 h-full py-1">
            {[
              { val: '28,542', label: '总耗电量', unit: 'kWh' },
              { val: '18,632', label: 'IT耗电量', unit: 'kWh' },
              { val: '6,540', label: '制冷耗电量', unit: 'kWh' },
              { val: '3,370', label: '其他耗电量', unit: 'kWh' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#030d24]/60 border border-[#00d4ff]/10 hover:border-[#00d4ff]/35 rounded p-2 flex flex-col justify-center transition-colors">
                <div className="text-[10.5px] text-slate-400 font-sans">{stat.label}</div>
                <div className="mt-1 flex items-baseline justify-between font-mono">
                  <span className="text-[15px] font-bold text-white tracking-wide">{stat.val}</span>
                  <span className="text-[9.5px] text-[#00D4FF] ml-1">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Capacity Overview Card */}
        <Card title="容量概览 (A1机楼)" extra="更多 >" className="flex flex-col">
          <div className="flex-1 flex flex-col gap-2.5 justify-center py-1">
            {/* Cabinet Allocation */}
            <div className="text-[12.5px] font-sans">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">机柜容量 (使用率: <span className="text-[#FF9500] font-bold">66.6%</span>)</span>
                <span className="text-white font-mono text-[12px]"><span className="font-bold">682</span> / 1,024</span>
              </div>
              <div className="w-full h-2.5 bg-brand-overlay border border-[#00d4ff]/10 rounded overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00D4FF] rounded-r shadow-glow" style={{ width: '66.6%' }} />
              </div>
            </div>

            {/* Power capacity load */}
            <div className="text-[12.5px] font-sans">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">功率负荷 (IT负载率: <span className="text-[#00D4FF] font-bold">68.5%</span>)</span>
                <span className="text-white font-mono text-[12px]"><span className="font-bold">1,280</span> / 1,870 kW</span>
              </div>
              <div className="w-full h-2.5 bg-brand-overlay border border-[#00d4ff]/10 rounded overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00D4FF] rounded-r shadow-glow" style={{ width: '68.5%' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Operations Tickets Card */}
        <Card title="运维工单 (A1机楼)" extra="更多 >" className="flex flex-col">
          <div className="flex-1 flex items-center justify-around h-full">
            {[
              { val: 8, label: '待处置', color: 'border-[#FF9500] text-[#FF9500] bg-[#FF9500]/5' },
              { val: 12, label: '处置中', color: 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/5' },
              { val: 32, label: '已完成', color: 'border-[#34C759] text-[#34C759] bg-[#34C759]/5' }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className={`w-[68px] py-2 border rounded flex flex-col items-center justify-center transition-transform hover:scale-105 duration-200 ${stat.color} shadow-sm cursor-pointer`}
              >
                <span className="text-[20px] font-bold font-mono tracking-tight">{stat.val}</span>
                <span className="text-[11px] font-sans mt-0.5 opacity-90">{stat.label}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
