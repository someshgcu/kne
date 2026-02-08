import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { toast } from 'sonner';
import {
    BookOpen, Plus, Trash2, Loader2, X, Save, ArrowLeft,
    GraduationCap, Clock, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    eligibility: string;
    image: string;
    subjects: string[];
}

export function PrincipalCourseManager() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '2 Years',
        eligibility: '',
        image: '',
        subjects: ''
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
                subjects: ''
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-primary text-primary-foreground shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/principal/dashboard"
                            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Manage Courses</h1>
                            <p className="text-sm text-primary-foreground/80">Add, edit, or remove courses offered</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions */}
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
                                    <button
                                        onClick={() => handleDeleteCourse(course.id, course.title)}
                                        disabled={deletingId === course.id}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                                    >
                                        {deletingId === course.id ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="size-4" />
                                        )}
                                        Delete Course
                                    </button>
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
        </div>
    );
}
