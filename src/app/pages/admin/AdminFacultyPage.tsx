import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    addDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { TeacherCard } from "../../components/TeacherCard";
import { Teacher } from "../../../types/teacher";
import { Loader2, Trash2 } from "lucide-react";

export default function AdminFacultyPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        qualifications: "",
        subjects: "",
        impactScore: "",
        photo: "",
    });

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "teachers"));
            const data = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as Teacher[];

            setTeachers(data);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = async () => {
        if (!confirmId) return;

        const previous = teachers;
        setTeachers((prev) => prev.filter((t) => t.id !== confirmId));
        setConfirmId(null);

        try {
            await deleteDoc(doc(db, "teachers", confirmId));
        } catch (err) {
            console.error("Delete failed:", err);
            setTeachers(previous);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim()) return;

        setSaving(true);

        try {
            await addDoc(collection(db, "teachers"), {
                ...formData,
                subjects: formData.subjects
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            });

            setFormData({
                name: "",
                designation: "",
                qualifications: "",
                subjects: "",
                impactScore: "",
                photo: "",
            });

            setShowForm(false);
            fetchTeachers();
        } catch (err) {
            console.error("Add failed:", err);
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                    Faculty Management
                </h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow hover:opacity-90 transition"
                >
                    + Add Faculty
                </button>
            </div>

            {/* Faculty Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="bg-card border rounded-2xl shadow-sm hover:shadow-md transition flex flex-col"
                    >
                        <div className="flex-1">
                            <TeacherCard teacher={teacher} />
                        </div>

                        {/* Admin Actions */}
                        <div className="p-4 border-t">
                            <button
                                onClick={() => setConfirmId(teacher.id)}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={16} />
                                Delete Faculty
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Faculty Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-card w-full max-w-lg rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Add Faculty</h2>

                        <div className="space-y-3">
                            {Object.entries(formData).map(([key, value]) => (
                                <input
                                    key={key}
                                    type="text"
                                    placeholder={key}
                                    value={value}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [key]: e.target.value })
                                    }
                                    className="w-full border border-border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-secondary transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAdd}
                                disabled={saving}
                                className="w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Faculty"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-center mb-3">
                            Confirm Deletion
                        </h2>

                        <p className="text-sm text-muted-foreground text-center mb-6">
                            Are you sure you want to delete this faculty member?
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="w-full border py-2 rounded-lg hover:bg-secondary transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
