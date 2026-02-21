import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper, Loader2, Edit, X, Save, Trash2, Eye, EyeOff, Settings } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { toast } from 'sonner';
import { useNews } from '../../../hooks/useContent';

interface NewsTickerProps {
  editorMode?: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  isVisible?: boolean;
}

export function NewsTicker({ editorMode = false }: NewsTickerProps) {
  const { data: newsItems, loading, error } = useNews();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    date: '',
    excerpt: '',
    isVisible: true
  });

  // Always show only the 3 most recent news items, even in editor mode, 
  // to maintain visual fidelity to the homepage.
  // The 'Manage All News' button allows access to the full list.
  const recentNews = newsItems.slice(0, 3);

  const handleEditClick = (news: NewsItem) => {
    setEditingNews(news);
    setEditData({
      title: news.title,
      date: news.date,
      excerpt: news.excerpt,
      isVisible: news.isVisible !== false
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingNews || !editData.title.trim() || !editData.excerpt.trim()) {
      toast.error('Title and excerpt are required');
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'news', editingNews.id), {
        title: editData.title.trim(),
        date: editData.date.trim(),
        excerpt: editData.excerpt.trim(),
        isVisible: editData.isVisible
      });

      toast.success('News updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Failed to update news');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingNews) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${editingNews.title}"?`);
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'news', editingNews.id));
      toast.success('News deleted successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/10"
        aria-labelledby="news-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="size-6 animate-spin text-accent" />
            <p className="text-muted">Loading latest news...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state - show nothing gracefully
  if (error) {
    console.error('[NewsTicker] Error:', error);
    return null;
  }

  if (recentNews.length === 0) {
    return null;
  }

  return (
    <>
      <section
        className={`py-16 px-4 sm:px-6 lg:px-8 bg-secondary/10 relative ${editorMode ? 'group' : ''}`}
        aria-labelledby="news-heading"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                <Newspaper className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="news-heading" className="text-3xl font-bold text-primary">
                  Latest Updates
                </h2>
                <p className="text-sm text-body mt-1">Stay informed about campus happenings</p>
              </div>
            </div>

            {/* Editor Mode: Manage All News Button */}
            {editorMode ? (
              <Link
                to="/principal/news"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
              >
                <Settings className="size-4" />
                Manage All News
              </Link>
            ) : (
              <Link
                to="/news"
                className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                View All
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* News Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((news) => (
              <article
                key={news.id}
                className={`bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-lg transition-all relative ${editorMode ? 'cursor-pointer group/card hover:border-accent' : ''
                  } ${news.isVisible === false ? 'opacity-60 grayscale' : ''}`}
                onClick={editorMode ? () => handleEditClick(news) : undefined}
                title={editorMode ? "Click to edit this news item" : undefined}
              >
                {/* Editor Mode Overlay */}
                {editorMode && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
                    <div className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded shadow-sm flex items-center gap-1">
                      <Edit className="size-3" />
                      Edit
                    </div>
                    {news.isVisible === false && (
                      <div className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded shadow-sm flex items-center gap-1">
                        <EyeOff className="size-3" />
                        Hidden
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted mb-3">
                    <Calendar className="size-4" aria-hidden="true" />
                    <time dateTime={news.date}>{news.date}</time>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-body line-clamp-3 mb-4">
                    {news.excerpt}
                  </p>
                  {!editorMode && (
                    <Link
                      to={`/news/${news.id}`}
                      className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read More
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Mobile View All Link (Only in public mode) */}
          {!editorMode && (
            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
              >
                View All News
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Edit Modal */}
      {isEditModalOpen && editingNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-card border border-border rounded-xl max-h-[85vh] w-[90vw] max-w-2xl flex flex-col p-0 gap-0 animate-in fade-in zoom-in-95 duration-200">
            {/* Header: Fixed at top */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Edit className="size-6" />
                Quick Edit: News
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body: Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="News title"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoFocus
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  placeholder="e.g., Jan 15, 2024"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editData.excerpt}
                  onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
                  placeholder="Brief summary of the news"
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${editData.isVisible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {editData.isVisible ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Visiblity Status</p>
                    <p className="text-xs text-muted">
                      {editData.isVisible ? 'Visible to public' : 'Hidden from public'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditData({ ...editData, isVisible: !editData.isVisible })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${editData.isVisible
                      ? 'bg-secondary hover:bg-secondary/80 text-foreground'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                  {editData.isVisible ? 'Hide' : 'Make Visible'}
                </button>
              </div>
            </div>

            {/* Footer: Fixed at bottom */}
            <div className="flex gap-3 px-6 py-4 border-t border-border bg-gray-50/50 shrink-0">
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-red-50 hover:bg-red-50 text-red-600 border border-red-200 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                disabled={isSaving}
              >
                <X className="size-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editData.title.trim() || !editData.excerpt.trim()}
                className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
