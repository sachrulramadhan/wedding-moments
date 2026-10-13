import React from 'react';

interface ActivityChartProps {
  totalUploads: number;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ totalUploads }) => {
  // Activity breakdown by wedding timeline intervals
  const timeSlots = [
    { label: '4 PM', name: 'Ceremony & Vows', count: 18, pct: 35 },
    { label: '5 PM', name: 'Cocktails & Sunset', count: 42, pct: 75 },
    { label: '7 PM', name: 'Dinner & Toasts', count: 56, pct: 100 },
    { label: '8 PM', name: 'First Dance', count: 48, pct: 85 },
    { label: '9 PM', name: 'Party & Cake', count: 34, pct: 60 },
    { label: '10 PM', name: 'Late Night Joy', count: 22, pct: 40 },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-stone-900">Upload Activity Timeline</h3>
          <p className="text-xs text-stone-500">Peak moments when guests captured the most photos</p>
        </div>
        <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full tabular-nums">
          Live Evening Stream
        </span>
      </div>

      {/* Bar Chart */}
      <div className="pt-4 grid grid-cols-6 gap-2 sm:gap-4 items-end h-44">
        {timeSlots.map((slot, i) => (
          <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-stone-600 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
              {slot.count}
            </span>
            <div className="w-full bg-stone-100 rounded-t-xl h-full flex items-end overflow-hidden p-1">
              <div
                className="w-full bg-stone-900 group-hover:bg-amber-900 transition-all rounded-t-lg duration-500"
                style={{ height: `${slot.pct}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-stone-500 whitespace-nowrap">
              {slot.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
