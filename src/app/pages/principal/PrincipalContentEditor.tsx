import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../../hooks/useSiteContent';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Save,
    Loader2,
    Eye,
    EyeOff,
    FileText,
    Home,
    Info,
    DollarSign,
    Phone
} from 'lucide-react';

// Hardcoded section keys for content management
const SECTION_KEYS = [
    { id: 'home_hero_text', label: 'Home Hero Text', icon: Home },
    { id: 'about_us_text', label: 'About Us', icon: Info },
    { id: 'fees_structure', label: 'Fees Structure', icon: DollarSign },
    { id: 'contact_info', label: 'Contact Information', icon: Phone },
];

export function PrincipalContentEditor() {
    const [selectedSection, setSelectedSection] = useState(SECTION_KEYS[0].id);
    const { content, title, isVisible, loading, error, updateContent } = useSiteContent(selectedSection);

    const [editContent, setEditContent] = useState('');
    const [editVisible, setEditVisible] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Sync local state when section data loads
    const handleSectionChange = (sectionId: string) => {
        if (hasChanges) {
            const confirm = window.confirm('You have unsaved changes. Discard them?');
            if (!confirm) return;
        }
        setSelectedSection(sectionId);
        setHasChanges(false);
    };

    // Update local state when content loads
    useState(() => {
        setEditContent(content);
        setEditVisible(isVisible);
    });

    // Track content changes
    const handleContentChange = (value: string) => {
        setEditContent(value);
        setHasChanges(true);
    };

    const handleVisibilityChange = (value: boolean) => {
        setEditVisible(value);
        setHasChanges(true);
    };

    // Save changes
    const handleSave = async () => {
        setSaving(true);
        const success = await updateContent(editContent, editVisible);
        if (success) {
            toast.success('Content saved successfully');
            setHasChanges(false);
        } else {
            toast.error('Failed to save content');
        }
        setSaving(false);
    };

    // Initialize content when loaded
    if (!loading && editContent === '' && content) {
        setEditContent(content);
        setEditVisible(isVisible);
    }

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
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Content Editor</h1>
                                <p className="text-sm text-muted">Manage website sections</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 font-medium transition-colors"
                        >
                            {saving ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Sidebar - Section List */}
                    <aside className="bg-card rounded-xl border border-border p-4">
                        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
                            Sections
                        </h2>
                        <nav className="space-y-1">
                            {SECTION_KEYS.map((section) => {
                                const Icon = section.icon;
                                const isActive = selectedSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => handleSectionChange(section.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isActive
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-foreground hover:bg-secondary'
                                            }`}
                                    >
                                        <Icon className="size-4" />
                                        <span className="text-sm font-medium">{section.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Editor */}
                    <main className="bg-card rounded-xl border border-border overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="size-8 animate-spin text-accent" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500">
                                <p>Error loading content. Please try again.</p>
                            </div>
                        ) : (
                            <>
                                {/* Editor Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <FileText className="size-5 text-accent" />
                                        <h3 className="font-semibold text-foreground">
                                            {SECTION_KEYS.find(s => s.id === selectedSection)?.label || selectedSection}
                                        </h3>
                                    </div>

                                    {/* Visibility Toggle */}
                                    <button
                                        onClick={() => handleVisibilityChange(!editVisible)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${editVisible
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                    >
                                        {editVisible ? (
                                            <>
                                                <Eye className="size-4" />
                                                Visible
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="size-4" />
                                                Hidden
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Textarea Editor */}
                                <div className="p-4">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => handleContentChange(e.target.value)}
                                        placeholder="Enter content for this section..."
                                        className="w-full h-[400px] p-4 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
                                    />
                                    <p className="mt-2 text-xs text-muted">
                                        {editContent.length} characters • Last saved: {title || 'Never'}
                                    </p>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
