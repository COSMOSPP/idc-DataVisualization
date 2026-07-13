import { Card } from '../components/Card';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ShieldAlert, Video, Thermometer, Wind, Zap, Bell, CheckCircle2, Server } from 'lucide-react';
import { motion } from 'motion/react';

const alarms = [
  { id: 1, time: '10:24:05', level: 'critical', desc: 'A栋103机房精密空调停机', status: '未处理' },
  { id: 2, time: '10:15:32', level: 'warning', desc: 'B栋201机柜温度偏高 (28°C)', status: '处理中' },
  { id: 3, time: '09:45:11', level: 'warning', desc: 'UPS-A组输入电压异常波动', status: '处理中' },
  { id: 4, time: '09:12:00', level: 'info', desc: '门禁系统同步失败', status: '已处理' },
  { id: 5, time: '08:30:45', level: 'critical', desc: 'C栋核心交换机端口Down', status: '已处理' },
];

export default function DashboardP005() {
  return (
    <div className="h-full w-full grid grid-cols-12 grid-rows-2 gap-6">
      {/* Top Left: Environment */}
      <div className="col-span-5 row-span-1">
        <Card title="动环实时监控" delay={0.1} className="h-full">
          <div className="grid grid-cols-2 gap-4 mt-4 h-full">
            <div className="bg-brand-overlay/30 border border-brand/30 rounded p-4 flex flex-col justify-between group hover:border-brand-primary transition-colors">
              <div className="flex justify-between items-start">
                <Thermometer className="text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-400 bg-brand-bg px-2 py-1 rounded">A栋均值</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mt-2">23.5 <span className="text-lg text-slate-400">°C</span></div>
                <div className="text-sm text-brand-primary mt-1">环境温度 正常</div>
              </div>
            </div>
            
            <div className="bg-brand-overlay/30 border border-brand/30 rounded p-4 flex flex-col justify-between group hover:border-brand-primary transition-colors">
              <div className="flex justify-between items-start">
                <Wind className="text-[#00D4FF] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-400 bg-brand-bg px-2 py-1 rounded">A栋均值</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mt-2">45.2 <span className="text-lg text-slate-400">%</span></div>
                <div className="text-sm text-[#00D4FF] mt-1">环境湿度 正常</div>
              </div>
            </div>

            <div className="bg-brand-overlay/30 border border-brand/30 rounded p-4 flex flex-col justify-between group hover:border-brand-warning transition-colors">
              <div className="flex justify-between items-start">
                <Zap className="text-brand-warning group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-400 bg-brand-bg px-2 py-1 rounded">总配电</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-warning mt-2">4,250 <span className="text-lg text-slate-400">kW</span></div>
                <div className="text-sm text-brand-warning mt-1">实时负荷 较高</div>
              </div>
            </div>

            <div className="bg-brand-overlay/30 border border-brand/30 rounded p-4 flex flex-col justify-between group hover:border-brand-success transition-colors">
              <div className="flex justify-between items-start">
                <ShieldAlert className="text-brand-success group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-400 bg-brand-bg px-2 py-1 rounded">漏水检测</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-success mt-2">正常</div>
                <div className="text-sm text-slate-400 mt-1">无水浸报警</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Right: Video Surveillance */}
      <div className="col-span-7 row-span-1">
        <Card title="视频监控矩阵" delay={0.2} className="h-full">
          <div className="grid grid-cols-3 gap-4 mt-2 h-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="relative bg-black rounded overflow-hidden border border-brand/30 group">
                {/* Mock Video Feed */}
                <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwZi0iLz48L3N2Zz4=')] mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video size={48} className="text-brand-overlay/50" />
                </div>
                <div className="absolute inset-0 scanline opacity-20"></div>
                {/* Video Overlay */}
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 text-xs text-white rounded font-mono border border-brand/50">
                  CAM-{i}0{i} A栋-{i}F走廊
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-2 h-2 bg-brand-danger rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-brand-danger font-bold">REC</span>
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-brand-primary font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  2026-07-11 10:24:55
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Left: Alarms */}
      <div className="col-span-8 row-span-1">
        <Card title="实时告警列表" delay={0.3} className="h-full">
          <div className="w-full h-full overflow-hidden flex flex-col mt-2">
            <div className="grid grid-cols-12 gap-4 text-slate-400 border-b border-brand/30 pb-2 mb-2 text-sm">
              <div className="col-span-2">时间</div>
              <div className="col-span-2">级别</div>
              <div className="col-span-6">描述</div>
              <div className="col-span-2">状态</div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {alarms.map((alarm, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  key={alarm.id} 
                  className={`grid grid-cols-12 gap-4 items-center p-3 rounded border ${
                    alarm.level === 'critical' ? 'bg-brand-danger/10 border-brand-danger/30' :
                    alarm.level === 'warning' ? 'bg-brand-warning/10 border-brand-warning/30' :
                    'bg-brand-overlay/30 border-brand/20'
                  }`}
                >
                  <div className="col-span-2 font-mono text-sm">{alarm.time}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded text-xs border ${
                      alarm.level === 'critical' ? 'bg-brand-danger/20 text-brand-danger border-brand-danger animate-breathe' :
                      alarm.level === 'warning' ? 'bg-brand-warning/20 text-brand-warning border-brand-warning' :
                      'bg-brand-primary/20 text-brand-primary border-brand-primary'
                    }`}>
                      {alarm.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-6 text-white text-sm">{alarm.desc}</div>
                  <div className="col-span-2 text-sm text-slate-400">{alarm.status}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Right: Device Status Overview */}
      <div className="col-span-4 row-span-1">
        <Card title="设备运行总览" delay={0.4} className="h-full">
          <div className="flex flex-col gap-6 mt-4 justify-center h-full">
            <div className="flex justify-between items-center p-4 bg-brand-overlay/30 rounded border border-brand/30">
              <div className="flex items-center gap-3">
                <Server className="text-white" />
                <span className="text-slate-300">服务器</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-brand-success font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 12,450</span>
                <span className="text-brand-warning font-bold flex items-center gap-1"><Bell size={14}/> 45</span>
                <span className="text-brand-danger font-bold flex items-center gap-1"><ShieldAlert size={14} className="animate-breathe"/> 5</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-brand-overlay/30 rounded border border-brand/30">
              <div className="flex items-center gap-3">
                <Wind className="text-white" />
                <span className="text-slate-300">精密空调</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-brand-success font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 320</span>
                <span className="text-brand-warning font-bold flex items-center gap-1"><Bell size={14}/> 12</span>
                <span className="text-brand-danger font-bold flex items-center gap-1"><ShieldAlert size={14} className="animate-breathe"/> 2</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-brand-overlay/30 rounded border border-brand/30">
              <div className="flex items-center gap-3">
                <Zap className="text-white" />
                <span className="text-slate-300">UPS电源</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-brand-success font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 64</span>
                <span className="text-brand-warning font-bold flex items-center gap-1"><Bell size={14}/> 2</span>
                <span className="text-brand-danger font-bold flex items-center gap-1"><ShieldAlert size={14} className="opacity-30"/> 0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
