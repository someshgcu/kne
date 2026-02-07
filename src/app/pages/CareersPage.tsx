import { jobs } from '../../data/mockData';
import { Briefcase, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export function CareersPage() {
  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <Briefcase className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Join Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Career Opportunities
          </h1>
          <p className="text-lg text-body max-w-3xl mx-auto">
            Be part of a team that's shaping the future of education. Explore our current openings.
          </p>
        </div>

        {/* Job Listings */}
        {jobs.length > 0 ? (
          <section aria-labelledby="jobs-heading">
            <h2 id="jobs-heading" className="text-2xl font-bold text-primary mb-6">
              Current Openings ({jobs.length})
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {jobs.map((job) => (
                <AccordionItem
                  key={job.id}
                  value={job.id}
                  className="bg-card rounded-xl shadow-md border border-border overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between w-full text-left">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary mb-1">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6 pt-4 border-t border-border">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Description
                        </h4>
                        <p className="text-body leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h4 className="font-semibold text-primary mb-3">
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="size-1.5 bg-accent rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
                              <span className="text-body">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply Button */}
                      <div className="pt-4">
                        <a
                          href={`mailto:careers@incpuc.edu.in?subject=Application for ${job.title}&body=Dear Hiring Team,%0D%0A%0D%0AI would like to apply for the ${job.title} position at INCPUC.%0D%0A%0D%0APlease find my resume and cover letter attached.%0D%0A%0D%0AThank you for your consideration.`}
                          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-md"
                        >
                          <Mail className="size-5" aria-hidden="true" />
                          Apply Now
                        </a>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : (
          <div 
            className="text-center py-16 bg-secondary/10 rounded-xl"
            role="status"
          >
            <Briefcase className="size-16 text-muted mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              No Current Openings
            </h3>
            <p className="text-body">
              Please check back later for new opportunities
            </p>
          </div>
        )}

        {/* Why Join Us */}
        <section className="mt-16 bg-primary text-primary-foreground rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Why Work With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="bg-accent text-accent-foreground w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence in Education</h3>
              <p className="text-sm text-primary-foreground/80">
                Join a team with a proven 99% pass rate and commitment to quality education
              </p>
            </div>
            <div>
              <div className="bg-accent text-accent-foreground w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Professional Growth</h3>
              <p className="text-sm text-primary-foreground/80">
                Continuous training and development opportunities for faculty and staff
              </p>
            </div>
            <div>
              <div className="bg-accent text-accent-foreground w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Collaborative Environment</h3>
              <p className="text-sm text-primary-foreground/80">
                Work with passionate educators in a supportive and innovative atmosphere
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
