import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { LayoutDashboard, FileText, Upload, Users, LogOut, TrendingUp, GraduationCap } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();

  // NOTE: Auth check is now handled by ProtectedRoute wrapper in App.tsx
  // No need for useEffect auth check here - if user reaches this component,
  // they have already been verified by ProtectedRoute

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigate even on error
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
      description: 'Generate content using Gemini AI',
      icon: FileText,
      path: '/admin/content-studio',
      color: 'bg-purple-500'
    },
    {
      title: 'Data Upload',
      description: 'Upload Excel data for Impact Engine',
      icon: Upload,
      path: '/admin/data-upload',
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

  const stats = [
    { label: 'Total Students', value: '450+', icon: GraduationCap },
    { label: 'Pass Rate', value: '99%', icon: TrendingUp },
    { label: 'Faculty Members', value: '8', icon: Users },
    { label: 'News Articles', value: '5', icon: FileText }
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
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl shadow-md border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                    <stat.icon className="size-6" aria-hidden="true" />
                  </div>
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
                to="/admin/content-studio"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-3 rounded-lg transition-colors text-center"
              >
                Create New Post
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
