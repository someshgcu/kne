import { useState, ReactNode } from 'react';
import { useSiteContent } from '../../../hooks/useSiteContent';
import { toast } from 'sonner';
import { Pencil, X, Save, Loader2 } from 'lucide-react';

interface EditableWrapperProps {
    sectionId: string;
    children: ReactNode;
    label?: string;
}

export function EditableWrapper({ sectionId, children, label }: EditableWrapperProps) {
    const { content, loading, updateContent } = useSiteContent(sectionId);
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [saving, setSaving] = useState(false);

    const handleOpenModal = () => {
        setEditContent(content);
        setShowModal(true);
    };

    const handleSave = async () => {
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

    return (
        <>
            <div
                className={`relative transition-all duration-200 ${isHovered ? 'ring-4 ring-blue-500 ring-offset-2 cursor-pointer' : ''
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleOpenModal}
            >
                {/* Edit Button Overlay */}
                {isHovered && (
                    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
                        <Pencil className="size-4" />
                        <span className="text-sm font-medium">Edit {label || sectionId}</span>
                    </div>
                )}

                {/* Section Label */}
                {isHovered && (
                    <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                        {sectionId}
                    </div>
                )}

                {/* Children (the actual section) */}
                <div className="pointer-events-none">
                    {children}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
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
                                onClick={() => setShowModal(false)}
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
                                        className="w-full h-64 px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                                        placeholder="Enter content for this section..."
                                    />
                                    <p className="text-xs text-muted mt-2">
                                        {editContent.length} characters
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
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
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
