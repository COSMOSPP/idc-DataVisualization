import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Cpu, Activity, Droplet, Zap } from 'lucide-react';

const taskData = [
  { time: '00:00', wait: 120, run: 450 },
  { time: '04:00', wait: 80, run: 500 },
  { time: '08:00', wait: 250, run: 850 },
  { time: '12:00', wait: 350, run: 920 },
  { time: '16:00', wait: 300, run: 880 },
  { time: '20:00', wait: 180, run: 600 },
  { time: '24:00', wait: 100, run: 400 },
];

const gpuData = [
  { name: 'H100', total: 4096, used: 3800 },
  { name: 'A100', total: 8192, used: 7500 },
  { name: 'A800', total: 2048, used: 1900 },
  { name: 'V100', total: 1024, used: 600 }
];

export default function DashboardP004() {
  return (
    <div className="h-full w-full grid grid-cols-12 grid-rows-2 gap-6">
      {/* Top Left: Key Metrics */}
      <div className="col-span-4 row-span-1 grid grid-cols-2 gap-4">
        <Card title="总算力规模" delay={0.1}>
          <div className="flex flex-col items-center justify-center h-full">
            <Cpu size={48} className="text-brand-primary mb-4" />
            <AnimatedNumber value={2500} suffix="PFLOPS" className="text-4xl font-bold" />
            <div className="text-slate-400 mt-2">FP16 峰值算力</div>
          </div>
        </Card>
        <Card title="当前任务数" delay={0.2}>
          <div className="flex flex-col items-center justify-center h-full">
            <Activity size={48} className="text-[#34C759] mb-4" />
            <AnimatedNumber value={1250} className="text-4xl font-bold text-[#34C759]" />
            <div className="text-slate-400 mt-2">运行中训练任务</div>
          </div>
        </Card>
        <Card title="液冷散热效能" delay={0.3}>
          <div className="flex flex-col items-center justify-center h-full">
            <Droplet size={48} className="text-[#00D4FF] mb-4 opacity-80" />
            <AnimatedNumber value={85} suffix="%" className="text-4xl font-bold text-[#00D4FF]" />
            <div className="text-slate-400 mt-2">热回收率</div>
          </div>
        </Card>
        <Card title="智算 PUE" delay={0.4}>
          <div className="flex flex-col items-center justify-center h-full">
            <Zap size={48} className="text-[#34C759] mb-4" />
            <AnimatedNumber value={1.12} className="text-4xl font-bold text-[#34C759]" />
            <div className="text-slate-400 mt-2">能效指标</div>
          </div>
        </Card>
      </div>

      {/* Top Right: GPU Pool */}
      <div className="col-span-8 row-span-1">
        <Card title="GPU 算力池资源分布" delay={0.2} className="h-full">
          <div className="h-full w-full min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpuData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#E2E8F0', fontSize: 14 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#102A43' }} contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff' }} />
                <Legend />
                <Bar dataKey="total" name="总卡数" fill="#102A43" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" name="已分配" fill="#00D4FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom: Task Trends */}
      <div className="col-span-12 row-span-1">
        <Card title="训练任务队列趋势" delay={0.3} className="h-full">
          <div className="h-full w-full min-h-[300px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9500" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF9500" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="run" name="运行中任务" stroke="#34C759" fillOpacity={1} fill="url(#colorRun)" />
                <Area type="monotone" dataKey="wait" name="排队中任务" stroke="#FF9500" fillOpacity={1} fill="url(#colorWait)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
