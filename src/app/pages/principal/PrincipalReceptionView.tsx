import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Admission, AdmissionStatus } from '../../../types/firestore';
import {
    ArrowLeft,
    Loader2,
    Building2,
    Users,
    TrendingUp,
    Phone,
    Calendar,
    Eye
} from 'lucide-react';

export function PrincipalReceptionView() {
    const [admissions, setAdmissions] = useState<(Admission & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch admissions in real-time
    useEffect(() => {
        const q = query(collection(db, 'admissions'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as (Admission & { id: string })[];
            setAdmissions(data);
            setLoading(false);
        }, (error) => {
            console.error('[PrincipalReceptionView] Error fetching admissions:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Calculate stats
    const stats = useMemo(() => {
        const total = admissions.length;
        const interested = admissions.filter(a => a.status === 'Interested').length;
        const called = admissions.filter(a => a.status === 'Called').length;
        const newLeads = admissions.filter(a => a.status === 'New').length;
        const conversionRate = total > 0 ? Math.round((interested / total) * 100) : 0;

        return { total, interested, called, newLeads, conversionRate };
    }, [admissions]);

    // Status colors
    const statusColors: Record<AdmissionStatus, string> = {
        'New': 'bg-blue-100 text-blue-700',
        'Called': 'bg-yellow-100 text-yellow-700',
        'Interested': 'bg-green-100 text-green-700',
        'Not Interested': 'bg-red-100 text-red-700'
    };

    // Format date
    const formatDate = (timestamp: Timestamp | Date | any) => {
        if (!timestamp) return '-';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/principal" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                <ArrowLeft className="size-5 text-muted" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <Building2 className="size-6 text-accent" />
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">Reception Overview</h1>
                                    <p className="text-sm text-muted">Read-only view of admission leads</p>
                                </div>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            <Eye className="size-4" />
                            View Only
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Total Forms</p>
                                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Conversion Rate</p>
                                <p className="text-2xl font-bold text-foreground">{stats.conversionRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                                <Phone className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Called</p>
                                <p className="text-2xl font-bold text-foreground">{stats.called}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <Calendar className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">New Leads</p>
                                <p className="text-2xl font-bold text-foreground">{stats.newLeads}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-card rounded-xl border border-border p-6 mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Lead Funnel</h2>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 text-center">
                            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-sm text-muted">Total</div>
                        </div>
                        <div className="text-muted">→</div>
                        <div className="flex-1 text-center">
                            <div className="text-3xl font-bold text-yellow-600">{stats.called}</div>
                            <div className="text-sm text-muted">Called</div>
                        </div>
                        <div className="text-muted">→</div>
                        <div className="flex-1 text-center">
                            <div className="text-3xl font-bold text-green-600">{stats.interested}</div>
                            <div className="text-sm text-muted">Interested</div>
                        </div>
                    </div>
                </div>

                {/* Leads Table (Read-only) */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">All Admission Leads</h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-accent" />
                        </div>
                    ) : admissions.length === 0 ? (
                        <div className="text-center py-20 text-muted">
                            <Users className="size-12 mx-auto mb-3 opacity-50" />
                            <p>No admission leads yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/30">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Student Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Phone</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Course</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admissions.map((admission) => (
                                        <tr key={admission.id} className="border-t border-border/50 hover:bg-secondary/20">
                                            <td className="py-3 px-4 text-sm text-muted">
                                                {formatDate(admission.timestamp)}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-foreground">
                                                {admission.studentName}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-foreground">
                                                {admission.phone}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted">
                                                {admission.course}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[admission.status]}`}>
                                                    {admission.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted max-w-xs truncate">
                                                {admission.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
