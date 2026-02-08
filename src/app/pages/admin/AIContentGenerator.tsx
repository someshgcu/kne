import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Lightbulb, FileText } from 'lucide-react';
import { generateBlogPost } from '../../../lib/openrouter';
import { toast } from 'sonner';

export function AIContentGenerator() {
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }

        setIsGenerating(true);

        try {
            const keywordList = keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k.length > 0);

            const result = await generateBlogPost(topic, keywordList);

            if (result.success && result.content) {
                toast.success('Content generated successfully!');
                // Navigate to BlogEditor with generated content
                navigate('/admin/blog-editor', {
                    state: {
                        generatedContent: result.content,
                        topic: topic
                    }
                });
            } else {
                toast.error(result.error || 'Failed to generate content');
            }
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('An error occurred while generating content');
        } finally {
            setIsGenerating(false);
        }
    };

    const sampleTopics = [
        'Benefits of PU Education',
        'Tips for Board Exam Preparation',
        'Career Guidance for Science Students',
        'Importance of Extra-curricular Activities',
        'Time Management for Students'
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin/dashboard"
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <ArrowLeft className="size-5 text-muted" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Sparkles className="size-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">AI Content Generator</h1>
                                <p className="text-sm text-muted">Powered by Llama 3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    {/* Topic Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            <Lightbulb className="inline size-4 mr-1" />
                            Topic / Title
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Benefits of Science Stream Education"
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            disabled={isGenerating}
                        />
                    </div>

                    {/* Keywords Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            <FileText className="inline size-4 mr-1" />
                            Keywords (optional, comma-separated)
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g., career, science, engineering, medicine"
                            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            disabled={isGenerating}
                        />
                    </div>

                    {/* Sample Topics */}
                    <div className="mb-6">
                        <p className="text-sm text-muted mb-2">Quick topics:</p>
                        <div className="flex flex-wrap gap-2">
                            {sampleTopics.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTopic(t)}
                                    disabled={isGenerating}
                                    className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors disabled:opacity-50"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Generating with AI...
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-5" />
                                Generate Content
                            </>
                        )}
                    </button>

                    {/* Info */}
                    <p className="text-xs text-muted text-center mt-4">
                        AI will generate a blog post about your topic. You can edit it in the next step.
                    </p>
                </div>

                {/* Direct to Blog Editor */}
                <div className="mt-6 text-center">
                    <Link
                        to="/admin/blog-editor"
                        className="text-accent hover:underline text-sm"
                    >
                        Or write manually without AI →
                    </Link>
                </div>
            </main>
        </div>
    );
}
