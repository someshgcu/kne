import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Loader2, FileText, MapPin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { polishContent } from '../../../lib/openrouter';
import { logAction } from '../../../lib/db-helpers';
import { toast } from 'sonner';

type DisplayLocation = 'news' | 'home' | 'events' | 'notice';

interface LocationState {
    generatedContent?: string;
    topic?: string;
}

export function BlogEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [displayLocation, setDisplayLocation] = useState<DisplayLocation>('news');
    const [isPolishing, setIsPolishing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load generated content from AI generator
    useEffect(() => {
        if (state?.generatedContent) {
            setContent(state.generatedContent);
            if (state.topic) {
                setTitle(state.topic);
            }
            // Clear state to prevent reload issues
            window.history.replaceState({}, document.title);
        }
    }, [state]);

    const handlePolish = async () => {
        if (!content.trim()) {
            toast.error('Please enter some content to polish');
            return;
        }

        setIsPolishing(true);

        try {
            const result = await polishContent(content);

            if (result.success && result.content) {
                setContent(result.content);
                toast.success('Content polished successfully!');
            } else {
                toast.error(result.error || 'Failed to polish content');
            }
        } catch (error) {
            console.error('Polish error:', error);
            toast.error('An error occurred while polishing');
        } finally {
            setIsPolishing(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }
        if (!content.trim()) {
            toast.error('Please enter content');
            return;
        }

        setIsSaving(true);

        try {
            // Save to appropriate collection based on location
            const collectionName = displayLocation === 'news' ? 'news' : 'site_content';

            const docData = {
                title: title.trim(),
                content: content.trim(),
                location: displayLocation,
                category: displayLocation === 'news' ? 'General' : displayLocation,
                showOnHome: displayLocation === 'home',
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser?.uid || 'unknown',
                status: 'published'
            };

            await addDoc(collection(db, collectionName), docData);

            // Log the action
            await logAction(
                auth.currentUser,
                'content_created',
                `Created ${displayLocation} content: ${title}`
            );

            toast.success('Content published successfully!');
            navigate('/admin/dashboard');

        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save content');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/admin/dashboard"
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <ArrowLeft className="size-5 text-muted" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="size-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">Blog Editor</h1>
                                    <p className="text-sm text-muted">Create & edit content</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !title.trim() || !content.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            Publish
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a compelling title..."
                            className="w-full px-4 py-3 text-lg font-semibold border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    {/* Display Location */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            <MapPin className="inline size-4 mr-1" />
                            Display Location
                        </label>
                        <select
                            value={displayLocation}
                            onChange={(e) => setDisplayLocation(e.target.value as DisplayLocation)}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="news">News Page</option>
                            <option value="home">Home Page</option>
                            <option value="events">Events Section</option>
                            <option value="notice">Notice Board</option>
                        </select>
                    </div>

                    {/* Content Textarea */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-foreground">
                                Content
                            </label>
                            <button
                                onClick={handlePolish}
                                disabled={isPolishing || !content.trim()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                            >
                                {isPolishing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Polishing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-4" />
                                        AI Polish
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your content here... or use AI to generate it!"
                            rows={15}
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-muted mt-2">
                            {content.length} characters • ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Link
                            to="/admin/ai-generator"
                            className="text-accent hover:underline text-sm"
                        >
                            ← Generate new content with AI
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
