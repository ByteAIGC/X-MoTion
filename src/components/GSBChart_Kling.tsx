import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface GSBData {
  metric: string;
  good: number;
  same: number;
  bad: number;
}

const data: GSBData[] = [
  { metric: 'Motion Following', good: 30, same: 18, bad: 10 },
  { metric: 'Identity Consistency', good: 14, same: 40, bad: 4 },
  { metric: 'Visual Quality', good: 14, same: 24, bad: 20 },
];

const COLORS = {
  good: '#22c55e',
  same: '#eab308',
  bad: '#ef4444',
};

const ROW_H = 60;            // label row height
const CHART_H = ROW_H * 3 + 20; // + a bit of padding

export default function GSBChart_Kling() {
  return (
    <div className="w-full my-8 text-white">
      {/* Title */}
      <div className="text-center mb-6">
        <h4 className="text-2xl font-semibold">X-MoTion VS Kling-O1</h4>
      </div>

      {/* Overall GSB */}
      <div className="mb-6 text-left max-w-5xl mx-auto">
        <div className="mb-1">
          <span className="text-lg font-medium">Overall GSB: </span>
          <span className="text-lg font-bold">13.79%</span>
        </div>
        <div className="text-sm text-gray-400">GSB = (G - B) / (G + S + B)</div>
      </div>

      {/* Centered (Label + Bars) block */}
      <div className="w-full flex justify-center">
        <div className="flex items-center gap-6">
          {/* Labels column */}
          <div
            className="text-right pr-2"
            style={{ height: CHART_H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            {data.map((d) => (
              <div
                key={d.metric}
                style={{ height: ROW_H, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              >
                <span className="text-sm">{d.metric}</span>
              </div>
            ))}
          </div>

          {/* Bars column: exactly 40% of viewport width */}
          <div
            style={{
              width: '40vw',
              minWidth: 420,
              maxWidth: 720,
              height: CHART_H,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barCategoryGap="30%"
              >
                {/* IMPORTANT: domain should cover your totals; if you want "full bar = 100%", normalize your data first */}
                <XAxis type="number" domain={[0, 60]} hide />
                <YAxis type="category" dataKey="metric" hide />

                <Bar dataKey="good" stackId="a" fill={COLORS.good} barSize={26} radius={[8, 0, 0, 8]} />
                <Bar dataKey="same" stackId="a" fill={COLORS.same} barSize={26} />
                <Bar dataKey="bad" stackId="a" fill={COLORS.bad} barSize={26} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS.good }} />
          <span className="text-sm">Good (G)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS.same }} />
          <span className="text-sm">Same (S)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS.bad }} />
          <span className="text-sm">Bad (B)</span>
        </div>
      </div>
    </div>
  );
}
