import { useState } from 'react';
import { CheckCircle2, AlertCircle, Calculator, GraduationCap, FileText, Calendar } from 'lucide-react';

export function AdmissionsPage() {
  const [marks, setMarks] = useState('');
  const [result, setResult] = useState<{
    eligible: boolean;
    stream: string;
    message: string;
  } | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marksNum = parseFloat(marks);
    
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setResult({
        eligible: false,
        stream: '',
        message: 'Please enter a valid percentage between 0 and 100.'
      });
      return;
    }

    if (marksNum >= 85) {
      setResult({
        eligible: true,
        stream: 'Science',
        message: 'Congratulations! You have a High Chance for admission to the Science stream. Your excellent marks qualify you for our PCMB/PCMC courses.'
      });
    } else if (marksNum >= 75) {
      setResult({
        eligible: true,
        stream: 'Science',
        message: 'Good news! You are eligible for the Science stream. We recommend applying early to secure your seat.'
      });
    } else if (marksNum >= 60) {
      setResult({
        eligible: true,
        stream: 'Commerce',
        message: 'You qualify for the Commerce stream. Our commerce program offers excellent career opportunities in business and finance.'
      });
    } else {
      setResult({
        eligible: false,
        stream: '',
        message: 'Based on your marks, we recommend scheduling a counseling session with our admission team to discuss your options. Please contact us at +91-80-2345-6789.'
      });
    }
  };

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <GraduationCap className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Admissions 2026-27</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Join INCPUC
          </h1>
          <p className="text-lg text-body max-w-3xl mx-auto">
            Begin your journey to academic excellence. Check your eligibility and apply today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Cutoff Predictor */}
          <section 
            className="bg-card rounded-2xl shadow-xl p-8 border border-border"
            aria-labelledby="predictor-heading"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                <Calculator className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="predictor-heading" className="text-2xl font-bold text-primary">
                  Cutoff Predictor
                </h2>
                <p className="text-sm text-body mt-1">Check your stream eligibility instantly</p>
              </div>
            </div>

            <form onSubmit={handlePredict} className="space-y-6">
              <div>
                <label 
                  htmlFor="marks-input"
                  className="block text-sm font-medium text-body mb-2"
                >
                  Enter your 10th Grade Percentage (%)
                </label>
                <input
                  id="marks-input"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g., 85.5"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground text-lg"
                  required
                  aria-describedby="marks-help"
                />
                <p id="marks-help" className="mt-2 text-sm text-muted">
                  Enter your percentage from 10th standard board exams
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-accent-foreground px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg shadow-md"
              >
                Check Eligibility
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div
                className={`mt-6 p-6 rounded-lg border-2 ${
                  result.eligible
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  {result.eligible ? (
                    <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="size-6 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    {result.stream && (
                      <h3 className="font-bold text-lg text-primary mb-2">
                        {result.stream} Stream
                      </h3>
                    )}
                    <p className="text-body leading-relaxed">
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Admission Information */}
          <div className="space-y-6">
            <section className="bg-card rounded-2xl shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <FileText className="size-6" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  Eligibility Criteria
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Science Stream</h3>
                  <p className="text-body">Minimum 75% in 10th standard board exams</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Commerce Stream</h3>
                  <p className="text-body">Minimum 60% in 10th standard board exams</p>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-2xl shadow-md p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <Calendar className="size-6" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-primary">
                  Important Dates
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-body">Application Start</span>
                  <span className="font-semibold text-primary">January 15, 2026</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-body">Early Bird Deadline</span>
                  <span className="font-semibold text-primary">March 1, 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body">Final Deadline</span>
                  <span className="font-semibold text-primary">March 31, 2026</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Additional Information */}
        <section className="bg-primary text-primary-foreground rounded-2xl shadow-xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              How to Apply
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground rounded-full mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Check Eligibility</h3>
                <p className="text-sm text-primary-foreground/80">
                  Use the cutoff predictor to verify your qualification
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground rounded-full mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Submit Documents</h3>
                <p className="text-sm text-primary-foreground/80">
                  Bring 10th mark sheet, TC, and 3 passport photos
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground rounded-full mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Complete Registration</h3>
                <p className="text-sm text-primary-foreground/80">
                  Pay fees and receive your admission confirmation
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a
                href="mailto:admissions@incpuc.edu.in?subject=Admission Inquiry"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-lg"
              >
                Contact Admissions Office
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
