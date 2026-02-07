import { Timestamp } from 'firebase/firestore';

/**
 * Audit log for tracking all user actions
 */
export interface AuditLog {
    id?: string;
    userId: string;
    userEmail: string;
    userRole: string;
    action: string;
    details: string;
    timestamp: Timestamp | Date;
}

/**
 * Admission lead for the Front Office CRM
 */
export type AdmissionStatus = 'New' | 'Interested' | 'Not Interested' | 'Called';

export interface Admission {
    id?: string;
    studentName: string;
    phone: string;
    course: string;
    status: AdmissionStatus;
    notes: string;
    timestamp: Timestamp | Date;
    lastUpdated?: Timestamp | Date;
    updatedBy?: string;
}

/**
 * Site section for the Generic Content Editor
 */
export interface SiteSection {
    id?: string;
    title: string;
    content: string;
    isVisible: boolean;
    lastUpdated: Timestamp | Date;
    updatedBy?: string;
}

/**
 * Content item for media management (blogs, videos, images)
 */
export type ContentType = 'blog' | 'video' | 'image';
export type ContentLocation = 'home' | 'events' | 'notice';

export interface ContentItem {
    id?: string;
    title: string;
    type: ContentType;
    location: ContentLocation;
    isVisible: boolean;
    url?: string;
    description?: string;
    createdAt: Timestamp | Date;
    createdBy?: string;
}

/**
 * User roles in the system
 */
export type UserRole = 'admin' | 'principal' | 'front_office';

/**
 * Firebase user document structure
 */
export interface FirestoreUser {
    uid: string;
    email: string;
    role: UserRole;
    displayName?: string;
    createdAt?: Timestamp | Date;
    lastLogin?: Timestamp | Date;
}
