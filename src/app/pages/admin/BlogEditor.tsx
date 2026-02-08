import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Loader2, FileText, MapPin, ImagePlus, X } from 'lucide-react';
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

// Compress image to WebP format with max width
async function compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP
                const webpData = canvas.toDataURL('image/webp', quality);

                // Check size (Firestore limit is ~1MB for document)
                const sizeKB = Math.round((webpData.length * 3) / 4 / 1024);
                console.log(`[ImageCompress] Compressed to ${width}x${height}, ${sizeKB}KB`);

                if (sizeKB > 900) {
                    // If still too large, reduce quality further
                    const reducedData = canvas.toDataURL('image/webp', 0.5);
                    resolve(reducedData);
                } else {
                    resolve(webpData);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

export function BlogEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [displayLocation, setDisplayLocation] = useState<DisplayLocation>('news');
    const [isPolishing, setIsPolishing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

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

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Check original size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > 10) {
            toast.error('Image too large. Maximum 10MB allowed.');
            return;
        }

        setIsCompressing(true);

        try {
            const compressed = await compressImage(file, 800, 0.7);
            setImagePreview(compressed);
            setImageData(compressed);
            toast.success('Image compressed and ready');
        } catch (error) {
            console.error('Compression error:', error);
            toast.error('Failed to process image');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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

            const docData: Record<string, unknown> = {
                title: title.trim(),
                content: content.trim(),
                // CRITICAL: date field is required for sorting in useNews
                date: new Date().toISOString(),
                // CRITICAL: excerpt field for preview cards
                excerpt: content.trim().substring(0, 150) + (content.length > 150 ? '...' : ''),
                location: displayLocation,
                category: displayLocation === 'news' ? 'General' : displayLocation,
                showOnHome: displayLocation === 'home',
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser?.uid || 'unknown',
                status: 'published',
                // Add image if present
                ...(imageData && { image: imageData })
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

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            <ImagePlus className="inline size-4 mr-1" />
                            Featured Image
                        </label>

                        {imagePreview ? (
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-48 rounded-lg border border-border"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                            >
                                {isCompressing ? (
                                    <div className="flex items-center justify-center gap-2 text-muted">
                                        <Loader2 className="size-5 animate-spin" />
                                        Compressing image...
                                    </div>
                                ) : (
                                    <>
                                        <ImagePlus className="size-8 text-muted mx-auto mb-2" />
                                        <p className="text-sm text-muted">Click to upload image</p>
                                        <p className="text-xs text-muted/70 mt-1">Auto-compressed to WebP (max 800px)</p>
                                    </>
                                )}
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
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
