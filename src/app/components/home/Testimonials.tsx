import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Quote, Star, Loader2, Edit, X, Save, Trash2, User, Briefcase, GraduationCap } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { toast } from 'sonner';
import { useTestimonials } from '../../../hooks/useContent';
import { testimonials as fallbackTestimonials, Testimonial } from '../../../data/mockData';

interface TestimonialsProps {
  editorMode?: boolean;
}



export function Testimonials({ editorMode = false }: TestimonialsProps) {
  const { data: testimonials, loading, error } = useTestimonials();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    batch: '',
    quote: '',
    currentPosition: ''
  });

  // Use Firestore data or fallback to static data
  const testimonialData = testimonials.length > 0 ? testimonials : (error ? fallbackTestimonials : []);

  const handleEditClick = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setEditData({
      name: testimonial.name,
      batch: testimonial.batch,
      quote: testimonial.quote,
      currentPosition: testimonial.currentPosition || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingTestimonial || !editData.name.trim() || !editData.quote.trim()) {
      toast.error('Name and quote are required');
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'testimonials', editingTestimonial.id), {
        name: editData.name.trim(),
        batch: editData.batch.trim(),
        quote: editData.quote.trim(),
        currentPosition: editData.currentPosition.trim()
      });

      toast.success('Testimonial updated');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingTestimonial) return;

    const confirmed = window.confirm(`Delete testimonial from "${editingTestimonial.name}"?`);
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'testimonials', editingTestimonial.id));
      toast.success('Testimonial deleted');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Star className="size-5" aria-hidden="true" />
              <span className="text-sm font-semibold">Success Stories</span>
            </div>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Hear from our successful alumni about their journey at INCPUC
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl shadow-md border border-border p-6 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-secondary rounded" />
                    <div className="h-3 w-16 bg-secondary rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-secondary rounded" />
                  <div className="h-3 w-full bg-secondary rounded" />
                  <div className="h-3 w-3/4 bg-secondary rounded" />
                </div>
                <div className="h-3 w-1/2 bg-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no data and not loading, return null gracefully (or edit placeholder if needed?)
  // For now, if empty, we return null, mimicking public behavior. Editor can't add to empty list here easily 
  // without an "Add" button, but that's not in spec "Upgrade Testimonials.tsx (Modal Editing)".
  if (testimonialData.length === 0) {
    return null;
  }

  return (
    <>
      <section
        className={`py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20 relative ${editorMode ? 'group' : ''}`}
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Star className="size-5" aria-hidden="true" />
              <span className="text-sm font-semibold">Success Stories</span>
            </div>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Hear from our successful alumni about their journey at INCPUC
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonialData.map((testimonial) => (
              <article
                key={testimonial.id}
                className={`bg-card rounded-xl shadow-md border border-border p-6 hover:shadow-lg transition-all flex flex-col relative ${editorMode ? 'cursor-pointer group/card hover:border-accent hover:ring-2 hover:ring-accent/20' : ''
                  }`}
                onClick={editorMode ? () => handleEditClick(testimonial) : undefined}
                title={editorMode ? "Click to edit testimonial" : undefined}
              >
                {/* Editor Mode Overlay */}
                {editorMode && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
                    <div className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded shadow-sm flex items-center gap-1">
                      <Edit className="size-3" />
                      Edit
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-${testimonial.id === 'test1' ? '1500648767791' :
                      testimonial.id === 'test2' ? '1494790108377' :
                        testimonial.id === 'test3' ? '1507003211169' : '1573497019940'
                      }-c0f0cddb62d8?w=200&q=80`}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-primary truncate">{testimonial.name}</h3>
                    <p className="text-sm text-muted truncate">Batch of {testimonial.batch}</p>
                  </div>
                </div>

                <div className="mb-4 flex-grow">
                  <Quote className="size-8 text-accent mb-2" aria-hidden="true" />
                  <blockquote className="text-body leading-relaxed line-clamp-4">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <p className="text-sm text-muted italic truncate">
                    {testimonial.currentPosition}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Edit Modal */}
      {isEditModalOpen && editingTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-card border border-border rounded-xl max-h-[85vh] w-[90vw] max-w-2xl flex flex-col p-0 gap-0 animate-in fade-in zoom-in-95 duration-200">
            {/* Header: Fixed at top */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Edit className="size-6" />
                Edit Testimonial
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body: Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="size-4 text-muted" />
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Student name"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoFocus
                />
              </div>

              {/* Batch */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <GraduationCap className="size-4 text-muted" />
                  Batch
                </label>
                <input
                  type="text"
                  value={editData.batch}
                  onChange={(e) => setEditData({ ...editData, batch: e.target.value })}
                  placeholder="e.g., 2020"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {/* Quote/Message */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Quote className="size-4 text-muted" />
                  Testimonial Quote <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editData.quote}
                  onChange={(e) => setEditData({ ...editData, quote: e.target.value })}
                  placeholder="Student's testimonial message"
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
                />
              </div>

              {/* Current Position */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="size-4 text-muted" />
                  Current Position (Role)
                </label>
                <input
                  type="text"
                  value={editData.currentPosition}
                  onChange={(e) => setEditData({ ...editData, currentPosition: e.target.value })}
                  placeholder="e.g., Software Engineer at Google"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            {/* Footer: Fixed at bottom */}
            <div className="flex gap-3 px-6 py-4 border-t border-border bg-gray-50/50 shrink-0">
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-red-50 hover:bg-red-50 text-red-600 border border-red-200 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                title="Delete this testimonial"
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
                disabled={isSaving || !editData.name.trim() || !editData.quote.trim()}
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
