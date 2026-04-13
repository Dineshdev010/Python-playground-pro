import { motion } from "framer-motion";
import { Terminal, Cpu, HardDrive, Shield, Activity, Network, Command, Hash, Server, TerminalSquare } from "lucide-react";

const icons = [
  { icon: Terminal, color: "text-emerald-500" },
  { icon: Cpu, color: "text-blue-500" },
  { icon: HardDrive, color: "text-amber-500" },
  { icon: Shield, color: "text-rose-500" },
  { icon: Activity, color: "text-purple-500" },
  { icon: Network, color: "text-sky-500" },
  { icon: Command, color: "text-emerald-400" },
  { icon: Hash, color: "text-primary" },
  { icon: Server, color: "text-blue-400" },
  { icon: TerminalSquare, color: "text-primary" },
];

export function LinuxSymbolsBackground() {
  const symbols = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    Icon: icons[i % icons.length].icon,
    color: icons[i % icons.length].color,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 40,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
      {/* Wallpaper Layer */}
      <div className="absolute inset-0 opacity-80 scale-100">
        <img
          src="/linux_wallpaper.png"
          alt="Linux Background"
          className="w-full h-full object-cover"
          onError={(event) => {
            // Keep a readable fallback if wallpaper asset fails to load.
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-emerald-950/60" />
      
      {/* Moving code-like particles */}
      {symbols.map((s) => (
        <motion.div
          key={s.id}
          initial={{ 
            x: `${s.x}%`, 
            y: `${s.y}%`, 
            opacity: 0,
            scale: 0.5,
            rotate: 0 
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            opacity: [0, 0.15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "linear",
          }}
          className={`absolute ${s.color} blur-[1px]`}
          style={{ width: s.size, height: s.size }}
        >
          <s.Icon strokeWidth={1} size={s.size} />
        </motion.div>
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Large penguin shadow */}
      <div className="absolute -bottom-20 -right-20 opacity-[0.02] pointer-events-none grayscale select-none">
        <span className="text-[400px]">🐧</span>
      </div>
    </div>
  );
}
