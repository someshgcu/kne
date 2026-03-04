import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { LayoutDashboard, FileText, Users, TrendingUp, GraduationCap, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { DataSeeder } from '../../components/admin/DataSeeder';

interface StatsData {
  totalStudents: number;
  passRate: string;
  facultyMembers: number;
  newsArticles: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalStudents: 0,
    passRate: '99%',
    facultyMembers: 0,
    newsArticles: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch real stats from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [admissionsSnap, teachersSnap, newsSnap] = await Promise.all([
          getCountFromServer(collection(db, 'admissions')),
          getCountFromServer(collection(db, 'teachers')),
          getCountFromServer(collection(db, 'news'))
        ]);

        setStats({
          totalStudents: admissionsSnap.data().count || 0,
          passRate: '99%', // Static for now - no results collection yet
          facultyMembers: teachersSnap.data().count || 0,
          newsArticles: newsSnap.data().count || 0
        });
      } catch (error) {
        console.error('[AdminDashboard] Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const tools = [
    {
      title: 'Layout Manager',
      description: 'Reorder and toggle homepage sections',
      icon: LayoutDashboard,
      path: '/admin/layout',
      color: 'bg-blue-500'
    },
    {
      title: 'AI Blog Writer',
      description: 'Generate content using AI',
      icon: Sparkles,
      path: '/admin/ai-generator',
      color: 'bg-purple-500'
    },
    {
      title: 'Blog Editor',
      description: 'Write and edit blog posts manually',
      icon: FileText,
      path: '/admin/blog-editor',
      color: 'bg-green-500'
    },
    {
      title: 'Faculty Management',
      description: 'Add and manage teacher profiles',
      icon: Users,
      path: '/admin/faculty',
      color: 'bg-orange-500'
    }
  ];

  const statsDisplay = [
    { label: 'Total Students', value: statsLoading ? '...' : stats.totalStudents.toString(), icon: GraduationCap },
    { label: 'Pass Rate', value: stats.passRate, icon: TrendingUp },
    { label: 'Faculty Members', value: statsLoading ? '...' : stats.facultyMembers.toString(), icon: Users },
    { label: 'News Articles', value: statsLoading ? '...' : stats.newsArticles.toString(), icon: FileText }
  ];

  return (
    <main className="min-h-screen bg-[#FDFDFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#2C1F70]">
            Admin Dashboard
          </h1>
          <p className="text-[#9A84A6] mt-1">
            INCPUC Management Portal
          </p>
        </div>

        {/* Quick Stats */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#2C1F70] mb-6">
            Quick Stats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#D8D1E9] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#2C1F70] text-white p-3 rounded-xl">
                    <stat.icon className="size-6" />
                  </div>

                  {statsLoading && stat.value === "..." && (
                    <Loader2 className="size-4 animate-spin text-[#9A84A6]" />
                  )}
                </div>

                <p className="text-3xl font-bold text-[#2C1F70]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#9A84A6] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Management Tools */}
        <section>
          <h2 className="text-2xl font-bold text-[#2C1F70] mb-6">
            Management Tools
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="bg-white border border-[#D8D1E9] rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-[#EFD22E] transition-all group"
              >
                <div className="flex items-start gap-5">
                  <div className="bg-[#EFD22E] text-[#2C1F70] p-4 rounded-xl group-hover:scale-110 transition">
                    <tool.icon className="size-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#2C1F70] mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-[#9A84A6]">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-14">
          <div className="bg-[#2C1F70] text-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Quick Actions
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-center transition"
              >
                View Public Site
              </a>

              <Link
                to="/admin/layout"
                className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-center transition"
              >
                Edit Homepage
              </Link>

              <Link
                to="/admin/ai-generator"
                className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-center transition"
              >
                Create New Post
              </Link>
            </div>
          </div>
        </section>

        {/* Developer Tools */}
        <section className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="size-6 text-[#EFD22E]" />
            <h2 className="text-2xl font-bold text-[#2C1F70]">
              Developer Tools
            </h2>
          </div>

          <DataSeeder />
        </section>

      </div>
    </main>
  );
}
