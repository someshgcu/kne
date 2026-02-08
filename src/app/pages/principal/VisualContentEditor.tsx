import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, AlertTriangle, ExternalLink } from 'lucide-react';
import { HeroSection } from '../../components/home/HeroSection';
import { PrincipalMessage } from '../../components/home/PrincipalMessage';
import { NewsTicker } from '../../components/home/NewsTicker';
import { Testimonials } from '../../components/home/Testimonials';
import { EditableWrapper } from '../../components/admin/EditableWrapper';

export function VisualContentEditor() {
    return (
        <div className="min-h-screen bg-background">
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
                                    <p className="text-sm text-muted">Click any section to edit</p>
                                </div>
                            </div>
                        </div>
                        {/* Clean anchor tag for preview - no onClick handlers */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                        >
                            <ExternalLink className="size-4" />
                            Preview Live Site
                        </a>
                    </div>
                </div>
            </header>

            {/* Editor Mode Banner */}
            <div className="bg-amber-100 border-b border-amber-200 py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-800 text-sm">
                    <AlertTriangle className="size-4" />
                    <span>
                        <strong>Editor Mode:</strong> Hover over sections to see blue edit borders. Click any element to edit its content.
                    </span>
                </div>
            </div>

            {/* Visual Editor Content - Renders Homepage Sections with editorMode */}
            <div className="visual-editor-mode">
                {/* Hero Section - Now with atomic editing (title, subtitle, CTA each editable) */}
                <HeroSection editorMode={true} />

                {/* Principal Message */}
                <EditableWrapper
                    sectionId="principal_message_text"
                    label="Principal's Message"
                    defaultContent="Welcome to our esteemed institution. At INCPUC, we are committed to nurturing young minds and preparing them for a bright future. Our dedicated faculty and state-of-the-art facilities ensure that every student receives the best possible education."
                >
                    <div className="py-16 bg-secondary/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <PrincipalMessage />
                        </div>
                    </div>
                </EditableWrapper>

                {/* News Section */}
                <EditableWrapper
                    sectionId="news_section_title"
                    label="News Section"
                    defaultContent="Latest News & Updates"
                >
                    <div className="py-12 bg-background">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Latest News</h2>
                            <NewsTicker />
                        </div>
                    </div>
                </EditableWrapper>

                {/* Testimonials */}
                <EditableWrapper
                    sectionId="testimonials_title"
                    label="Testimonials Section"
                    defaultContent="What Our Students Say"
                >
                    <div className="py-16 bg-secondary/5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-foreground text-center mb-8">What Our Students Say</h2>
                            <Testimonials />
                        </div>
                    </div>
                </EditableWrapper>

                {/* About Section */}
                <EditableWrapper
                    sectionId="about_content"
                    label="About Section"
                    defaultContent="INCPUC is a premier pre-university college committed to academic excellence and holistic development. With state-of-the-art facilities and experienced faculty, we prepare students for success in higher education and beyond."
                >
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
                </EditableWrapper>

                {/* Contact Section */}
                <EditableWrapper
                    sectionId="contact_info"
                    label="Contact Information"
                    defaultContent='{"email": "info@incpuc.edu", "phone": "+91 80 1234 5678", "address": "Bangalore, Karnataka"}'
                >
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
                </EditableWrapper>
            </div>
        </div>
    );
}
