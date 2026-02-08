import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { courses as fallbackCourses, type Course } from '../../data/mockData';
import { BookOpen, ArrowRight, Clock, Award, Loader2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Real-time courses subscription
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'courses'),
            (snapshot) => {
                if (snapshot.empty) {
                    setCourses(fallbackCourses);
                } else {
                    const coursesData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Course));
                    setCourses(coursesData);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching courses:', error);
                setCourses(fallbackCourses);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 py-24">
                        <Loader2 className="size-8 animate-spin text-accent" />
                        <p className="text-lg text-muted">Loading courses...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
                        <BookOpen className="size-5" aria-hidden="true" />
                        <span className="text-sm font-semibold">Courses Offered</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        Choose Your Path
                    </h1>
                    <p className="text-lg text-body max-w-3xl mx-auto">
                        Explore our comprehensive PU programs designed to prepare you for success in competitive exams and build a strong foundation for your future career.
                    </p>
                </div>

                {/* Courses Grid - 4 Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <article
                            key={course.id}
                            className="group bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            {/* Course Image */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={course.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h2 className="text-xl font-bold text-white">{course.title}</h2>
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="p-5">
                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Award className="size-3" />
                                        {course.eligibility.split(' with')[0]}
                                    </span>
                                </div>

                                {/* Description - Truncated */}
                                <p className="text-sm text-body line-clamp-3 mb-4">
                                    {course.description.split('.')[0]}.
                                </p>

                                {/* Subject Pills - Show first 3 */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {course.subjects.slice(0, 3).map((subject) => (
                                        <span
                                            key={subject}
                                            className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                    {course.subjects.length > 3 && (
                                        <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs">
                                            +{course.subjects.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* View More Button */}
                                <Link
                                    to={`/courses/${course.id}`}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium text-sm"
                                >
                                    View More Details
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* CTA Section */}
                <section className="mt-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                        Take the first step towards your dream career. Apply now for admissions 2026-27.
                    </p>
                    <Link
                        to="/admissions"
                        className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-lg"
                    >
                        <GraduationCap className="size-5" />
                        Apply for Admission
                    </Link>
                </section>
            </div>
        </main>
    );
}
