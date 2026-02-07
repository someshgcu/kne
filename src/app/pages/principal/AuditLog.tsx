import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { AuditLog as AuditLogType } from '../../../types/firestore';
import {
    ArrowLeft,
    Loader2,
    History,
    Filter,
    User,
    Calendar
} from 'lucide-react';

type RoleFilter = 'all' | 'admin' | 'principal' | 'front_office';

export function AuditLog() {
    const [logs, setLogs] = useState<(AuditLogType & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

    // Fetch audit logs in real-time
    useEffect(() => {
        const q = query(
            collection(db, 'audit_logs'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as (AuditLogType & { id: string })[];
            setLogs(data);
            setLoading(false);
        }, (error) => {
            console.error('[AuditLog] Error fetching logs:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter logs by role
    const filteredLogs = roleFilter === 'all'
        ? logs
        : logs.filter(log => log.userRole === roleFilter);

    // Format timestamp
    const formatDate = (timestamp: Timestamp | Date | any) => {
        if (!timestamp) return '-';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Role badge colors
    const roleColors: Record<string, string> = {
        'admin': 'bg-purple-100 text-purple-700',
        'principal': 'bg-blue-100 text-blue-700',
        'front_office': 'bg-green-100 text-green-700',
        'unknown': 'bg-gray-100 text-gray-700'
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/principal"
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <ArrowLeft className="size-5 text-muted" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <History className="size-6 text-accent" />
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">Audit Logs</h1>
                                    <p className="text-sm text-muted">Track all system activities</p>
                                </div>
                            </div>
                        </div>

                        {/* Role Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="size-4 text-muted" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="principal">Principal</option>
                                <option value="front_office">Front Office</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-accent" />
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-20 text-muted">
                            <History className="size-12 mx-auto mb-3 opacity-50" />
                            <p>No audit logs found{roleFilter !== 'all' ? ` for ${roleFilter}` : ''}.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-4 hover:bg-secondary/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <User className="size-4 text-muted" />
                                                <span className="font-medium text-foreground">
                                                    {log.userEmail}
                                                </span>
                                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[log.userRole] || roleColors['unknown']}`}>
                                                    {log.userRole}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground mb-1">
                                                <span className="font-semibold">{log.action}</span>
                                            </p>
                                            <p className="text-sm text-muted">
                                                {log.details}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted whitespace-nowrap">
                                            <Calendar className="size-3" />
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 text-center text-sm text-muted">
                    Showing {filteredLogs.length} of {logs.length} total logs
                </div>
            </main>
        </div>
    );
}
