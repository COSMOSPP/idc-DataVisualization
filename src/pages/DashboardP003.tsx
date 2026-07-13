import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const trendData = [
  { month: '1月', cpu: 65, mem: 55, storage: 40 },
  { month: '2月', cpu: 68, mem: 58, storage: 42 },
  { month: '3月', cpu: 75, mem: 65, storage: 45 },
  { month: '4月', cpu: 82, mem: 70, storage: 48 },
  { month: '5月', cpu: 80, mem: 72, storage: 50 },
  { month: '6月', cpu: 85, mem: 75, storage: 55 }
];

const idleData = [
  { name: '僵尸实例', value: 15 },
  { name: '低负载服务器', value: 25 },
  { name: '未分配IP', value: 40 },
  { name: '孤儿磁盘', value: 20 }
];

const COLORS = ['#FF3B30', '#FF9500', '#34C759', '#00D4FF'];

export default function DashboardP003() {
  return (
    <div className="h-full w-full grid grid-cols-12 grid-rows-2 gap-6">
      {/* Top Row */}
      <div className="col-span-8 row-span-1 grid grid-cols-3 gap-6">
        <Card title="总计算容量">
          <div className="flex flex-col justify-center h-full pb-4">
            <AnimatedNumber value={256000} suffix="vCPU" className="text-4xl font-bold mb-2" />
            <div className="w-full bg-brand-overlay h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-brand-primary h-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-slate-400">已分配 192,000</span>
              <span className="text-brand-primary">75% 分配率</span>
            </div>
          </div>
        </Card>
        <Card title="总存储容量">
          <div className="flex flex-col justify-center h-full pb-4">
            <AnimatedNumber value={850} suffix="PB" className="text-4xl font-bold mb-2 text-[#34C759]" />
            <div className="w-full bg-brand-overlay h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#34C759] h-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-slate-400">已使用 510 PB</span>
              <span className="text-[#34C759]">60% 使用率</span>
            </div>
          </div>
        </Card>
        <Card title="公网带宽">
          <div className="flex flex-col justify-center h-full pb-4">
            <AnimatedNumber value={12.5} suffix="Tbps" className="text-4xl font-bold mb-2 text-[#FF9500]" />
            <div className="w-full bg-brand-overlay h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#FF9500] h-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-slate-400">峰值 10.6 Tbps</span>
              <span className="text-[#FF9500]">85% 利用率</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-4 row-span-1">
        <Card title="闲置资源分析" className="h-full">
          <div className="h-full w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={idleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {idleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff' }} />
                <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ color: '#E2E8F0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="col-span-12 row-span-1">
        <Card title="资源利用率趋势 (近6个月)" className="h-full">
          <div className="h-full w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102A43" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1C30', borderColor: '#00D4FF', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="cpu" name="CPU利用率" stroke="#00D4FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="mem" name="内存利用率" stroke="#34C759" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="storage" name="存储利用率" stroke="#FF9500" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
