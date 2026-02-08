import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getCountFromServer } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { LayoutDashboard, FileText, Users, LogOut, TrendingUp, GraduationCap, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { DataSeeder } from '../../components/admin/DataSeeder';

interface StatsData {
  totalStudents: number;
  passRate: string;
  facultyMembers: number;
  newsArticles: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin/login', { replace: true });
    }
  };

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
      path: '/faculty',
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
    <main className="min-h-screen bg-secondary/10">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-8" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-primary-foreground/80">INCPUC Management Portal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl shadow-md border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                    <stat.icon className="size-6" aria-hidden="true" />
                  </div>
                  {statsLoading && stat.value === '...' && (
                    <Loader2 className="size-4 animate-spin text-muted" />
                  )}
                </div>
                <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Admin Tools */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">Management Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="bg-card rounded-xl shadow-md border border-border p-8 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} text-white p-4 rounded-lg`}>
                    <tool.icon className="size-8" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-body">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-3 rounded-lg transition-colors text-center"
              >
                View Public Site
              </a>
              <Link
                to="/admin/layout"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-3 rounded-lg transition-colors text-center"
              >
                Edit Homepage
              </Link>
              <Link
                to="/admin/ai-generator"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-3 rounded-lg transition-colors text-center"
              >
                Create New Post
              </Link>
            </div>
          </div>
        </section>

        {/* Developer Tools Section */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="size-6 text-amber-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-primary">Developer Tools</h2>
          </div>
          <DataSeeder />
        </section>
      </div>
    </main>
  );
}
