import { Teacher } from '../../types/teacher';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, GraduationCap } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <article className="bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-secondary/20">
        <ImageWithFallback
          src={teacher.photo || "https://via.placeholder.com/400"}
          alt={`${teacher.name}, ${teacher.designation}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {teacher.impactScore && (
          <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
            <Award className="size-3" />
            <span>{teacher.impactScore}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg md:text-xl font-semibold text-primary mb-1">
          {teacher.name}
        </h3>

        <p className="text-sm text-muted mb-4">
          {teacher.designation}
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <GraduationCap className="size-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Qualifications
              </p>
              <p className="text-sm text-body">
                {teacher.qualifications}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              Subjects
            </p>

            <div className="flex flex-wrap gap-2">
              {(teacher.subjects || []).map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
