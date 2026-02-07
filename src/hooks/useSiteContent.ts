import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import type { SiteSection } from '../types/firestore';
import { logAction } from '../lib/db-helpers';

interface UseSiteContentReturn {
    content: string;
    title: string;
    isVisible: boolean;
    loading: boolean;
    error: Error | null;
    updateContent: (newContent: string, newVisibility?: boolean) => Promise<boolean>;
}

/**
 * Hook to manage site section content with real-time updates
 * @param sectionId - The ID of the site_sections document to manage
 */
export function useSiteContent(sectionId: string): UseSiteContentReturn {
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!sectionId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'site_sections', sectionId);

        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data() as SiteSection;
                    setContent(data.content || '');
                    setTitle(data.title || sectionId);
                    setIsVisible(data.isVisible ?? true);
                } else {
                    // Document doesn't exist yet - initialize with defaults
                    setContent('');
                    setTitle(sectionId);
                    setIsVisible(true);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('[useSiteContent] Error fetching content:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [sectionId]);

    /**
     * Update the content for this section
     */
    const updateContent = async (
        newContent: string,
        newVisibility?: boolean
    ): Promise<boolean> => {
        try {
            const docRef = doc(db, 'site_sections', sectionId);
            const user = auth.currentUser;

            const updateData: Partial<SiteSection> = {
                content: newContent,
                isVisible: newVisibility ?? isVisible,
                lastUpdated: serverTimestamp() as any,
                updatedBy: user?.uid || 'unknown'
            };

            // Use setDoc with merge to create if doesn't exist
            await setDoc(docRef, {
                ...updateData,
                title: title || sectionId
            }, { merge: true });

            // Log the action
            await logAction(
                user,
                'Updated Site Content',
                `Updated section "${sectionId}". Visible: ${newVisibility ?? isVisible}`
            );

            return true;
        } catch (err) {
            console.error('[useSiteContent] Error updating content:', err);
            setError(err instanceof Error ? err : new Error('Failed to update content'));
            return false;
        }
    };

    return {
        content,
        title,
        isVisible,
        loading,
        error,
        updateContent
    };
}
