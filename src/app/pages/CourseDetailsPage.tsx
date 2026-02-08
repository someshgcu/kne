import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { courses as fallbackCourses, teachers as fallbackTeachers, type Course, type Teacher } from '../../data/mockData';
import {
    ArrowLeft, Clock, Award, BookOpen, Users, Briefcase,
    GraduationCap, Loader2, Star, Trophy, CheckCircle
} from 'lucide-react';

export function CourseDetailsPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;

            try {
                // Try to fetch course from Firestore
                const courseDoc = await getDoc(doc(db, 'courses', courseId));

                let courseData: Course | null = null;
                if (courseDoc.exists()) {
                    courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
                } else {
                    // Fallback to mock data
                    courseData = fallbackCourses.find(c => c.id === courseId) || null;
                }
                setCourse(courseData);

                // Fetch teachers
                const teachersSnap = await getDocs(collection(db, 'teachers'));
                let teachersList: Teacher[] = [];

                if (!teachersSnap.empty) {
                    teachersList = teachersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Teacher));
                } else {
                    teachersList = fallbackTeachers;
                }

                // Filter teachers by course subjects
                if (courseData) {
                    const courseSubjects = courseData.subjects.map(s => s.toLowerCase());
                    const filteredTeachers = teachersList.filter(teacher =>
                        teacher.subjects.some(ts =>
                            courseSubjects.some(cs =>
                                cs.includes(ts.toLowerCase()) || ts.toLowerCase().includes(cs)
                            )
                        )
                    );
                    setTeachers(filteredTeachers);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
                // Use fallback data
                const courseData = fallbackCourses.find(c => c.id === courseId) || null;
                setCourse(courseData);

                if (courseData) {
                    const courseSubjects = courseData.subjects.map(s => s.toLowerCase());
                    const filteredTeachers = fallbackTeachers.filter(teacher =>
                        teacher.subjects.some(ts =>
                            courseSubjects.some(cs =>
                                cs.includes(ts.toLowerCase()) || ts.toLowerCase().includes(cs)
                            )
                        )
                    );
                    setTeachers(filteredTeachers);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    if (loading) {
        return (
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 py-24">
                        <Loader2 className="size-8 animate-spin text-accent" />
                        <p className="text-lg text-muted">Loading course details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center py-24">
                    <h1 className="text-3xl font-bold text-primary mb-4">Course Not Found</h1>
                    <p className="text-muted mb-6">The course you're looking for doesn't exist.</p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative h-[400px] overflow-hidden">
                <img
                    src={course.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-7xl mx-auto">
                    <Link
                        to="/courses"
                        className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="size-5" />
                        Back to Courses
                    </Link>
                    <div className="inline-flex items-center gap-2 bg-accent/90 text-accent-foreground px-4 py-2 rounded-full mb-4 w-fit">
                        <BookOpen className="size-4" aria-hidden="true" />
                        <span className="text-sm font-semibold">{course.subjects.length} Subjects</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <span className="flex items-center gap-2">
                            <Clock className="size-5" />
                            {course.duration}
                        </span>
                        <span className="flex items-center gap-2">
                            <Award className="size-5" />
                            {course.eligibility}
                        </span>
                        <span className="flex items-center gap-2">
                            <Users className="size-5" />
                            {teachers.length} Expert Faculty
                        </span>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* About Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <BookOpen className="size-6 text-accent" />
                        About This Course
                    </h2>
                    <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
                        <p className="text-lg text-body leading-relaxed mb-6">{course.description}</p>

                        {/* Subject Tags */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-muted mb-3">Subjects Covered</h3>
                            <div className="flex flex-wrap gap-2">
                                {course.subjects.map((subject) => (
                                    <span
                                        key={subject}
                                        className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-border">
                            <div className="text-center p-4 bg-secondary/50 rounded-xl">
                                <Clock className="size-8 mx-auto mb-2 text-accent" />
                                <p className="text-2xl font-bold text-foreground">{course.duration}</p>
                                <p className="text-sm text-muted">Duration</p>
                            </div>
                            <div className="text-center p-4 bg-secondary/50 rounded-xl">
                                <Award className="size-8 mx-auto mb-2 text-accent" />
                                <p className="text-lg font-bold text-foreground">{course.eligibility}</p>
                                <p className="text-sm text-muted">Eligibility</p>
                            </div>
                            <div className="text-center p-4 bg-secondary/50 rounded-xl">
                                <Trophy className="size-8 mx-auto mb-2 text-accent" />
                                <p className="text-2xl font-bold text-foreground">98%+</p>
                                <p className="text-sm text-muted">Pass Rate</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Faculty Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <Users className="size-6 text-accent" />
                        Our Expert Faculty
                    </h2>
                    {teachers.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teachers.map((teacher) => (
                                <article
                                    key={teacher.id}
                                    className="bg-card rounded-xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=6366f1&color=fff&size=80`}
                                                alt={teacher.name}
                                                className="size-16 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-foreground truncate">{teacher.name}</h3>
                                                <p className="text-sm text-accent font-medium">{teacher.designation}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex items-start gap-2">
                                                <GraduationCap className="size-4 text-muted flex-shrink-0 mt-0.5" />
                                                <span className="text-body">{teacher.qualifications}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="size-4 text-muted" />
                                                <span className="text-body">{teacher.experience} Experience</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Star className="size-4 text-yellow-500" />
                                                <span className="text-body font-medium">{teacher.passPercentage} Pass Rate</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-border">
                                            <p className="text-xs text-muted mb-2">Subjects</p>
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.subjects.map((subject) => (
                                                    <span
                                                        key={subject}
                                                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                                                    >
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-secondary/50 rounded-xl p-8 text-center">
                            <p className="text-muted">Faculty information coming soon.</p>
                        </div>
                    )}
                </section>

                {/* Future Pathways Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <Briefcase className="size-6 text-accent" />
                        Future Pathways & Career Options
                    </h2>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl shadow-lg border border-border p-8">
                        {course.futureScope ? (
                            <div className="prose prose-lg max-w-none text-body whitespace-pre-line">
                                {course.futureScope}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-1" />
                                    <p className="text-body">Excellent opportunities in higher education and professional careers</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-1" />
                                    <p className="text-body">Preparation for top entrance exams and competitive tests</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-1" />
                                    <p className="text-body">Strong foundation for emerging fields and future technologies</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                        Join INCPUC and build a strong foundation for your future career in {course.title.split(' ')[0]}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/admissions"
                            className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-lg"
                        >
                            <GraduationCap className="size-5" />
                            Apply Now
                        </Link>
                        <Link
                            to="/courses"
                            className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary-foreground/20 transition-colors font-semibold"
                        >
                            <ArrowLeft className="size-5" />
                            Back to All Courses
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
