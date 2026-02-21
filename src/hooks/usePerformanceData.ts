import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { performanceData as mockPerformanceData, PerformanceData } from '../data/mockData';

interface UsePerformanceDataReturn {
    data: PerformanceData[];
    loading: boolean;
    error: Error | null;
}

export function usePerformanceData(): UsePerformanceDataReturn {
    const [data, setData] = useState<PerformanceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            setLoading(true);
            setError(null);

            try {
                const querySnapshot = await getDocs(collection(db, 'performance'));

                if (querySnapshot.empty) {
                    // Fallback to mock data if Firestore collection is empty
                    console.log('[usePerformanceData] Firestore collection empty, using mockData');
                    setData(mockPerformanceData);
                } else {
                    // Transform Firestore documents to PerformanceData array
                    const firestoreData = querySnapshot.docs.map(doc => {
                        const docData = doc.data();
                        return {
                            year: docData.year || '',
                            stream: docData.stream || '',
                            passRate: docData.passRate || 0,
                            distinctionRate: docData.distinctionRate || 0,
                            totalStudents: docData.totalStudents || 0
                        } as PerformanceData;
                    });

                    console.log('[usePerformanceData] Loaded from Firestore:', firestoreData.length, 'records');
                    setData(firestoreData);
                }
            } catch (err) {
                console.error('[usePerformanceData] Error fetching data:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                // Fallback to mock data on error
                setData(mockPerformanceData);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, []);

    return { data, loading, error };
}
