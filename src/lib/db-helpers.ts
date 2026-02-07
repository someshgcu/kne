import {
    collection,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';
import type { AuditLog, AdmissionStatus } from '../types/firestore';

/**
 * Log an action to the audit_logs collection
 * @param user - Current Firebase User object
 * @param action - Action performed (e.g., 'Updated Admission Status')
 * @param details - Details about the action
 */
export async function logAction(
    user: User | null,
    action: string,
    details: string
): Promise<string | null> {
    if (!user) {
        console.warn('[logAction] No user provided, skipping audit log');
        return null;
    }

    try {
        // Get user role from custom claims or default to 'unknown'
        const tokenResult = await user.getIdTokenResult();
        const userRole = (tokenResult.claims.role as string) || 'unknown';

        const auditLog: Omit<AuditLog, 'id'> = {
            userId: user.uid,
            userEmail: user.email || 'unknown',
            userRole,
            action,
            details,
            timestamp: serverTimestamp() as Timestamp
        };

        const docRef = await addDoc(collection(db, 'audit_logs'), auditLog);
        console.log('[logAction] Audit log created:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('[logAction] Error creating audit log:', error);
        return null;
    }
}

/**
 * Update admission status and log the action
 * @param id - Admission document ID
 * @param status - New status
 * @param notes - Updated notes
 * @param user - Current Firebase User (for audit logging)
 */
export async function updateAdmissionStatus(
    id: string,
    status: AdmissionStatus,
    notes: string,
    user: User | null
): Promise<boolean> {
    try {
        const admissionRef = doc(db, 'admissions', id);

        await updateDoc(admissionRef, {
            status,
            notes,
            lastUpdated: serverTimestamp(),
            updatedBy: user?.uid || 'unknown'
        });

        // Log the action
        await logAction(
            user,
            'Updated Admission Status',
            `Changed admission ${id} status to "${status}". Notes: ${notes || 'None'}`
        );

        console.log('[updateAdmissionStatus] Successfully updated:', id);
        return true;
    } catch (error) {
        console.error('[updateAdmissionStatus] Error updating admission:', error);
        return false;
    }
}

/**
 * Update a site section's content
 * @param sectionId - Section document ID
 * @param content - New content
 * @param isVisible - Visibility toggle
 * @param user - Current Firebase User (for audit logging)
 */
export async function updateSiteSection(
    sectionId: string,
    content: string,
    isVisible: boolean,
    user: User | null
): Promise<boolean> {
    try {
        const sectionRef = doc(db, 'site_sections', sectionId);

        await updateDoc(sectionRef, {
            content,
            isVisible,
            lastUpdated: serverTimestamp(),
            updatedBy: user?.uid || 'unknown'
        });

        // Log the action
        await logAction(
            user,
            'Updated Site Section',
            `Updated section "${sectionId}". Visible: ${isVisible}`
        );

        console.log('[updateSiteSection] Successfully updated:', sectionId);
        return true;
    } catch (error) {
        console.error('[updateSiteSection] Error updating site section:', error);
        return false;
    }
}
