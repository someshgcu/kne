import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import {
    LogOut,
    GraduationCap,
    Users,
    FileText,
    TrendingUp,
    Calendar,
    Bell
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                                <GraduationCap className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Principal Dashboard</h1>
                                <p className="text-sm text-muted">Welcome back, Principal</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                        >
                            <LogOut className="size-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Total Students</p>
                                <p className="text-2xl font-bold text-foreground">2,547</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <FileText className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Pending Approvals</p>
                                <p className="text-2xl font-bold text-foreground">18</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Faculty Members</p>
                                <p className="text-2xl font-bold text-foreground">124</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                <Calendar className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Upcoming Events</p>
                                <p className="text-2xl font-bold text-foreground">7</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Bell className="size-5" />
                        Recent Notifications
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium text-foreground">New admission request pending</p>
                                <p className="text-xs text-muted mt-1">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Faculty meeting scheduled for tomorrow</p>
                                <p className="text-xs text-muted mt-1">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Annual report ready for review</p>
                                <p className="text-xs text-muted mt-1">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
