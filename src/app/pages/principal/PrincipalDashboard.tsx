import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import {
    LogOut,
    GraduationCap,
    FileText,
    History,
    Building2,
    Settings,
    ExternalLink,
    Shield
} from 'lucide-react';

export function PrincipalDashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const hubCards = [
        {
            title: 'Content Editor',
            description: 'Edit website sections and manage visibility',
            icon: FileText,
            path: '/principal/editor',
            color: 'bg-blue-500',
            internal: true
        },
        {
            title: 'Audit Logs',
            description: 'Track all system activities and changes',
            icon: History,
            path: '/principal/audit',
            color: 'bg-purple-500',
            internal: true
        },
        {
            title: 'Reception Dashboard',
            description: 'View and monitor admission leads',
            icon: Building2,
            path: '/reception',
            color: 'bg-green-500',
            internal: true
        },
        {
            title: 'Admin Dashboard',
            description: 'Access admin tools and settings',
            icon: Settings,
            path: '/admin/dashboard',
            color: 'bg-orange-500',
            internal: true
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-primary text-primary-foreground shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                                <GraduationCap className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Principal's Command Center</h1>
                                <p className="text-sm text-primary-foreground/80">Full system access and oversight</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-foreground/20 rounded-full text-sm">
                                <Shield className="size-4" />
                                Principal
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                            >
                                <LogOut className="size-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-card rounded-2xl border border-border p-8 mb-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, Principal</h2>
                    <p className="text-muted">
                        As Principal, you have full access to all areas of the system. Use the navigation below to manage content,
                        view audit logs, and oversee all department activities.
                    </p>
                </div>

                {/* Navigation Hub */}
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {hubCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.path}
                                to={card.path}
                                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`${card.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="size-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                                {card.title}
                                            </h4>
                                            <ExternalLink className="size-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm text-muted mt-1">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Links */}
                <div className="bg-secondary/30 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Also Available</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                            View Public Website
                            <ExternalLink className="size-3" />
                        </Link>
                        <Link
                            to="/faculty"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                            Faculty Directory
                        </Link>
                        <Link
                            to="/news"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                            News & Updates
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
