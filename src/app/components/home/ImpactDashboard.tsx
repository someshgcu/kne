import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { performanceData } from '../../../data/mockData';
import { TrendingUp } from 'lucide-react';

export function ImpactDashboard() {
  // Prepare data for bar chart (comparing streams)
  const streamComparison = [
    {
      stream: 'Science',
      passRate: performanceData.find(d => d.year === '2024' && d.stream === 'Science')?.passRate || 0,
      distinctionRate: performanceData.find(d => d.year === '2024' && d.stream === 'Science')?.distinctionRate || 0
    },
    {
      stream: 'Commerce',
      passRate: performanceData.find(d => d.year === '2024' && d.stream === 'Commerce')?.passRate || 0,
      distinctionRate: performanceData.find(d => d.year === '2024' && d.stream === 'Commerce')?.distinctionRate || 0
    }
  ];

  // Prepare data for pie chart (overall pass/fail)
  const overallData = [
    { name: 'Passed', value: 99, color: '#10B981' },
    { name: 'Failed', value: 1, color: '#EF4444' }
  ];

  // Prepare trend data (year-wise)
  const yearlyTrend = [
    { year: '2022', passRate: 96.5 },
    { year: '2023', passRate: 97.5 },
    { year: '2024', passRate: 98.5 }
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

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stream Comparison Bar Chart */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-xl font-semibold text-primary mb-6">
              Stream-wise Performance (2024)
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
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDFDFE', 
                    border: '1px solid #D8D1E9',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="passRate" 
                  fill="#2C1F70" 
                  name="Pass Rate (%)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="distinctionRate" 
                  fill="#EFD22E" 
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
              <p className="text-3xl font-bold text-primary">99%</p>
              <p className="text-sm text-body">Students achieved success in 2024</p>
            </div>
          </div>

          {/* Yearly Trend */}
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border lg:col-span-2">
            <h3 className="text-xl font-semibold text-primary mb-6">
              Three-Year Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={yearlyTrend}
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
                <Bar 
                  dataKey="passRate" 
                  fill="#2C1F70" 
                  name="Pass Rate (%)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-body">
                Consistent improvement demonstrating our commitment to academic excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
