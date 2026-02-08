import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type {
    NewsItem,
    Teacher,
    Testimonial,
    PrincipalMessage,
    PerformanceData,
    Job
} from '../data/mockData';

// Generic hook return type
interface UseFirestoreReturn<T> {
    data: T;
    loading: boolean;
    error: Error | null;
}

/**
 * Hook to fetch news items from Firestore with real-time updates
 * Sorted by date in descending order (newest first)
 */
export function useNews(): UseFirestoreReturn<NewsItem[]> {
    const [data, setData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const newsQuery = query(
            collection(db, 'news'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(
            newsQuery,
            (snapshot) => {
                const newsItems: NewsItem[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as NewsItem));
                setData(newsItems);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[useNews] Error fetching news:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}

/**
 * Hook to fetch teachers/faculty from Firestore with real-time updates
 */
export function useTeachers(): UseFirestoreReturn<Teacher[]> {
    const [data, setData] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'teachers'),
            (snapshot) => {
                const teachers: Teacher[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as Teacher));
                setData(teachers);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[useTeachers] Error fetching teachers:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}

/**
 * Hook to fetch principal message from Firestore
 * Fetches from site_sections/principal_message (preferred) or general_content/principal_message (fallback)
 */
export function usePrincipalMessage(): UseFirestoreReturn<PrincipalMessage | null> {
    const [data, setData] = useState<PrincipalMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Try site_sections first (new location)
        const siteSectionsRef = doc(db, 'site_sections', 'principal_message');

        const unsubscribe = onSnapshot(
            siteSectionsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setData(snapshot.data() as PrincipalMessage);
                    setLoading(false);
                    setError(null);
                } else {
                    // Fallback to general_content (old location)
                    const generalContentRef = doc(db, 'general_content', 'principal_message');
                    onSnapshot(
                        generalContentRef,
                        (fallbackSnapshot) => {
                            if (fallbackSnapshot.exists()) {
                                setData(fallbackSnapshot.data() as PrincipalMessage);
                            } else {
                                console.warn('[usePrincipalMessage] Document does not exist in either location');
                                setData(null);
                            }
                            setLoading(false);
                            setError(null);
                        },
                        (err) => {
                            console.error('[usePrincipalMessage] Fallback error:', err);
                            setError(err);
                            setLoading(false);
                        }
                    );
                }
            },
            (err) => {
                console.error('[usePrincipalMessage] Error fetching principal message:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}

/**
 * Hook to fetch testimonials from Firestore with real-time updates
 */
export function useTestimonials(): UseFirestoreReturn<Testimonial[]> {
    const [data, setData] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'testimonials'),
            (snapshot) => {
                const testimonials: Testimonial[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as Testimonial));
                setData(testimonials);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[useTestimonials] Error fetching testimonials:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}

/**
 * Hook to fetch performance data from Firestore
 */
export function usePerformanceData(): UseFirestoreReturn<PerformanceData[]> {
    const [data, setData] = useState<PerformanceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'performance'),
            (snapshot) => {
                const performanceData: PerformanceData[] = snapshot.docs.map((doc) => ({
                    ...doc.data()
                } as PerformanceData));
                setData(performanceData);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[usePerformanceData] Error fetching performance data:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}

/**
 * Hook to fetch job listings from Firestore
 */
export function useJobs(): UseFirestoreReturn<Job[]> {
    const [data, setData] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'jobs'),
            (snapshot) => {
                const jobs: Job[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as Job));
                setData(jobs);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[useJobs] Error fetching jobs:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { data, loading, error };
}
