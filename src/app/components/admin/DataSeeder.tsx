import { useState } from 'react';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
    teachers,
    newsItems,
    jobs,
    performanceData,
    testimonials,
    galleryImages,
    principalMessage,
    defaultHomeLayout
} from '../../../data/mockData';
import { toast } from 'sonner';
import { Database, Loader2, AlertTriangle } from 'lucide-react';

export function DataSeeder() {
    const [isSeeding, setIsSeeding] = useState(false);

    const seedDatabase = async () => {
        // Safety confirmation
        const confirmed = window.confirm(
            '⚠️ WARNING: This will seed the database with mock data.\n\n' +
            'This action will add documents to the following collections:\n' +
            '• teachers\n• news\n• jobs\n• performance\n• testimonials\n• gallery\n• general_content\n• settings\n\n' +
            'Are you sure you want to proceed?'
        );

        if (!confirmed) {
            toast.info('Database seeding cancelled');
            return;
        }

        setIsSeeding(true);

        try {
            const batch = writeBatch(db);

            // Seed teachers collection
            teachers.forEach((teacher) => {
                const docRef = doc(collection(db, 'teachers'));
                batch.set(docRef, teacher);
            });

            // Seed news collection
            newsItems.forEach((news) => {
                const docRef = doc(collection(db, 'news'));
                batch.set(docRef, news);
            });

            // Seed jobs collection
            jobs.forEach((job) => {
                const docRef = doc(collection(db, 'jobs'));
                batch.set(docRef, job);
            });

            // Seed performance collection
            performanceData.forEach((perf) => {
                const docRef = doc(collection(db, 'performance'));
                batch.set(docRef, perf);
            });

            // Seed testimonials collection
            testimonials.forEach((testimonial) => {
                const docRef = doc(collection(db, 'testimonials'));
                batch.set(docRef, testimonial);
            });

            // Seed gallery collection
            galleryImages.forEach((image) => {
                const docRef = doc(collection(db, 'gallery'));
                batch.set(docRef, image);
            });

            // Seed principal_message in general_content collection
            const principalRef = doc(db, 'general_content', 'principal_message');
            batch.set(principalRef, principalMessage);

            // Seed home_layout in settings collection
            const layoutRef = doc(db, 'settings', 'home_layout');
            batch.set(layoutRef, { widgets: defaultHomeLayout });

            // Commit the batch
            await batch.commit();

            toast.success('✅ Database seeded successfully!', {
                description: `Added ${teachers.length} teachers, ${newsItems.length} news items, ${jobs.length} jobs, ${performanceData.length} performance records, ${testimonials.length} testimonials, ${galleryImages.length} gallery images, and configuration documents.`
            });
        } catch (error) {
            console.error('[DataSeeder] Error seeding database:', error);
            toast.error('Failed to seed database', {
                description: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-lg">
                    <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        Database Seeder
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        Populate the Firestore database with mock data from <code className="bg-amber-200 dark:bg-amber-800 px-1 rounded">mockData.ts</code>.
                        Use this only for initial setup or development.
                    </p>
                    <button
                        onClick={seedDatabase}
                        disabled={isSeeding}
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        {isSeeding ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Seeding Database...
                            </>
                        ) : (
                            <>
                                <Database className="size-4" />
                                Seed Database
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
