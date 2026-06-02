import { useEffect, useRef } from "react";
import { Terminal, Trash2 } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "trigger" | "close" | "change";
  message: string;
}

interface ConsoleLogsProps {
  logs: LogEntry[];
  onClear: () => void;
}

export default function ConsoleLogs({ logs, onClear }: ConsoleLogsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg overflow-hidden flex flex-col h-[260px] md:h-auto md:flex-1">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
            SYSTEM INTERACTION CONSOLE
          </span>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClear}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-800 text-xs flex items-center gap-1 font-mono"
            title="Clear logs"
          >
            <Trash2 size={13} />
            <span>清除</span>
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 italic h-full flex items-center justify-center">
            [等待觸發事件... 請用滑鼠/手指摸索手機左側螢幕邊緣]
          </div>
        ) : (
          logs.map((log) => {
            const typeColors = {
              info: "text-slate-400",
              success: "text-emerald-400",
              trigger: "text-indigo-400 font-semibold",
              close: "text-rose-400",
              change: "text-amber-400",
            };

            const typePrefix = {
              info: "ℹ [INFO]",
              success: "✔ [OK]",
              trigger: "⚡ [TRIGGER]",
              close: "✖ [CLOSE]",
              change: "🔄 [CHANGE]",
            };

            return (
              <div key={log.id} className="leading-relaxed hover:bg-slate-800/40 px-1 py-0.5 rounded transition-colors flex items-start gap-1">
                <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                <span className={`${typeColors[log.type]} shrink-0`}>
                  {typePrefix[log.type]}
                </span>
                <span className="text-slate-200 break-all">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
