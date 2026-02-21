import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { logAction } from '../../../lib/db-helpers';
import { toast } from 'sonner';
import {
    Loader2,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Users,
    Award,
    BookOpen
} from 'lucide-react';

interface Teacher {
    id: string;
    name: string;
    course: string;
    subject?: string;
    results: number;
    photoUrl: string;
    about?: string;
}

export function PrincipalFacultyManager() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Teacher | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        course: 'Science',
        subject: '',
        results: 95,
        photoUrl: '',
        about: ''
    });

    // Fetch teachers in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'teachers'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Teacher[];
            setTeachers(data);
            setLoading(false);
        }, (error) => {
            console.error('[PrincipalFacultyManager] Error fetching teachers:', error);
            toast.error('Failed to load faculty');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Open modal for adding
    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            course: 'Science',
            subject: '',
            results: 95,
            photoUrl: '',
            about: ''
        });
        setShowModal(true);
    };

    // Open modal for editing
    const handleEdit = (item: Teacher) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            course: item.course,
            subject: item.subject || '',
            results: item.results,
            photoUrl: item.photoUrl,
            about: item.about || ''
        });
        setShowModal(true);
    };

    // Save
    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setSaving(true);
        try {
            const teacherData = {
                name: formData.name.trim(),
                course: formData.course,
                subject: formData.subject.trim(),
                results: Number(formData.results),
                photoUrl: formData.photoUrl.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
                about: formData.about.trim()
            };

            if (editingItem) {
                await updateDoc(doc(db, 'teachers', editingItem.id), {
                    ...teacherData,
                    updatedAt: serverTimestamp()
                });
                await logAction(auth.currentUser, 'Updated Faculty', `Updated teacher: "${formData.name}"`);
                toast.success('Faculty member updated');
            } else {
                await addDoc(collection(db, 'teachers'), {
                    ...teacherData,
                    createdAt: serverTimestamp()
                });
                await logAction(auth.currentUser, 'Added Faculty', `Added teacher: "${formData.name}"`);
                toast.success('Faculty member added');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving faculty:', error);
            toast.error('Failed to save faculty');
        }
        setSaving(false);
    };

    // Delete
    const handleDelete = async (item: Teacher) => {
        if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

        setDeleting(item.id);
        try {
            await deleteDoc(doc(db, 'teachers', item.id));
            await logAction(auth.currentUser, 'Deleted Faculty', `Deleted teacher: "${item.name}"`);
            toast.success('Faculty member deleted');
        } catch (error) {
            console.error('Error deleting faculty:', error);
            toast.error('Failed to delete faculty');
        }
        setDeleting(null);
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title + Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Faculty Manager</h1>
                        <p className="text-sm text-muted mt-1">Add, edit, and manage faculty members</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors"
                    >
                        <Plus className="size-4" />
                        Add Faculty
                    </button>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-accent" />
                    </div>
                ) : teachers.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border text-center py-20 text-muted">
                        <Users className="size-12 mx-auto mb-3 opacity-50" />
                        <p>No faculty members yet. Click "Add Faculty" to create one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={teacher.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`}
                                            alt={teacher.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground truncate">{teacher.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted mt-1">
                                                <BookOpen className="size-3" />
                                                <span>{teacher.course}</span>
                                            </div>
                                            {teacher.subject && (
                                                <p className="text-sm text-muted truncate">{teacher.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Award className="size-4 text-yellow-500" />
                                            <span className="text-sm font-medium text-foreground">{teacher.results}% Results</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(teacher)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher)}
                                                disabled={deleting === teacher.id}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deleting === teacher.id ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl shadow-xl max-h-[85vh] w-[90vw] max-w-lg flex flex-col p-0 gap-0 border border-border">
                        {/* Header: Fixed at top */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                            <h3 className="text-lg font-semibold text-foreground">
                                {editingItem ? 'Edit Faculty' : 'Add Faculty'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="size-5 text-muted" />
                            </button>
                        </div>

                        {/* Body: Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Enter faculty name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Course</label>
                                    <select
                                        value={formData.course}
                                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="Science">Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Results %</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.results}
                                        onChange={(e) => setFormData({ ...formData, results: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="e.g., Physics, Chemistry"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Photo URL</label>
                                <input
                                    type="url"
                                    value={formData.photoUrl}
                                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="https://example.com/photo.jpg (optional)"
                                />
                                <p className="text-xs text-muted mt-1">Leave empty for auto-generated avatar</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">About</label>
                                <textarea
                                    value={formData.about}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                    placeholder="Brief description (optional)"
                                />
                            </div>
                        </div>

                        {/* Footer: Fixed at bottom */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50/50 shrink-0">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                {editingItem ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
