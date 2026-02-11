import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, AlertTriangle, ExternalLink, Navigation, ChevronDown, LayoutDashboard, BookOpen, Users, ClipboardList, Newspaper } from 'lucide-react';
import { HeroSection } from '../../components/home/HeroSection';
import { PrincipalMessage } from '../../components/home/PrincipalMessage';
import { NewsTicker } from '../../components/home/NewsTicker';
import { Testimonials } from '../../components/home/Testimonials';

export function VisualContentEditor() {
    const navigate = useNavigate();
    const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false);

    const quickJumpOptions = [
        { label: 'Dashboard', path: '/principal/dashboard', icon: LayoutDashboard },
        { label: 'Manage Courses', path: '/principal/courses', icon: BookOpen },
        { label: 'Manage Faculty', path: '/principal/faculty', icon: Users },
        { label: 'Manage News', path: '/principal/news', icon: Newspaper },
        { label: 'Admissions', path: '/principal/reception-view', icon: ClipboardList },
    ];

    const handleQuickJump = (path: string) => {
        navigate(path);
        setIsQuickJumpOpen(false);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Fixed Header */}
            <header className="sticky top-0 z-[90] bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/principal"
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <ArrowLeft className="size-5 text-muted" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <Palette className="size-6 text-accent" />
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">Visual Editor</h1>
                                    <p className="text-sm text-muted">Click customized sections to edit</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Jump Dropdown & Preview */}
                        <div className="flex items-center gap-3">
                            {/* Quick Jump Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsQuickJumpOpen(!isQuickJumpOpen)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm hover:bg-accent/90 transition-colors shadow-sm"
                                >
                                    <Navigation className="size-4" />
                                    Quick Actions
                                    <ChevronDown className={`size-4 transition-transform duration-200 ${isQuickJumpOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isQuickJumpOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsQuickJumpOpen(false)}
                                        />

                                        {/* Menu */}
                                        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                                            <div className="p-2 space-y-1">
                                                {quickJumpOptions.map((option) => (
                                                    <button
                                                        key={option.path}
                                                        onClick={() => handleQuickJump(option.path)}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-secondary rounded-md transition-colors text-sm text-foreground"
                                                    >
                                                        <option.icon className="size-4 text-muted" />
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Preview Live Site */}
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors border border-border"
                            >
                                <ExternalLink className="size-4" />
                                Live Site
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Editor Mode Banner */}
            <div className="bg-amber-100 border-b border-amber-200 py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-800 text-sm font-medium">
                    <AlertTriangle className="size-4" />
                    <span>
                        <strong>Editor Mode Active:</strong> Some sections support in-place editing. Hover or click to edit.
                    </span>
                </div>
            </div>

            {/* Visual Editor Content - Renders Homepage Sections */}
            <div className="visual-editor-mode">
                {/* Hero Section */}
                {/* We pass editorMode=true, but if Hero uses EditableWrapper internally and that is broken, it might need fixing separately.
                    For now, we assume the modal edit strategy is applied to the components we fixed below. */}
                <HeroSection editorMode={true} />

                {/* Principal Message - In-Place Edit Enabled */}
                <PrincipalMessage editorMode={true} />

                {/* News Section - In-Place Management Enabled */}
                <NewsTicker editorMode={true} />

                {/* Testimonials - In-Place Edit Enabled */}
                <Testimonials editorMode={true} />

                {/* About Section - Static (Wrapper removed to prevent redirect loops) */}
                <section className="py-16 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-foreground mb-4">About INCPUC</h2>
                            <p className="text-lg text-muted leading-relaxed">
                                INCPUC is a premier pre-university college committed to academic excellence and holistic development.
                                With state-of-the-art facilities and experienced faculty, we prepare students for success in higher education and beyond.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Section - Static (Wrapper removed to prevent redirect loops) */}
                <section className="py-16 bg-primary text-primary-foreground">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                            <p className="text-lg opacity-90 mb-6">
                                Have questions? We'd love to hear from you.
                            </p>
                            <div className="flex flex-wrap justify-center gap-8">
                                <div>
                                    <div className="font-semibold">Email</div>
                                    <div className="opacity-80">info@incpuc.edu</div>
                                </div>
                                <div>
                                    <div className="font-semibold">Phone</div>
                                    <div className="opacity-80">+91 80 1234 5678</div>
                                </div>
                                <div>
                                    <div className="font-semibold">Address</div>
                                    <div className="opacity-80">Bangalore, Karnataka</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
