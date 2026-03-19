import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SpikeChartProps {
  spikes: Array<{
    timestamp: number;
    channel: number;
    amplitude: number;
    experiment?: string;
  }>;
}

export function SpikeChart({ spikes }: SpikeChartProps) {
  const data = spikes.map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString(),
    amplitude: s.amplitude,
    channel: s.channel,
    experiment: s.experiment || 'default',
  }));

  const channels = [...new Set(spikes.map(s => s.channel))];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {channels.map(ch => (
            <Line
              key={ch}
              type="monotone"
              dataKey="amplitude"
              data={data.filter(d => d.channel === ch)}
              name={`Channel ${ch}`}
              stroke={`hsl(${ch * 30 % 360}, 70%, 50%)`}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}