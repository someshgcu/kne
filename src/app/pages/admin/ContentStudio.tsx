import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Copy, Download, MapPin } from 'lucide-react';
import { toast } from 'sonner';

type ContentLocation = 'home' | 'events' | 'notice';

export function ContentStudio() {
  // NOTE: Auth is handled by ProtectedRoute wrapper in App.tsx
  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState<ContentLocation>('home');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation (in production, this would call Gemini API)
    setTimeout(() => {
      const mockContent = generateMockContent(prompt);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
      toast.success('Content generated successfully!');
    }, 2000);
  };

  const generateMockContent = (userPrompt: string): string => {
    const prompts = userPrompt.toLowerCase();

    if (prompts.includes('sports day')) {
      return `# Sports Day 2026 - A Grand Success

Welcome students and faculty! Today marks a memorable occasion as we celebrate our Annual Sports Day 2026. The event was filled with energy, enthusiasm, and sportsmanship.

## Event Highlights

Our college hosted an incredible Sports Day with over 500 students participating across various events. The day began with an inspiring march past, followed by track and field events, relay races, and team sports.

### Key Achievements

- **100m Sprint**: Record-breaking performance by Aditya Sharma
- **Relay Race**: Science stream team secured first place
- **Long Jump**: New college record set by Priya Menon
- **Basketball Tournament**: Commerce team emerged victorious

## Spirit of Competition

Students showcased exceptional talent and sportsmanship throughout the day. The event emphasized not just winning, but participation, teamwork, and healthy competition.

We extend our gratitude to all participants, coaches, and volunteers who made this event a resounding success. Looking forward to next year's Sports Day!

*Published: February 7, 2026*`;
    } else if (prompts.includes('exam') || prompts.includes('result')) {
      return `# Examination Update

## Important Announcement

Dear Students and Parents,

We are pleased to announce important updates regarding the upcoming board examinations and recent results.

### Examination Schedule

- **Start Date**: March 15, 2026
- **Duration**: 3 weeks
- **Timings**: 9:00 AM - 12:00 PM

### Recent Results

We are proud to announce that our students have achieved a remarkable 99% pass rate with 85% securing distinctions. This achievement is a testament to the hard work of our students and dedication of our faculty.

### Preparation Support

Special revision classes are being conducted by our expert faculty members. Students are encouraged to attend these sessions and clear any doubts.

Best wishes to all students!

*INCPUC Administration*`;
    } else {
      return `# ${prompt}

## Introduction

${prompt} is an important topic for our college community. This content has been generated to provide information and updates.

## Key Points

- Comprehensive coverage of the topic
- Relevant information for students and parents
- Updates from INCPUC administration

## Details

We are committed to providing the best educational experience for all our students. This announcement reflects our ongoing efforts to maintain transparency and communication with our community.

### What This Means

This initiative demonstrates our commitment to excellence and continuous improvement. We encourage all stakeholders to stay informed and engaged.

## Conclusion

For more information, please contact the administration office or visit our website.

*INCPUC Team*`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  return (
    <main className="min-h-screen bg-secondary/10">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-6" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">AI Blog Writer</h1>
              <p className="text-sm text-primary-foreground/80">
                Generate content using AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                  <Sparkles className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">Content Prompt</h2>
                  <p className="text-sm text-body">Describe what you want to create</p>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-body mb-2"
                  >
                    Enter your prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a summary for Sports Day 2026"
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground resize-none"
                    required
                  />
                </div>

                {/* Location Dropdown */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-body mb-2"
                  >
                    <MapPin className="size-4 inline-block mr-1" />
                    Content Location
                  </label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value as ContentLocation)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                  >
                    <option value="home">🏠 Home Page</option>
                    <option value="events">📅 Events Section</option>
                    <option value="notice">📢 Notice Board</option>
                  </select>
                  <p className="text-xs text-muted mt-1">Where this content will be displayed</p>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-5" aria-hidden="true" />
                      Generate Content
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Tips */}
            <div className="bg-accent/10 border border-accent rounded-xl p-6">
              <h3 className="font-semibold text-primary mb-3">💡 Tips for better results:</h3>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Be specific about the topic and tone you want</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Include key details like dates, names, or statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Specify the format (announcement, article, summary, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Review and edit the generated content before publishing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div className="bg-card rounded-xl shadow-lg border border-border p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Generated Content</h2>
                {generatedContent && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      aria-label="Copy content"
                    >
                      <Copy className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      aria-label="Download content"
                    >
                      <Download className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {generatedContent ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-body leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted">
                    <div>
                      <Sparkles className="size-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
                      <p>Your generated content will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
