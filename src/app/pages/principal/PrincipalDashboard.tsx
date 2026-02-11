import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import {
    LogOut,
    GraduationCap,
    FileText,
    History,
    Building2,
    Users,
    Newspaper,
    ExternalLink,
    Shield,
    Palette,
    Upload,
    BookOpen
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
            title: 'Manage Courses',
            description: 'Add, edit, and manage courses offered',
            icon: BookOpen,
            path: '/principal/courses',
            color: 'bg-indigo-500'
        },
        {
            title: 'Manage News',
            description: 'Add, edit, and manage news articles',
            icon: Newspaper,
            path: '/principal/news',
            color: 'bg-blue-500'
        },
        {
            title: 'Manage Faculty',
            description: 'Add, edit, and manage faculty members',
            icon: Users,
            path: '/principal/faculty',
            color: 'bg-purple-500'
        },
        {
            title: 'Front Office Overview',
            description: 'View admission leads and statistics',
            icon: Building2,
            path: '/principal/reception-view',
            color: 'bg-green-500'
        },
        {
            title: 'Bulk Data Upload',
            description: 'Import faculty and student data from Excel',
            icon: Upload,
            path: '/admin/data-upload',
            color: 'bg-amber-500'
        },
        {
            title: 'Visual Editor',
            description: 'Click-to-edit website sections visually',
            icon: Palette,
            path: '/principal/content',
            color: 'bg-orange-500'
        },
        {
            title: 'Content Editor',
            description: 'Edit website text content',
            icon: FileText,
            path: '/principal/editor',
            color: 'bg-teal-500'
        },
        {
            title: 'Audit Logs',
            description: 'Track all system activities',
            icon: History,
            path: '/principal/audit',
            color: 'bg-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-card rounded-2xl border border-border p-8 mb-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, Principal</h2>
                    <p className="text-muted">
                        Manage your institution's content, faculty, and monitor all activities from this central dashboard.
                        All changes are logged for accountability.
                    </p>
                </div>

                {/* Navigation Hub */}
                <h3 className="text-lg font-semibold text-foreground mb-4">Management Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Public Site Preview</h3>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                            View Website
                            <ExternalLink className="size-3" />
                        </a>
                        <a
                            href="/faculty"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                            Public Faculty Page
                            <ExternalLink className="size-3" />
                        </a>
                        <a
                            href="/news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                            Public News Page
                            <ExternalLink className="size-3" />
                        </a>
                    </div>
                </div>
            </main >
        </div >
    );
}
