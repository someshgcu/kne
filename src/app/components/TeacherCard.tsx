import { Teacher } from '../../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, GraduationCap } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <article className="bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-secondary/20">
        <ImageWithFallback
          src={`https://images.unsplash.com/photo-${
            teacher.id === 't1' ? '1568602471122' :
            teacher.id === 't2' ? '1594824476967' :
            teacher.id === 't3' ? '1537368910025' :
            teacher.id === 't4' ? '1573496359142' :
            teacher.id === 't5' ? '1573497019940' :
            teacher.id === 't6' ? '1519085360753' :
            teacher.id === 't7' ? '1580489944761' : '1507003211169'
          }-a86d0318c183?w=400&q=80`}
          alt={`${teacher.name}, ${teacher.designation}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Award className="size-3" aria-hidden="true" />
          <span>{teacher.impactScore}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2">
          {teacher.name}
        </h3>
        <p className="text-sm text-muted mb-3">
          {teacher.designation}
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <GraduationCap className="size-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
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
              {teacher.subjects.map((subject) => (
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
