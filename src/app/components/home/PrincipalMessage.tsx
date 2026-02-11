import { useState, useEffect, useRef, useCallback } from 'react';
import { Quote, Loader2, Edit2, Camera, Upload, X } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { usePrincipalMessage } from '../../../hooks/useContent';
import { principalMessage as fallbackMessage } from '../../../data/mockData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface PrincipalMessageProps {
  editorMode?: boolean;
}

// ---------------------------------------------------------------------------
// Image compression helper – resizes to max 800px width & converts to WebP
// ---------------------------------------------------------------------------
function compressImageToWebP(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

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

        const webpBase64 = canvas.toDataURL('image/webp', quality);
        resolve(webpBase64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function PrincipalMessage({ editorMode = false }: PrincipalMessageProps) {
  const { data: principalMessage, loading } = usePrincipalMessage();

  // State for Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with safe defaults
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    message: '',
    image: '',
  });

  // Use Firestore data, or fallback to static data
  const displayMessage = principalMessage || fallbackMessage;

  // Sync form data with loaded message whenever it changes
  useEffect(() => {
    if (displayMessage) {
      setFormData({
        name: displayMessage.name || '',
        designation: displayMessage.designation || '',
        message: displayMessage.message || '',
        image: displayMessage.image || '',
      });
    }
  }, [displayMessage]);

  // ---------- Image upload handler ----------
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB');
      return;
    }

    setIsCompressing(true);
    try {
      const webpBase64 = await compressImageToWebP(file);
      setFormData((prev) => ({ ...prev, image: webpBase64 }));
      toast.success('Image compressed & converted to WebP');
    } catch (err) {
      console.error('Compression error:', err);
      toast.error('Failed to process image');
    } finally {
      setIsCompressing(false);
      // Reset input so re-selecting the same file still triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  // ---------- Save handler ----------
  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.message?.trim()) {
      toast.error('Name and Message are required');
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'site_sections', 'principal_message'), {
        name: formData.name,
        designation: formData.designation,
        message: formData.message,
        image: formData.image,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Principal's Message Updated!");
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error saving message:', err);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Loading skeleton ----------
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-center">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full bg-secondary animate-pulse" />
                <div className="mt-6 space-y-2 text-center w-full">
                  <div className="h-6 w-32 bg-secondary animate-pulse mx-auto rounded" />
                  <div className="h-4 w-24 bg-secondary animate-pulse mx-auto rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 w-64 bg-secondary animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-secondary animate-pulse rounded" />
                  <div className="h-4 w-full bg-secondary animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-secondary animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!displayMessage) return null;

  // Is the current image a base64 data-url?
  const isBase64Image = formData.image.startsWith('data:');

  return (
    <>
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative group">
        {/* EDIT BUTTON OVERLAY (Only in Editor Mode) */}
        {editorMode && (
          <div className="absolute top-4 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => setIsEditOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg gap-2"
            >
              <Edit2 className="size-4" />
              Edit Message
            </Button>
          </div>
        )}

        <div
          className={`max-w-7xl mx-auto transition-all ${
            editorMode ? 'group-hover:ring-2 ring-blue-500/50 rounded-2xl' : ''
          }`}
        >
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-center">
              {/* Principal Photo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <ImageWithFallback
                    src={displayMessage.image}
                    fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                    alt={displayMessage.name}
                    className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-accent shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-3 rounded-full shadow-lg">
                    <Quote className="size-6" />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-primary">{displayMessage.name}</h3>
                  <p className="text-sm text-muted">{displayMessage.designation}</p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Principal's Message</h2>
                <blockquote className="space-y-4">
                  <p className="text-lg text-body leading-relaxed whitespace-pre-wrap">
                    {displayMessage.message}
                  </p>
                  <footer className="mt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-0.5 w-12 bg-accent" />
                      <cite className="not-italic text-primary font-semibold">
                        {displayMessage.name}
                      </cite>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EDIT MODAL ─── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[85vh] w-[90vw] max-w-2xl flex flex-col p-0 gap-0">
          {/* Header: Fixed at top */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle>Edit Principal's Message</DialogTitle>
            <DialogDescription>
              Update the principal's photo, name, designation, and message content below.
            </DialogDescription>
          </DialogHeader>

          {/* Body: Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid gap-6">
              {/* Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Somesh P"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Principal"
                  />
                </div>
              </div>

              {/* Profile Photo — URL or Upload */}
              <div className="space-y-2">
                <Label>Profile Photo</Label>

                {/* Preview */}
                {formData.image && (
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5"
                      aria-label="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                )}

                {/* URL input + upload button */}
                <div className="flex gap-2">
                  <Input
                    value={isBase64Image ? '(uploaded image)' : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or upload below"
                    disabled={isBase64Image}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isCompressing}
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload from device"
                  >
                    {isCompressing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                  </Button>
                </div>

                {isBase64Image && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground"
                    onClick={() => setFormData({ ...formData, image: '' })}
                  >
                    Clear & enter a URL instead
                  </Button>
                )}

                <p className="text-xs text-gray-500">
                  Upload an image (auto-compressed to WebP) or paste a URL.
                </p>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  placeholder="Write the welcome message here..."
                  className="font-serif text-lg leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Footer: Fixed at bottom */}
          <DialogFooter className="px-6 py-4 border-t bg-gray-50/50 shrink-0">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isCompressing}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}