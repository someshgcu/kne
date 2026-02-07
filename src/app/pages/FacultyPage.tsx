import { useState } from 'react';
import { useTeachers } from '../../hooks/useContent';
import { teachers as fallbackTeachers, Teacher } from '../../data/mockData';
import { TeacherCard } from '../components/TeacherCard';
import { Users, Filter, Loader2 } from 'lucide-react';

type CourseFilter = 'all' | 'PCMC' | 'PCMB' | 'Commerce' | 'Languages';

export function FacultyPage() {
  const [filter, setFilter] = useState<CourseFilter>('all');
  const { data: teachers, loading, error } = useTeachers();

  // Use Firestore data or fallback to static data
  const teacherData = teachers.length > 0 ? teachers : (error ? fallbackTeachers : []);

  const getFilteredTeachers = () => {
    const sourceTeachers = loading ? [] : teacherData;

    if (filter === 'all') return sourceTeachers;

    const subjectMap: Record<CourseFilter, string[]> = {
      all: [],
      PCMC: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
      PCMB: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics'],
      Languages: ['English']
    };

    const relevantSubjects = subjectMap[filter];
    return sourceTeachers.filter((teacher) =>
      teacher.subjects.some((subject) => relevantSubjects.includes(subject))
    );
  };

  const filteredTeachers = getFilteredTeachers();

  const filters: { value: CourseFilter; label: string }[] = [
    { value: 'all', label: 'All Faculty' },
    { value: 'PCMC', label: 'PCMC (Science with CS)' },
    { value: 'PCMB', label: 'PCMB (Science with Biology)' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Languages', label: 'Languages' }
  ];

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl shadow-md border border-border p-6 animate-pulse"
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-secondary mb-4" />
            <div className="h-5 w-32 bg-secondary rounded mb-2" />
            <div className="h-4 w-24 bg-secondary rounded mb-3" />
            <div className="h-3 w-full bg-secondary rounded mb-2" />
            <div className="h-3 w-3/4 bg-secondary rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <Users className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Meet Our Faculty
          </h1>
          <p className="text-lg text-body max-w-3xl mx-auto">
            Expert educators committed to your academic success with proven track records
          </p>
        </div>

        {/* Filter Section */}
        <section
          className="mb-8"
          aria-labelledby="filter-heading"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="size-5 text-primary" aria-hidden="true" />
            <h2 id="filter-heading" className="text-lg font-semibold text-primary">
              Filter by Department
            </h2>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-3 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-6 py-3 rounded-lg transition-all font-medium ${filter === f.value
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                aria-pressed={filter === f.value}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden">
            <label htmlFor="filter-select" className="sr-only">
              Select Department
            </label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value as CourseFilter)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {filters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Loading State */}
        {loading ? (
          <>
            <div className="mb-6 flex items-center gap-2">
              <Loader2 className="size-5 animate-spin text-accent" />
              <p className="text-muted">Loading faculty members...</p>
            </div>
            <LoadingSkeleton />
          </>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-body">
                Showing <span className="font-semibold text-primary">{filteredTeachers.length}</span> faculty member{filteredTeachers.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Faculty Grid */}
            {filteredTeachers.length > 0 ? (
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                role="list"
              >
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} role="listitem">
                    <TeacherCard teacher={teacher} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-16 bg-secondary/10 rounded-xl"
                role="status"
              >
                <Users className="size-16 text-muted mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  No Faculty Found
                </h3>
                <p className="text-body">
                  Try selecting a different department filter
                </p>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <section className="mt-16 bg-primary text-primary-foreground rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to Join Our Faculty?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate educators to join our team. Check our careers page for current openings.
          </p>
          <a
            href="/careers"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-lg"
          >
            View Openings
          </a>
        </section>
      </div>
    </main>
  );
}
