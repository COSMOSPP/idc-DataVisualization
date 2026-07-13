import React, { useState } from 'react';
import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  Building, 
  Server, 
  Database, 
  Cpu, 
  PieChart, 
  TrendingDown, 
  Zap, 
  Snowflake, 
  Globe, 
  HardDrive, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  ChevronRight
} from 'lucide-react';
import { ChinaMap } from '../components/ChinaMap';

// Chart mock data
const pueTrendData = [
  { name: '05-14', pue: 1.45 },
  { name: '05-15', pue: 1.42 },
  { name: '05-16', pue: 1.39 },
  { name: '05-17', pue: 1.41 },
  { name: '05-18', pue: 1.36 },
  { name: '05-19', pue: 1.30 },
  { name: '05-20', pue: 1.35 }
];

const costTrendData = [
  { name: '05-14', 电费: 600, 带宽费: 250, 运维费: 150, 其他: 80 },
  { name: '05-15', 电费: 620, 带宽费: 260, 运维费: 140, 其他: 70 },
  { name: '05-16', 电费: 580, 带宽费: 240, 运维费: 160, 其他: 90 },
  { name: '05-17', 电费: 640, 带宽费: 270, 运维费: 150, 其他: 85 },
  { name: '05-18', 电费: 610, 带宽费: 255, 运维费: 155, 其他: 75 },
  { name: '05-19', 电费: 630, 带宽费: 265, 运维费: 145, 其他: 80 },
  { name: '05-20', 电费: 650, 带宽费: 280, 运维费: 160, 其他: 95 }
];

const alarmTrendData = [
  { name: '05-14', 严重: 5, 重要: 12, 一般: 60, 提示: 110 },
  { name: '05-15', 严重: 4, 重要: 15, 一般: 55, 提示: 115 },
  { name: '05-16', 严重: 8, 重要: 18, 一般: 70, 提示: 130 },
  { name: '05-17', 严重: 6, 重要: 10, 一般: 65, 提示: 120 },
  { name: '05-18', 严重: 3, 重要: 14, 一般: 50, 提示: 105 },
  { name: '05-19', 严重: 7, 重要: 22, 一般: 80, 提示: 140 },
  { name: '05-20', 严重: 8, 重要: 32, 一般: 156, 提示: 320 }
];

const regions = [
  { id: 'nmg', name: '和林格尔', count: 58, left: '54%', top: '43%', color: '#00D4FF' },
  { id: 'jjj', name: '京津冀', count: 26, left: '66%', top: '40%', color: '#00D4FF' },
  { id: 'csj', name: '长三角', count: 35, left: '70%', top: '54%', color: '#FF9500', active: true },
  { id: 'yga', name: '粤港澳', count: 8, left: '61%', top: '74%', color: '#00D4FF' },
  { id: 'hz', name: '华中地区', count: 18, left: '58%', top: '52%', color: '#00D4FF' },
  { id: 'xn', name: '西南地区', count: 16, left: '42%', top: '58%', color: '#00D4FF' },
  { id: 'xb', name: '西北地区', count: 16, left: '24%', top: '35%', color: '#00D4FF' }
];

const keyCampuses = [
  { name: '北京亦庄园区', location: '北京 · 亦庄', pue: '1.32', status: '正常' },
  { name: '上海临港园区', location: '上海 · 临港', pue: '1.38', status: '正常' },
  { name: '广州南沙园区', location: '广州 · 南沙', pue: '1.28', status: '正常' },
  { name: '贵州贵安园区', location: '贵州 · 贵安', pue: '1.22', status: '正常' },
  { name: '内蒙古和林格尔园区', location: '呼和浩特 · 和林格尔', pue: '1.15', status: '正常' },
  { name: '河北张北园区', location: '张家口 · 张北', pue: '1.18', status: '正常' }
];

const topAlarms = [
  { content: '精密空调A1制冷失效', level: '严重', time: '05-20 14:20', status: '未处置', levelColor: 'text-[#FF3B30]', statusColor: 'text-[#FF3B30]' },
  { content: 'UPS电源输出异常', level: '严重', time: '05-20 13:46', status: '处置中', levelColor: 'text-[#FF3B30]', statusColor: 'text-[#FF9500]' },
  { content: '机柜A-102温度过高', level: '重要', time: '05-20 13:15', status: '处置中', levelColor: 'text-[#FF9500]', statusColor: 'text-[#FF9500]' },
  { content: '市电输入电压异常', level: '重要', time: '05-20 11:37', status: '已处置', levelColor: 'text-[#FF9500]', statusColor: 'text-[#34C759]' },
  { content: '网络链路丢包率高', level: '一般', time: '05-20 10:22', status: '已处置', levelColor: 'text-[#FFCC00]', statusColor: 'text-[#34C759]' }
];

// Circular progress dial component
const UtilizationDial = ({ percent, label, color }: { percent: number; label: string; color: string }) => {
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-slate-800"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={40}
            cy={40}
          />
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={40}
            cy={40}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-sm font-bold text-white font-mono">{percent}%</span>
      </div>
      <span className="text-[12px] text-slate-400 mt-1">{label}</span>
    </div>
  );
};

export default function DashboardP001() {
  const [activeRegion, setActiveRegion] = useState<string | null>('csj');

  return (
    <div className="h-full w-full flex flex-col gap-4">
      {/* 1. Top Row: Key Metrics Bar */}
      <div className="grid grid-cols-7 gap-4">
        {/* IDC 园区总数 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#00d4ff]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">IDC 园区总数</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <AnimatedNumber value={128} className="text-[20px] font-bold text-[#00D4FF] font-sans" />
              <span className="text-[10px] text-white ml-0.5">↑</span>
            </div>
            <div className="text-[10px] text-[#FF3B30] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↑ 12%</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 28V12l6-4v20M12 28V6l8-4v26M20 28V16l6-3v15M6 28h20" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 16h1M9 20h1M9 24h1M15 10h2M15 14h2M15 18h2M15 22h2M15 26h2M23 20h1M23 24h1" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-brand-primary rounded-br-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        </div>

        {/* 机房总数 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#00d4ff]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">机房总数</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <AnimatedNumber value={568} className="text-[20px] font-bold text-white font-sans" />
              <span className="text-[10px] text-white ml-0.5">↑</span>
            </div>
            <div className="text-[10px] text-[#34C759] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↑ 8%</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 3 L28 9 L28 23 L16 29 L4 23 L4 9 Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 3 L16 15 L28 9 M16 15 L4 9 M16 15 L16 29" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 12 L10 20 M22 12 L22 20" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-brand-primary rounded-br-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        </div>

        {/* 机柜总数 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#00d4ff]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">机柜总数</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <AnimatedNumber value={58236} className="text-[20px] font-bold text-white font-sans" />
              <span className="text-[10px] text-white ml-0.5">↑</span>
            </div>
            <div className="text-[10px] text-[#FF3B30] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↑ 10.2%</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 2 L26 7 L26 25 L16 30 L6 25 L6 7 Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 7 L16 12 L26 7 M16 12 L16 30" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 13 L16 18 L26 13 M6 19 L16 24 L26 19 M6 25 L16 30 L26 25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 9v1M21 9v1M11 15v1M21 15v1M11 21v1M21 21v1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-brand-primary rounded-br-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        </div>

        {/* 服务器总数 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#00d4ff]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">服务器总数</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <AnimatedNumber value={232560} className="text-[20px] font-bold text-white font-sans" />
              <span className="text-[10px] text-slate-400">台</span>
            </div>
            <div className="text-[10px] text-[#FF3B30] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↑ 11.4%</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h24v6H4zM4 14h24v6H4zM4 22h24v6H4z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8" cy="9" r="1.2" fill="currentColor" />
              <circle cx="13" cy="9" r="0.8" fill="currentColor" opacity="0.7" />
              <circle cx="8" cy="17" r="1.2" fill="currentColor" />
              <circle cx="13" cy="17" r="0.8" fill="currentColor" opacity="0.7" />
              <circle cx="8" cy="25" r="1.2" fill="currentColor" />
              <circle cx="13" cy="25" r="0.8" fill="currentColor" opacity="0.7" />
              <path d="M18 9h7M18 17h7M18 25h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-brand-primary rounded-br-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        </div>

        {/* 总上架率 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#00d4ff]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">总上架率</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <AnimatedNumber value={82.6} className="text-[20px] font-bold text-white font-sans" suffix="%" />
            </div>
            <div className="text-[10px] text-[#34C759] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↑ 6.8%</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 4 A12 12 0 1 0 28 16 M16 4 V16 H28 M18 2 A12 12 0 0 1 30 14 H18 V2 Z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-[#00d4ff] rounded-br-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        </div>

        {/* PUE 平均值 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#34c759]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">PUE 平均值</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-[20px] font-bold text-white font-sans">1.35</span>
            </div>
            <div className="text-[10px] text-[#34C759] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↓ 0.06</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 25 h24 M4 21 l5 -6 l6 7 l6 -11 l7 5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-[#34c759] rounded-tl-xs shadow-[0_0_4px_rgba(52,199,89,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-[#34c759] rounded-tr-xs shadow-[0_0_4px_rgba(52,199,89,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-[#34c759] rounded-bl-xs shadow-[0_0_4px_rgba(52,199,89,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-[#34c759] rounded-br-xs shadow-[0_0_4px_rgba(52,199,89,0.6)] pointer-events-none" />
        </div>

        {/* 总能耗 */}
        <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 rounded-lg p-3 flex items-center justify-between box-shadow-glow relative overflow-hidden group hover:border-[#00d4ff]/40 transition-all duration-300">
          <div className="flex flex-col justify-between z-10 flex-1">
            <div className="text-[12px] text-slate-400">总能耗</div>
            <div className="flex items-baseline space-x-1 mt-1">
              <AnimatedNumber value={1245.6} className="text-[20px] font-bold text-white font-sans" />
              <span className="text-[10px] text-slate-400">万 kWh</span>
            </div>
            <div className="text-[10px] text-[#FF3B30] mt-1 font-sans flex items-center">
              同比 <span className="font-bold ml-1">↑ 9.6%</span>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="flex flex-col items-center justify-center opacity-30 h-8 mx-3 z-10">
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
            <div className="w-[3px] h-[3px] rounded-full bg-[#00D4FF] my-0.5" />
            <div className="w-[1px] h-3 bg-[#00D4FF]" />
          </div>
          <div className="text-brand-primary/45 group-hover:text-brand-primary/70 group-hover:scale-105 transition-all duration-300 pointer-events-none pr-1 z-10">
            <svg className="w-11 h-11 drop-shadow-[0_0_6px_rgba(0,212,255,0.4)]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 2 L7 17 h10 l-3 13 L26 15 H16 Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-[#00d4ff] rounded-br-xs shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        </div>
      </div>

      {/* 2. Main Middle Section: 3-column layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left Column */}
        <div className="col-span-3 flex flex-col gap-4 h-full min-h-0">
          {/* Card 1: 资源利用情况 */}
          <Card 
            title="资源利用情况" 
            className="flex-1 min-h-0"
            extra={<span className="flex items-center">更多<ChevronRight size={13} className="ml-0.5" /></span>}
          >
            <div className="grid grid-cols-3 gap-2 py-2">
              <UtilizationDial percent={82.6} label="机柜利用率" color="#00D4FF" />
              <UtilizationDial percent={76.4} label="电力利用率" color="#34C759" />
              <UtilizationDial percent={63.8} label="算力利用率" color="#FF9500" />
            </div>
          </Card>

          {/* Card 2: 能效趋势 (PUE) */}
          <Card 
            title="能效趋势 (PUE)" 
            className="flex-1 min-h-0"
            extra={
              <div className="flex space-x-1.5">
                <button className="text-[10px] px-2 py-0.5 rounded bg-brand-primary/20 border border-brand-primary text-brand-primary font-bold">近7天</button>
                <button className="text-[10px] px-2 py-0.5 rounded border border-transparent text-slate-400 hover:text-white">近30天</button>
                <button className="text-[10px] px-2 py-0.5 rounded border border-transparent text-slate-400 hover:text-white">近一年</button>
              </div>
            }
          >
            <div className="w-full flex-1 min-h-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pueTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#102A43" opacity={0.5} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis domain={[1.0, 1.6]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff', fontSize: 12 }} />
                  <Area type="monotone" dataKey="pue" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorPue)" dot={{ r: 3, fill: '#00D4FF', strokeWidth: 1, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Card 3: 成本趋势 (万元) */}
          <Card 
            title="成本趋势 (万元)" 
            className="flex-1 min-h-0"
            extra={
              <div className="flex space-x-1.5">
                <button className="text-[10px] px-2 py-0.5 rounded bg-brand-primary/20 border border-brand-primary text-brand-primary font-bold">近7天</button>
                <button className="text-[10px] px-2 py-0.5 rounded border border-transparent text-slate-400 hover:text-white">近30天</button>
                <button className="text-[10px] px-2 py-0.5 rounded border border-transparent text-slate-400 hover:text-white">近一年</button>
              </div>
            }
          >
            <div className="w-full flex-1 min-h-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#102A43" opacity={0.5} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="电费" stackId="a" fill="#00D4FF" />
                  <Bar dataKey="带宽费" stackId="a" fill="#0066FF" />
                  <Bar dataKey="运维费" stackId="a" fill="#7A52FF" />
                  <Bar dataKey="其他" stackId="a" fill="#102A43" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 text-[10px] text-slate-400 mt-1">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#00D4FF] mr-1"></span> 电费</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#0066FF] mr-1"></span> 带宽费</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#7A52FF] mr-1"></span> 运维费</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#102A43] mr-1"></span> 其他</span>
            </div>
          </Card>
        </div>

        {/* Center Column */}
        <div className="col-span-6 flex flex-col min-h-0">
          {/* China map block */}
          <div className="flex-1 border border-[#00d4ff]/20 rounded-lg bg-[#030d26]/40 backdrop-blur-md relative flex flex-col overflow-hidden p-4 box-shadow-glow">
            {/* Premium glowing corner accents */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[2px] border-l-[2px] border-brand-primary rounded-tl-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[2px] border-r-[2px] border-brand-primary rounded-tr-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[2px] border-l-[2px] border-brand-primary rounded-bl-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[2px] border-r-[2px] border-brand-primary rounded-br-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>

            <div className="absolute top-4 left-4 text-[16px] font-bold tracking-widest text-white z-10 flex items-center font-sans">
              <div className="w-1.5 h-3.5 bg-brand-primary mr-2.5 rounded-full shadow-[0_0_8px_#00d4ff]" />
              全国 IDC 资源分布
            </div>

            {/* Map wrapper */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden w-full h-full mt-4" style={{ perspective: '1200px' }}>
              {/* 3D Tilted container */}
              <div 
                className="relative aspect-[774/569] max-w-full max-h-full w-full flex items-center justify-center" 
                style={{ 
                  transform: 'rotateX(26deg) rotateY(-6deg) scale(1.06)', 
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                {/* 3D Extrusion Shadow Layer */}
                <div 
                  className="absolute w-full h-full opacity-40 select-none pointer-events-none" 
                  style={{ 
                    transform: 'translateZ(-14px)',
                    filter: 'brightness(0.2) drop-shadow(0 0 12px rgba(0, 85, 255, 0.4))'
                  }}
                >
                  <ChinaMap className="w-full h-full select-none pointer-events-none" />
                </div>

                {/* Main Interactive Map Layer */}
                <ChinaMap 
                  className="w-full h-full opacity-90 select-none" 
                  style={{ 
                    filter: 'drop-shadow(0 0 16px rgba(0, 212, 255, 0.35))'
                  }} 
                />

                {/* Map Pins overlay inside the tilted container (will stay anchored geographically) */}
                {regions.map((region) => (
                  <motion.div
                    key={region.id}
                    className="absolute cursor-pointer z-20 group"
                    style={{ 
                      left: region.left, 
                      top: region.top,
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={() => setActiveRegion(region.id)}
                    whileHover={{ scale: 1.12 }}
                  >
                    {/* Counter-rotation to make pins stand upright relative to the screen and float above map surface */}
                    <div className="relative flex flex-col items-center justify-center" style={{ transform: 'translateZ(30px) rotateX(-26deg) rotateY(6deg)' }}>
                      {/* Ring ping animation */}
                      <div 
                        className="absolute w-8 h-8 rounded-full animate-ping opacity-50" 
                        style={{ backgroundColor: region.id === activeRegion ? '#FF9500' : '#00D4FF' }} 
                      />
                      
                      {/* Center Core dot */}
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-[11px] border-2 shadow-[0_0_12px_rgba(0,0,0,0.6)] transition-all ${
                          region.id === activeRegion 
                            ? 'bg-[#FF9500]/45 border-[#FF9500] text-[#FF9500] pulse-glow-orange' 
                            : 'bg-[#030d26]/80 border-brand-primary/45 text-slate-300 group-hover:text-white group-hover:border-brand-primary pulse-glow-cyan'
                        }`}
                      >
                        {region.count}
                      </div>

                      {/* Label below */}
                      <div 
                        className={`mt-1 text-[11px] font-sans font-medium whitespace-nowrap px-1.5 py-0.5 rounded shadow-[0_1px_4px_rgba(0,0,0,0.5)] transition-all ${
                          region.id === activeRegion 
                            ? 'bg-[#FF9500]/25 text-[#FF9500] font-bold border border-[#FF9500]/45' 
                            : 'bg-[#030d26]/85 text-slate-300 border border-brand-primary/10'
                        }`}
                      >
                        {region.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Flat Inset Map Box */}
              <div className="absolute bottom-4 right-4 w-[60px] h-[90px] border border-brand/40 bg-brand-card/80 backdrop-blur-sm rounded flex flex-col items-center justify-between p-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-30">
                <span className="text-[9px] text-slate-400 font-sans tracking-tight">南海诸岛</span>
                <div className="flex-1 w-full border-t border-brand/20 mt-1 pt-1 flex items-center justify-center opacity-40">
                  <svg className="w-full h-full" viewBox="0 0 20 40">
                    <line x1="10" y1="2" x2="10" y2="38" stroke="#00D4FF" strokeWidth="0.5" strokeDasharray="1 2" />
                    <circle cx="10" cy="15" r="1.5" fill="#00D4FF" />
                    <circle cx="12" cy="25" r="1" fill="#00D4FF" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 6 key campus statuses (bottom of center column) */}
          <div className="mt-4">
            <div className="text-sm font-bold text-white mb-2 flex items-center font-sans">
              <div className="w-1.5 h-3.5 bg-brand-primary mr-2 rounded-full shadow-[0_0_6px_#00d4ff]" />
              重点园区实时状态
            </div>
            <div className="grid grid-cols-6 gap-3">
              {keyCampuses.map((campus, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#030d26]/50 backdrop-blur-sm border border-[#00d4ff]/20 rounded p-2 flex flex-col justify-between box-shadow-glow hover:border-brand-primary/50 hover:shadow-[0_0_8px_rgba(0,212,255,0.2)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="text-[12px] font-bold text-white truncate">{campus.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{campus.location}</div>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#00d4ff]/10">
                    <span className="text-[11px] font-mono text-brand-primary font-medium">PUE {campus.pue}</span>
                    <span className="flex items-center text-[10px] text-brand-success font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success mr-1 shadow-[0_0_4px_#34c759]"></span>
                      正常
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 flex flex-col gap-4 h-full min-h-0">
          {/* Card 1: 告警概览 */}
          <Card 
            title="告警概览" 
            className="h-[144px] flex-none"
            extra={<span className="flex items-center">更多<ChevronRight size={13} className="ml-0.5" /></span>}
          >
            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {/* 严重 */}
              <div className="bg-gradient-to-br from-[#FF3B30]/20 to-[#FF3B30]/5 border border-[#FF3B30]/35 rounded p-2 flex flex-col justify-between h-[64px] hover:from-[#FF3B30]/25 transition-all duration-300 shadow-[0_0_8px_rgba(255,59,48,0.15)]">
                <div className="text-[11px] text-slate-300 font-sans tracking-wide">严重告警</div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <AlertTriangle size={17} className="text-[#FF3B30] drop-shadow-[0_0_6px_rgba(255,59,48,0.6)]" />
                  <span className="text-lg font-bold text-white font-mono leading-none">8</span>
                </div>
              </div>
              {/* 重要 */}
              <div className="bg-gradient-to-br from-[#FF9500]/20 to-[#FF9500]/5 border border-[#FF9500]/35 rounded p-2 flex flex-col justify-between h-[64px] hover:from-[#FF9500]/25 transition-all duration-300 shadow-[0_0_8px_rgba(255,149,0,0.15)]">
                <div className="text-[11px] text-slate-300 font-sans tracking-wide">重要告警</div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <AlertTriangle size={17} className="text-[#FF9500] drop-shadow-[0_0_6px_rgba(255,149,0,0.6)]" />
                  <span className="text-lg font-bold text-white font-mono leading-none">32</span>
                </div>
              </div>
              {/* 一般 */}
              <div className="bg-gradient-to-br from-[#FFCC00]/20 to-[#FFCC00]/5 border border-[#FFCC00]/35 rounded p-2 flex flex-col justify-between h-[64px] hover:from-[#FFCC00]/25 transition-all duration-300 shadow-[0_0_8px_rgba(255,204,0,0.15)]">
                <div className="text-[11px] text-slate-300 font-sans tracking-wide">一般告警</div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <AlertTriangle size={17} className="text-[#FFCC00] drop-shadow-[0_0_6px_rgba(255,204,0,0.6)]" />
                  <span className="text-lg font-bold text-white font-mono leading-none">156</span>
                </div>
              </div>
              {/* 提示 */}
              <div className="bg-gradient-to-br from-[#00D4FF]/20 to-[#00D4FF]/5 border border-[#00D4FF]/35 rounded p-2 flex flex-col justify-between h-[64px] hover:from-[#00D4FF]/25 transition-all duration-300 shadow-[0_0_8px_rgba(0,212,255,0.15)]">
                <div className="text-[11px] text-slate-300 font-sans tracking-wide">提示告警</div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#00D4FF] flex items-center justify-center text-slate-900 font-bold text-[10px] shadow-[0_0_5px_rgba(0,212,255,0.7)]">!</div>
                  <span className="text-lg font-bold text-white font-mono leading-none">320</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: 告警趋势 (近7天) */}
          <Card 
            title="告警趋势 (近7天)" 
            className="flex-1 min-h-0"
            extra={<span className="flex items-center">更多<ChevronRight size={13} className="ml-0.5" /></span>}
          >
            <div className="w-full flex-1 min-h-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alarmTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#102A43" opacity={0.5} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff', fontSize: 12 }} />
                  <Line type="monotone" dataKey="严重" stroke="#FF3B30" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="重要" stroke="#FF9500" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="一般" stroke="#FFCC00" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="提示" stroke="#00D4FF" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-3 text-[9px] text-slate-400 mt-1">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] mr-1"></span> 严重</span>
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] mr-1"></span> 重要</span>
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00] mr-1"></span> 一般</span>
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] mr-1"></span> 提示</span>
            </div>
          </Card>

          {/* Card 3: 告警事件 TOP5 */}
          <Card 
            title="告警事件 TOP5" 
            className="flex-1 min-h-0"
            extra={<span className="flex items-center">更多<ChevronRight size={13} className="ml-0.5" /></span>}
          >
            <div className="mt-1 flex-1 min-h-0 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-[11px] font-sans">
                <thead>
                  <tr className="border-b border-[#00d4ff]/15 text-slate-400 pb-1">
                    <th className="py-1.5 font-medium pl-1 text-[12px]">告警内容</th>
                    <th className="py-1.5 font-medium w-16 text-center text-[12px]">级别</th>
                    <th className="py-1.5 font-medium w-24 text-center text-[12px]">发生时间</th>
                    <th className="py-1.5 font-medium w-20 text-center text-[12px]">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#00d4ff]/10">
                  {topAlarms.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#00d4ff]/5 transition-colors">
                      <td className="py-1.5 pl-1 text-white truncate max-w-[120px] font-medium" title={item.content}>
                        {item.content}
                      </td>
                      <td className={`py-1.5 text-center font-bold ${item.levelColor}`}>
                        {item.level}
                      </td>
                      <td className="py-1.5 text-center text-slate-400 font-mono">
                        {item.time}
                      </td>
                      <td className={`py-1.5 text-center font-bold ${item.statusColor}`}>
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Bottom Row: Real-time Operational Data footer */}
      <div className="bg-[#030d26]/60 border border-[#00d4ff]/20 backdrop-blur-md rounded-lg p-3 box-shadow-glow flex items-center justify-between relative z-10 overflow-hidden">
        {/* Premium glowing corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-brand-primary rounded-tl-sm shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-brand-primary rounded-tr-sm shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-brand-primary rounded-bl-sm shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-brand-primary rounded-br-sm shadow-[0_0_4px_rgba(0,212,255,0.6)] pointer-events-none" />

        <div className="text-[14px] font-bold text-white tracking-wider flex items-center font-sans border-r border-[#00d4ff]/15 pr-5 mr-5 h-8 z-10">
          <div className="w-1 h-3.5 bg-brand-primary mr-2 rounded-full shadow-[0_0_6px_#00d4ff]" />
          实时运行
          <br />
          数据
        </div>
        
        <div className="flex-1 grid grid-cols-7 gap-6">
          {/* IT 负载 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <Server size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">IT 负载</div>
              <div className="flex items-baseline space-x-0.5">
                <AnimatedNumber value={68542} className="text-[15px] font-bold text-white font-mono" />
                <span className="text-[9px] text-slate-400">kW</span>
              </div>
            </div>
          </div>

          {/* 总功率 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">总功率</div>
              <div className="flex items-baseline space-x-0.5">
                <AnimatedNumber value={123642} className="text-[15px] font-bold text-white font-mono" />
                <span className="text-[9px] text-slate-400">kW</span>
              </div>
            </div>
          </div>

          {/* 制冷负载 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <Snowflake size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">制冷负载</div>
              <div className="flex items-baseline space-x-0.5">
                <AnimatedNumber value={38965} className="text-[15px] font-bold text-white font-mono" />
                <span className="text-[9px] text-slate-400">kW</span>
              </div>
            </div>
          </div>

          {/* 带宽使用 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <Globe size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">带宽使用</div>
              <div className="flex items-baseline space-x-0.5">
                <span className="text-[15px] font-bold text-white font-mono">56.3</span>
                <span className="text-[9px] text-slate-400">Tbps</span>
              </div>
            </div>
          </div>

          {/* 在线设备 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <HardDrive size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">在线设备</div>
              <div className="flex items-baseline space-x-0.5">
                <AnimatedNumber value={198560} className="text-[15px] font-bold text-white font-mono" />
                <span className="text-[9px] text-slate-400">台</span>
              </div>
            </div>
          </div>

          {/* 今日工单 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">今日工单</div>
              <div className="flex items-baseline space-x-0.5">
                <AnimatedNumber value={328} className="text-[15px] font-bold text-white font-mono" />
                <span className="text-[9px] text-slate-400">单</span>
              </div>
            </div>
          </div>

          {/* 巡检完成率 */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20 text-brand-primary">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">巡检完成率</div>
              <div className="flex items-baseline space-x-0.5">
                <span className="text-[15px] font-bold text-white font-mono">98.6</span>
                <span className="text-[9px] text-slate-400">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
