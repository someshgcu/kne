import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { updateAdmissionStatus } from '../../../lib/db-helpers';
import type { Admission, AdmissionStatus } from '../../../types/firestore';
import { toast } from 'sonner';
import {
    LogOut,
    Building2,
    UserPlus,
    Phone,
    TrendingUp,
    Save,
    Loader2,
    Plus,
    X
} from 'lucide-react';

export function ReceptionDashboard() {
    const navigate = useNavigate();
    const [admissions, setAdmissions] = useState<(Admission & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRow, setEditingRow] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ status: AdmissionStatus; notes: string }>({ status: 'New', notes: '' });
    const [savingRow, setSavingRow] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLead, setNewLead] = useState({ studentName: '', phone: '', course: 'Science' });
    const [addingLead, setAddingLead] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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
            console.error('[ReceptionDashboard] Error fetching admissions:', error);
            toast.error('Failed to load admissions');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Calculate stats
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalLeads = admissions.length;
        const calledToday = admissions.filter(a => {
            if (a.status !== 'Called') return false;
            const timestamp = a.lastUpdated instanceof Timestamp
                ? a.lastUpdated.toDate()
                : a.timestamp instanceof Timestamp
                    ? a.timestamp.toDate()
                    : new Date(a.timestamp as any);
            return timestamp >= today;
        }).length;
        const interested = admissions.filter(a => a.status === 'Interested').length;
        const interestedPercent = totalLeads > 0 ? Math.round((interested / totalLeads) * 100) : 0;

        return { totalLeads, calledToday, interestedPercent };
    }, [admissions]);

    // Start editing a row
    const startEdit = (admission: Admission & { id: string }) => {
        setEditingRow(admission.id);
        setEditValues({ status: admission.status, notes: admission.notes || '' });
    };

    // Save edited row
    const saveEdit = async (id: string) => {
        setSavingRow(id);
        const success = await updateAdmissionStatus(id, editValues.status, editValues.notes, auth.currentUser);
        if (success) {
            toast.success('Lead updated successfully');
            setEditingRow(null);
        } else {
            toast.error('Failed to update lead');
        }
        setSavingRow(null);
    };

    // Add new lead
    const handleAddLead = async () => {
        if (!newLead.studentName.trim() || !newLead.phone.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setAddingLead(true);
        try {
            await addDoc(collection(db, 'admissions'), {
                studentName: newLead.studentName.trim(),
                phone: newLead.phone.trim(),
                course: newLead.course,
                status: 'New' as AdmissionStatus,
                notes: '',
                timestamp: serverTimestamp()
            });
            toast.success('New lead added successfully');
            setNewLead({ studentName: '', phone: '', course: 'Science' });
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding lead:', error);
            toast.error('Failed to add lead');
        }
        setAddingLead(false);
    };

    // Format date
    const formatDate = (timestamp: Timestamp | Date | any) => {
        if (!timestamp) return '-';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Status badge colors
    const statusColors: Record<AdmissionStatus, string> = {
        'New': 'bg-blue-100 text-blue-700',
        'Called': 'bg-yellow-100 text-yellow-700',
        'Interested': 'bg-green-100 text-green-700',
        'Not Interested': 'bg-red-100 text-red-700'
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
                                <h1 className="text-xl font-bold text-foreground">Front Office CRM</h1>
                                <p className="text-sm text-muted">Admissions Lead Management</p>
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <UserPlus className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Total Leads</p>
                                <p className="text-2xl font-bold text-foreground">{stats.totalLeads}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                                <Phone className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Called Today</p>
                                <p className="text-2xl font-bold text-foreground">{stats.calledToday}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted">Interested %</p>
                                <p className="text-2xl font-bold text-foreground">{stats.interestedPercent}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Lead Form */}
                {showAddForm && (
                    <div className="bg-card rounded-xl p-6 border-2 border-accent shadow-sm mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Add New Lead</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-muted hover:text-foreground">
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Student Name *"
                                value={newLead.studentName}
                                onChange={(e) => setNewLead({ ...newLead, studentName: e.target.value })}
                                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                value={newLead.phone}
                                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <select
                                value={newLead.course}
                                onChange={(e) => setNewLead({ ...newLead, course: e.target.value })}
                                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="Science">Science (PCMC/PCMB)</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts">Arts</option>
                            </select>
                            <button
                                onClick={handleAddLead}
                                disabled={addingLead}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 font-medium"
                            >
                                {addingLead ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                                Add Lead
                            </button>
                        </div>
                    </div>
                )}

                {/* Leads Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Admission Leads</h2>
                        {!showAddForm && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium text-sm"
                            >
                                <Plus className="size-4" />
                                Add Lead
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="size-8 animate-spin text-accent" />
                        </div>
                    ) : admissions.length === 0 ? (
                        <div className="text-center py-12 text-muted">
                            <UserPlus className="size-12 mx-auto mb-3 opacity-50" />
                            <p>No leads yet. Add your first lead to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/30">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Student Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Contact</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Course</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Notes</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Action</th>
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
                                                <a href={`tel:${admission.phone}`} className="text-accent hover:underline">
                                                    {admission.phone}
                                                </a>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted">
                                                {admission.course}
                                            </td>
                                            <td className="py-3 px-4">
                                                {editingRow === admission.id ? (
                                                    <select
                                                        value={editValues.status}
                                                        onChange={(e) => setEditValues({ ...editValues, status: e.target.value as AdmissionStatus })}
                                                        className="px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="Called">Called</option>
                                                        <option value="Interested">Interested</option>
                                                        <option value="Not Interested">Not Interested</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[admission.status]}`}>
                                                        {admission.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {editingRow === admission.id ? (
                                                    <input
                                                        type="text"
                                                        value={editValues.notes}
                                                        onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                                                        placeholder="Add notes..."
                                                        className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-muted">{admission.notes || '-'}</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {editingRow === admission.id ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => saveEdit(admission.id)}
                                                            disabled={savingRow === admission.id}
                                                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {savingRow === admission.id ? (
                                                                <Loader2 className="size-3 animate-spin" />
                                                            ) : (
                                                                <Save className="size-3" />
                                                            )}
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingRow(null)}
                                                            className="px-3 py-1 text-sm text-muted hover:text-foreground"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(admission)}
                                                        className="px-3 py-1 text-sm text-accent hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
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
