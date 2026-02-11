import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { usePerformanceData } from '../../../hooks/usePerformanceData';

export function ImpactDashboard() {
  const { data: performanceData, loading, error } = usePerformanceData();

  // Show loading state
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-10 animate-spin text-accent" />
            <span className="ml-3 text-muted">Loading performance data...</span>
          </div>
        </div>
      </section>
    );
  }

  // Prepare data for Academic Excellence Line Chart (year vs passRate per stream)
  const academicExcellenceData = ['2022', '2023', '2024'].map(year => {
    const scienceData = performanceData.find(d => d.year === year && d.stream === 'Science');
    const commerceData = performanceData.find(d => d.year === year && d.stream === 'Commerce');

    return {
      year,
      Science: scienceData?.passRate || 0,
      Commerce: commerceData?.passRate || 0
    };
  });

  // Prepare data for Stream Comparison Bar Chart (distinction rates for 2024)
  const streamComparison = [
    {
      stream: 'Science',
      distinctionRate: performanceData.find(d => d.year === '2024' && d.stream === 'Science')?.distinctionRate || 0
    },
    {
      stream: 'Commerce',
      distinctionRate: performanceData.find(d => d.year === '2024' && d.stream === 'Commerce')?.distinctionRate || 0
    }
  ];

  // Overall pass rate for 2024 (average of both streams)
  const science2024 = performanceData.find(d => d.year === '2024' && d.stream === 'Science');
  const commerce2024 = performanceData.find(d => d.year === '2024' && d.stream === 'Commerce');
  const overallPassRate = science2024 && commerce2024
    ? Math.round((science2024.passRate + commerce2024.passRate) / 2)
    : 0;

  const overallData = [
    { name: 'Passed', value: overallPassRate, color: '#10B981' },
    { name: 'Failed', value: 100 - overallPassRate, color: '#EF4444' }
  ];

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20"
      aria-labelledby="impact-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <TrendingUp className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Impact Engine</span>
          </div>
          <h2 id="impact-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Academic Excellence
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Data-driven insights showcasing our consistent performance and student success rates
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Using sample data. {error.message}
            </p>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Academic Excellence Line Chart */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border lg:col-span-2">
            <h3 className="text-xl font-semibold text-primary mb-6">
              Academic Excellence Trend (3-Year Performance)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={academicExcellenceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D8D1E9" />
                <XAxis
                  dataKey="year"
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                />
                <YAxis
                  domain={[90, 100]}
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                  label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft', fill: '#374151' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FDFDFE',
                    border: '1px solid #D8D1E9',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Science"
                  stroke="#2C1F70"
                  strokeWidth={3}
                  dot={{ fill: '#2C1F70', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Science Stream"
                />
                <Line
                  type="monotone"
                  dataKey="Commerce"
                  stroke="#EFD22E"
                  strokeWidth={3}
                  dot={{ fill: '#EFD22E', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Commerce Stream"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-body">
                Consistent improvement demonstrating our commitment to academic excellence across all streams
              </p>
            </div>
          </div>

          {/* Stream Comparison Bar Chart */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-xl font-semibold text-primary mb-6">
              Stream Comparison (2024 Distinction Rate)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={streamComparison}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D8D1E9" />
                <XAxis
                  dataKey="stream"
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                />
                <YAxis
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                  label={{ value: 'Distinction Rate (%)', angle: -90, position: 'insideLeft', fill: '#374151' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FDFDFE',
                    border: '1px solid #D8D1E9',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="distinctionRate"
                  fill="#2C1F70"
                  name="Distinction Rate (%)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Overall Pass Rate Pie Chart */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-xl font-semibold text-primary mb-6">
              Overall Success Rate (2024)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FDFDFE',
                    border: '1px solid #D8D1E9',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-primary">{overallPassRate}%</p>
              <p className="text-sm text-body">Students achieved success in 2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
