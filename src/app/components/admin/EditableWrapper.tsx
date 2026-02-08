import { useState, useEffect, ReactNode } from 'react';
import { useSiteContent } from '../../../hooks/useSiteContent';
import { toast } from 'sonner';
import { Pencil, X, Save, Loader2 } from 'lucide-react';

interface EditableWrapperProps {
    sectionId: string;
    children: ReactNode;
    label?: string;
    defaultContent?: string;
    inline?: boolean; // For inline text elements like h1, p, span
}

export function EditableWrapper({
    sectionId,
    children,
    label,
    defaultContent = '',
    inline = false
}: EditableWrapperProps) {
    const { content, loading, updateContent } = useSiteContent(sectionId);
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [saving, setSaving] = useState(false);

    // Initialize edit content from Firestore content or defaultContent
    const currentContent = content || defaultContent;

    const handleOpenModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Pre-fill with current content or default
        setEditContent(currentContent);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!editContent.trim()) {
            toast.error('Content cannot be empty');
            return;
        }

        setSaving(true);
        const success = await updateContent(editContent);
        if (success) {
            toast.success(`"${label || sectionId}" updated successfully!`);
            setShowModal(false);
        } else {
            toast.error('Failed to save changes');
        }
        setSaving(false);
    };

    const handleCancel = () => {
        setEditContent(currentContent); // Reset to original
        setShowModal(false);
    };

    // Wrapper styles based on inline mode
    const wrapperClasses = inline
        ? `relative inline ${isHovered ? 'ring-2 ring-blue-500 ring-dashed cursor-pointer bg-blue-50/50' : ''}`
        : `relative transition-all duration-200 ${isHovered ? 'ring-4 ring-blue-500 ring-offset-2 cursor-pointer' : ''}`;

    return (
        <>
            <div
                className={wrapperClasses}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleOpenModal}
                style={inline ? { display: 'inline' } : undefined}
            >
                {/* Edit Button Overlay */}
                {isHovered && (
                    <div className={`absolute ${inline ? '-top-8 left-0' : 'top-4 right-4'} z-50 flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200`}>
                        <Pencil className="size-3" />
                        <span className="text-xs font-medium">Edit</span>
                    </div>
                )}

                {/* Section Label (only for block mode) */}
                {isHovered && !inline && (
                    <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                        {label || sectionId}
                    </div>
                )}

                {/* Children (the actual section) */}
                <div className={inline ? 'inline' : 'pointer-events-none'} style={inline ? { display: 'inline' } : undefined}>
                    {children}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
                    onClick={(e) => e.target === e.currentTarget && handleCancel()}
                >
                    <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl border border-border max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Edit: {label || sectionId}
                                </h3>
                                <p className="text-sm text-muted">
                                    ID: <code className="bg-secondary px-1 rounded">{sectionId}</code>
                                </p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="size-5 text-muted" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 flex-1 overflow-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="size-8 animate-spin text-accent" />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full h-48 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                                        placeholder="Enter content for this section..."
                                        autoFocus
                                    />
                                    <div className="flex justify-between text-xs text-muted mt-2">
                                        <span>{editContent.length} characters</span>
                                        {defaultContent && (
                                            <button
                                                onClick={() => setEditContent(defaultContent)}
                                                className="text-accent hover:underline"
                                            >
                                                Reset to default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t border-border">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !editContent.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
