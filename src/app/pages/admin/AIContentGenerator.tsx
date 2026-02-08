import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Lightbulb, FileText, PenLine } from 'lucide-react';
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
                // Check for weird/invalid responses
                const content = result.content.trim();
                const isValidContent = content.length > 50 &&
                    !content.toLowerCase().includes('analyse the image') &&
                    !content.toLowerCase().includes('i cannot') &&
                    !content.toLowerCase().includes('i am unable');

                if (isValidContent) {
                    toast.success('Content generated successfully!');
                } else {
                    toast.warning('AI response may need editing. Opening editor...');
                }

                // Always navigate with the content - user can edit it
                navigate('/admin/blog-editor', {
                    state: {
                        generatedContent: content,
                        topic: topic
                    },
                    replace: false
                });
            } else {
                toast.error(result.error || 'Failed to generate content. Try writing manually.');
            }
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('An error occurred. Opening manual editor...');
            // On error, still allow user to write manually with the topic
            navigate('/admin/blog-editor', {
                state: {
                    generatedContent: '',
                    topic: topic
                }
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSkipAI = () => {
        navigate('/admin/blog-editor', {
            state: {
                generatedContent: '',
                topic: topic || ''
            }
        });
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
                    <div className="flex items-center justify-between">
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
                                    <p className="text-sm text-muted">Powered by OpenRouter AI</p>
                                </div>
                            </div>
                        </div>
                        {/* Skip AI Button in Header */}
                        <button
                            onClick={handleSkipAI}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
                        >
                            <PenLine className="size-4" />
                            Write Manually
                        </button>
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

                    {/* Action Buttons */}
                    <div className="space-y-3">
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

                        {/* Skip AI Button (Prominent) */}
                        <button
                            onClick={handleSkipAI}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-all disabled:opacity-50"
                        >
                            <PenLine className="size-5" />
                            Skip AI & Write Manually
                        </button>
                    </div>

                    {/* Info */}
                    <p className="text-xs text-muted text-center mt-4">
                        AI will generate a blog post about your topic. You can edit it in the next step.
                    </p>
                </div>
            </main>
        </div>
    );
}
