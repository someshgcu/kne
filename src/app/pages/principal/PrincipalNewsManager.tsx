import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { logAction } from '../../../lib/db-helpers';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Loader2,
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Newspaper,
    Eye,
    EyeOff
} from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    isVisible?: boolean;
}

export function PrincipalNewsManager() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
        isVisible: true
    });

    // Fetch news in real-time
    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsItem[];
            setNews(data);
            setLoading(false);
        }, (error) => {
            console.error('[PrincipalNewsManager] Error fetching news:', error);
            toast.error('Failed to load news');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Open modal for adding new item
    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            content: '',
            date: new Date().toISOString().split('T')[0],
            category: 'General',
            isVisible: true
        });
        setShowModal(true);
    };

    // Open modal for editing existing item
    const handleEdit = (item: NewsItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            content: item.content,
            date: item.date,
            category: item.category,
            isVisible: item.isVisible ?? true
        });
        setShowModal(true);
    };

    // Save (add or update)
    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        setSaving(true);
        try {
            if (editingItem) {
                // Update existing
                await updateDoc(doc(db, 'news', editingItem.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                await logAction(auth.currentUser, 'Updated News', `Updated news: "${formData.title}"`);
                toast.success('News updated successfully');
            } else {
                // Add new
                await addDoc(collection(db, 'news'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
                await logAction(auth.currentUser, 'Created News', `Created news: "${formData.title}"`);
                toast.success('News added successfully');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving news:', error);
            toast.error('Failed to save news');
        }
        setSaving(false);
    };

    // Delete item
    const handleDelete = async (item: NewsItem) => {
        if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

        setDeleting(item.id);
        try {
            await deleteDoc(doc(db, 'news', item.id));
            await logAction(auth.currentUser, 'Deleted News', `Deleted news: "${item.title}"`);
            toast.success('News deleted');
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error('Failed to delete news');
        }
        setDeleting(null);
    };

    // Toggle visibility
    const handleToggleVisibility = async (item: NewsItem) => {
        try {
            await updateDoc(doc(db, 'news', item.id), {
                isVisible: !item.isVisible
            });
            toast.success(item.isVisible ? 'Hidden from home page' : 'Visible on home page');
        } catch (error) {
            console.error('Error toggling visibility:', error);
            toast.error('Failed to update visibility');
        }
    };

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
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
                                <Newspaper className="size-6 text-accent" />
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">News Manager</h1>
                                    <p className="text-sm text-muted">Add, edit, and manage news articles</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors"
                        >
                            <Plus className="size-4" />
                            Add News
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-accent" />
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center py-20 text-muted">
                            <Newspaper className="size-12 mx-auto mb-3 opacity-50" />
                            <p>No news articles yet. Click "Add News" to create one.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/30">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Show on Home</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Title</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Category</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {news.map((item) => (
                                        <tr key={item.id} className="border-t border-border/50 hover:bg-secondary/20">
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleToggleVisibility(item)}
                                                    className={`p-2 rounded-lg transition-colors ${item.isVisible !== false
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                    title={item.isVisible !== false ? 'Visible on home' : 'Hidden from home'}
                                                >
                                                    {item.isVisible !== false ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-foreground max-w-xs truncate">
                                                {item.title}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-muted">
                                                {formatDate(item.date)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        disabled={deleting === item.id}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        {deleting === item.id ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-lg border border-border">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">
                                {editingItem ? 'Edit News' : 'Add News'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="size-5 text-muted" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Enter news title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                    placeholder="Enter news content"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="General">General</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Events">Events</option>
                                        <option value="Results">Results</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isVisible"
                                    checked={formData.isVisible}
                                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                                />
                                <label htmlFor="isVisible" className="text-sm text-foreground">
                                    Show on Home Page
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-4 border-t border-border">
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
