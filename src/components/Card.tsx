import { motion } from 'motion/react';
import { CardProps } from '../types';

export function Card({ title, children, className = '', delay = 0, extra }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`bg-[#030d26]/60 backdrop-blur-md border border-[#00d4ff]/20 rounded-lg overflow-hidden flex flex-col relative box-shadow-glow ${className}`}
    >
      <div className="px-4 py-2.5 border-b border-[#00d4ff]/15 bg-gradient-to-r from-brand-overlay/40 to-transparent flex items-center justify-between relative">
        <div className="flex items-center">
          <div className="w-1 h-3.5 bg-brand-primary mr-2.5 rounded-full shadow-[0_0_8px_#00d4ff]" />
          <h3 className="text-[16px] font-bold text-white tracking-wider font-sans">{title}</h3>
        </div>
        {extra && (
          <div className="text-[12px] text-[#00d4ff]/80 hover:text-[#00D4FF] transition-colors cursor-pointer flex items-center z-20">
            {extra}
          </div>
        )}
        {/* Glowing sub-line inside header */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
      </div>
      <div className="p-4 flex-1 flex flex-col relative z-10 min-h-0">
        {children}
      </div>
      
      {/* Premium glowing corner accents */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[2px] border-l-[2px] border-brand-primary rounded-tl-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[2px] border-r-[2px] border-brand-primary rounded-tr-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[2px] border-l-[2px] border-brand-primary rounded-bl-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[2px] border-r-[2px] border-brand-primary rounded-br-sm shadow-[0_0_6px_rgba(0,212,255,0.7)] pointer-events-none"></div>
    </motion.div>
  );
}
