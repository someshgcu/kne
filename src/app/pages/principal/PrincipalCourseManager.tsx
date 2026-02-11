import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import {
    BookOpen, Plus, Trash2, Loader2, X, Save,
    GraduationCap, Clock, Award, Edit, Upload as UploadIcon, Link as LinkIcon
} from 'lucide-react';

interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    eligibility: string;
    image: string;
    subjects: string[];
    futureScope?: string;
}

export function PrincipalCourseManager() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Image upload state
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState('');
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    // Form state for adding
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '2 Years',
        eligibility: '',
        image: '',
        subjects: '',
        futureScope: ''
    });

    // Form state for editing
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        duration: '2 Years',
        eligibility: '',
        image: '',
        subjects: '',
        futureScope: ''
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'courses'));
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Course));
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async () => {
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        setIsSaving(true);
        try {
            const subjectsArray = formData.subjects
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            await addDoc(collection(db, 'courses'), {
                title: formData.title.trim(),
                description: formData.description.trim(),
                duration: formData.duration || '2 Years',
                eligibility: formData.eligibility.trim() || '10th Pass',
                image: formData.image.trim() || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
                subjects: subjectsArray,
                createdAt: serverTimestamp()
            });

            toast.success('Course added successfully!');
            setIsModalOpen(false);
            setFormData({
                title: '',
                description: '',
                duration: '2 Years',
                eligibility: '',
                image: '',
                subjects: '',
                futureScope: ''
            });
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Failed to add course');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${courseTitle}"?`);
        if (!confirmed) return;

        setDeletingId(courseId);
        try {
            await deleteDoc(doc(db, 'courses', courseId));
            toast.success('Course deleted');
            setCourses(prev => prev.filter(c => c.id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        } finally {
            setDeletingId(null);
        }
    };

    // Edit Modal Function
    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
        setEditFormData({
            title: course.title,
            description: course.description,
            duration: course.duration,
            eligibility: course.eligibility,
            image: course.image,
            subjects: course.subjects.join(', '),
            futureScope: course.futureScope || ''
        });
        setImagePreview(course.image);
        setImageMode('url');
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCourse(null);
        setSelectedFile(null);
        setCompressedFile(null);
        setImagePreview('');
        setOriginalSize(0);
        setCompressedSize(0);
        setImageMode('url');
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setOriginalSize(file.size);

        // Create preview of original
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        // Auto-compress immediately
        await compressImage(file);
    };

    const compressImage = async (file: File) => {
        setCompressing(true);
        try {
            const options = {
                maxSizeMB: 1,              // Max file size 1MB
                maxWidthOrHeight: 1920,    // Max dimensions 1920px
                useWebWorker: true,        // Use web worker for better performance
                fileType: 'image/webp',    // Convert to WebP
                initialQuality: 0.8        // 80% quality
            };

            const compressed = await imageCompression(file, options);
            setCompressedFile(compressed);
            setCompressedSize(compressed.size);

            // Create preview of compressed image
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(compressed);

            const reduction = ((1 - compressed.size / file.size) * 100).toFixed(0);
            toast.success(`Image compressed! ${reduction}% smaller`);
        } catch (error) {
            console.error('Compression error:', error);
            toast.error('Failed to compress image');
            setCompressedFile(file); // Fallback to original if compression fails
            setCompressedSize(file.size);
        } finally {
            setCompressing(false);
        }
    };

    const handleUploadImage = async () => {
        if (!compressedFile || !editingCourse) return;

        setUploading(true);
        const fileName = `${editingCourse.id}_${Date.now()}.webp`;
        const storageRef = ref(storage, `courses/${editingCourse.id}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
            },
            (error) => {
                toast.error('Upload failed: ' + error.message);
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setEditFormData(prev => ({ ...prev, image: downloadURL }));
                setImagePreview(downloadURL);
                setUploading(false);
                const sizeKB = (compressedSize / 1024).toFixed(0);
                toast.success(`Image uploaded! (${sizeKB} KB)`);
                setSelectedFile(null);
                setCompressedFile(null);
            }
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleSaveEdit = async () => {
        if (!editingCourse || !editFormData.title.trim() || !editFormData.description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        if (uploading) {
            toast.error('Please wait for image upload to complete');
            return;
        }

        setIsSaving(true);
        try {
            const subjectsArray = editFormData.subjects
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            await updateDoc(doc(db, 'courses', editingCourse.id), {
                title: editFormData.title.trim(),
                description: editFormData.description.trim(),
                duration: editFormData.duration,
                eligibility: editFormData.eligibility.trim(),
                image: editFormData.image.trim(),
                subjects: subjectsArray,
                futureScope: editFormData.futureScope.trim(),
                updatedAt: serverTimestamp()
            });

            toast.success('Course updated successfully!');
            handleCloseEditModal();
            fetchCourses();
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title + Actions */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Manage Courses</h1>
                    <p className="text-sm text-muted mt-1">Add, edit, or remove courses offered</p>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <p className="text-body">
                        {courses.length} course{courses.length !== 1 ? 's' : ''} configured
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        <Plus className="size-5" />
                        Add Course
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="size-8 animate-spin text-accent" />
                        <span className="ml-3 text-muted">Loading courses...</span>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-xl border border-border">
                        <BookOpen className="size-16 text-muted mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-primary mb-2">No Courses Yet</h2>
                        <p className="text-muted mb-6">Add your first course to get started.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            <Plus className="size-5" />
                            Add First Course
                        </button>
                    </div>
                ) : (
                    /* Course Cards */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <article
                                key={course.id}
                                className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Course Image */}
                                <div className="aspect-video bg-secondary">
                                    <img
                                        src={course.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80';
                                        }}
                                    />
                                </div>

                                {/* Course Info */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-primary mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-body line-clamp-2 mb-4">
                                        {course.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex flex-wrap gap-3 text-xs text-muted mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {course.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="size-3" />
                                            {course.eligibility}
                                        </span>
                                    </div>

                                    {/* Subjects */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {course.subjects?.slice(0, 4).map((subject) => (
                                            <span
                                                key={subject}
                                                className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(course)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            <Edit className="size-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id, course.title)}
                                            disabled={deletingId === course.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                                        >
                                            {deletingId === course.id ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="size-4" />
                                                    Delete
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <GraduationCap className="size-6" />
                                Add New Course
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">
                                    Course Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Science (PCMB)"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the course..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground resize-none"
                                />
                            </div>

                            {/* Duration & Eligibility */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-body mb-1">
                                        Duration
                                    </label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                                    >
                                        <option value="1 Year">1 Year</option>
                                        <option value="2 Years">2 Years</option>
                                        <option value="3 Years">3 Years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-body mb-1">
                                        Eligibility
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.eligibility}
                                        onChange={(e) => setFormData(prev => ({ ...prev, eligibility: e.target.value }))}
                                        placeholder="e.g., 10th Pass with 75%"
                                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Subjects */}
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">
                                    Subjects (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.subjects}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subjects: e.target.value }))}
                                    placeholder="Physics, Chemistry, Mathematics, Biology"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-body mb-1">
                                    Image URL (optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-border">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCourse}
                                disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
                                className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Add Course
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT COURSE MODAL */}
            {isEditModalOpen && editingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-xl max-h-[85vh] w-[90vw] max-w-2xl flex flex-col p-0 gap-0">
                        {/* Header: Fixed at top */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Edit className="size-6" />
                                Edit Course: {editingCourse.title}
                            </h2>
                            <button
                                onClick={handleCloseEditModal}
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
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    placeholder="e.g., Bachelor of Commerce"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    placeholder="Course description"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                />
                            </div>

                            {/* Duration & Eligibility Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={editFormData.duration}
                                        onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                                        placeholder="e.g., 3 Years"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Eligibility</label>
                                    <input
                                        type="text"
                                        value={editFormData.eligibility}
                                        onChange={(e) => setEditFormData({ ...editFormData, eligibility: e.target.value })}
                                        placeholder="e.g., 10+2 Pass"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Image Input Mode Toggle */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Course Image</label>
                                <div className="flex gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('url')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${imageMode === 'url'
                                            ? 'bg-accent text-accent-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                            }`}
                                    >
                                        <LinkIcon className="size-4" />
                                        Enter URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('upload')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${imageMode === 'upload'
                                            ? 'bg-accent text-accent-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                            }`}
                                    >
                                        <UploadIcon className="size-4" />
                                        Upload File
                                    </button>
                                </div>

                                {/* URL Mode */}
                                {imageMode === 'url' && (
                                    <input
                                        type="text"
                                        value={editFormData.image}
                                        onChange={(e) => {
                                            setEditFormData({ ...editFormData, image: e.target.value });
                                            setImagePreview(e.target.value);
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                    />
                                )}

                                {/* Upload Mode */}
                                {imageMode === 'upload' && (
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                        />

                                        {/* File Size Info */}
                                        {selectedFile && (
                                            <div className="text-sm space-y-1 p-3 bg-secondary/30 rounded-lg">
                                                <div className="flex justify-between">
                                                    <span className="text-muted">Original:</span>
                                                    <span>{formatFileSize(originalSize)}</span>
                                                </div>
                                                {compressedFile && (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted">Compressed:</span>
                                                            <span className="text-green-600 font-medium">
                                                                {formatFileSize(compressedSize)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted">Reduction:</span>
                                                            <span className="text-green-600 font-semibold">
                                                                {((1 - compressedSize / originalSize) * 100).toFixed(0)}% smaller
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Compression Status */}
                                        {compressing && (
                                            <div className="flex items-center gap-2 text-sm text-blue-500">
                                                <Loader2 className="size-4 animate-spin" />
                                                Compressing to WebP...
                                            </div>
                                        )}

                                        {/* Upload Button */}
                                        {compressedFile && !uploading && (
                                            <button
                                                type="button"
                                                onClick={handleUploadImage}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                            >
                                                <UploadIcon className="size-4" />
                                                Upload to Firebase Storage
                                            </button>
                                        )}

                                        {/* Upload Progress */}
                                        {uploading && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Uploading...</span>
                                                    <span className="font-medium">{uploadProgress}%</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-border"
                                            onError={() => setImagePreview('')}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Subjects */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subjects (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={editFormData.subjects}
                                    onChange={(e) => setEditFormData({ ...editFormData, subjects: e.target.value })}
                                    placeholder="e.g., Mathematics, Physics, Chemistry"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                />
                            </div>

                            {/* Future Scope */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Future Scope / Career Pathways
                                </label>
                                <textarea
                                    value={editFormData.futureScope}
                                    onChange={(e) => setEditFormData({ ...editFormData, futureScope: e.target.value })}
                                    placeholder="Describe career opportunities and pathways..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Footer: Fixed at bottom */}
                        <div className="flex gap-3 px-6 py-4 border-t border-border bg-gray-50/50 shrink-0">
                            <button
                                onClick={handleCloseEditModal}
                                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                            >
                                <X className="size-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving || uploading || !editFormData.title.trim() || !editFormData.description.trim()}
                                className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
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
        </div>
    );
}
