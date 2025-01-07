import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { AnalyticsData } from '../types';

interface AnalyticsChartProps {
  data: AnalyticsData[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  const chartTypes = [
    { type: 'bar', label: 'Bar Chart' },
    { type: 'line', label: 'Line Chart' },
    { type: 'area', label: 'Area Chart' },
  ] as const;

  const renderChart = () => {
    const commonProps = {
      width: 500,
      height: 300,
      data: data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="postType" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend />
            <Bar dataKey="avgLikes" fill="#4ade80" name="Avg. Likes" />
            <Bar dataKey="avgShares" fill="#818cf8" name="Avg. Shares" />
            <Bar dataKey="avgComments" fill="#fb7185" name="Avg. Comments" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="postType" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="avgLikes" stroke="#4ade80" name="Avg. Likes" />
            <Line type="monotone" dataKey="avgShares" stroke="#818cf8" name="Avg. Shares" />
            <Line type="monotone" dataKey="avgComments" stroke="#fb7185" name="Avg. Comments" />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="postType" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend />
            <Area type="monotone" dataKey="avgLikes" fill="#4ade80" stroke="#4ade80" name="Avg. Likes" fillOpacity={0.3} />
            <Area type="monotone" dataKey="avgShares" fill="#818cf8" stroke="#818cf8" name="Avg. Shares" fillOpacity={0.3} />
            <Area type="monotone" dataKey="avgComments" fill="#fb7185" stroke="#fb7185" name="Avg. Comments" fillOpacity={0.3} />
          </AreaChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {chartTypes.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              chartType === type
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-gray-800/50 text-gray-400 hover:text-gray-200 border border-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};