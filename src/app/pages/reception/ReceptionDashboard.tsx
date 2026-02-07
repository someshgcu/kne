import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import {
    LogOut,
    Building2,
    UserPlus,
    ClipboardList,
    Phone,
    Clock,
    CheckCircle2
} from 'lucide-react';

export function ReceptionDashboard() {
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
                                <Building2 className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Front Office Dashboard</h1>
                                <p className="text-sm text-muted">Reception Management</p>
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
                                <UserPlus className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Today's Visitors</p>
                                <p className="text-2xl font-bold text-foreground">34</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                                <Clock className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Pending Enquiries</p>
                                <p className="text-2xl font-bold text-foreground">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Resolved Today</p>
                                <p className="text-2xl font-bold text-foreground">28</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <Phone className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Calls Received</p>
                                <p className="text-2xl font-bold text-foreground">56</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Enquiries */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <ClipboardList className="size-5" />
                        Recent Enquiries
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Purpose</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="py-3 px-4 text-sm text-foreground">Ramesh Kumar</td>
                                    <td className="py-3 px-4 text-sm text-muted">Admission Enquiry</td>
                                    <td className="py-3 px-4 text-sm text-muted">10:30 AM</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-3 px-4 text-sm text-foreground">Priya Singh</td>
                                    <td className="py-3 px-4 text-sm text-muted">Fee Payment</td>
                                    <td className="py-3 px-4 text-sm text-muted">11:15 AM</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-3 px-4 text-sm text-foreground">Amit Patel</td>
                                    <td className="py-3 px-4 text-sm text-muted">Document Verification</td>
                                    <td className="py-3 px-4 text-sm text-muted">12:00 PM</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                            In Progress
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
