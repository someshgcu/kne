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
        <main className="min-h-screen bg-[#FDFDFE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C1F70]">
                            Faculty Management
                        </h1>
                        <p className="text-[#9A84A6] mt-1">
                            Manage teacher profiles and academic data
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full sm:w-auto bg-[#2C1F70] text-white px-6 py-2.5 rounded-xl shadow hover:bg-[#24195d] transition"
                    >
                        + Add Faculty
                    </button>
                </div>

                {/* Faculty Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="bg-white border border-[#D8D1E9] rounded-3xl shadow-sm hover:shadow-lg transition flex flex-col"
                        >
                            <div className="flex-1">
                                <TeacherCard teacher={teacher} />
                            </div>

                            {/* Admin Actions */}
                            <div className="p-5 border-t border-[#D8D1E9]">
                                <button
                                    onClick={() => setConfirmId(teacher.id)}
                                    className="w-full bg-[#EFD22E] text-[#2C1F70] font-semibold py-2.5 rounded-xl hover:brightness-95 transition"
                                >
                                    Delete Faculty
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Faculty Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                        <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-[#2C1F70] mb-6">
                                Add Faculty
                            </h2>

                            <div className="space-y-4">
                                {Object.entries(formData).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-[#2C1F70] mb-1 capitalize">
                                            {key}
                                        </label>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) =>
                                                setFormData({ ...formData, [key]: e.target.value })
                                            }
                                            className="w-full border border-[#D8D1E9] px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EFD22E]"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="w-full sm:w-auto border border-[#D8D1E9] px-5 py-2.5 rounded-xl hover:bg-[#F3F1FA] transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleAdd}
                                    disabled={saving}
                                    className="w-full sm:w-auto bg-[#2C1F70] text-white px-6 py-2.5 rounded-xl hover:bg-[#24195d] transition disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Faculty"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm Delete Modal */}
                {confirmId && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                        <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center">
                            <h2 className="text-xl font-bold text-[#2C1F70] mb-3">
                                Confirm Deletion
                            </h2>

                            <p className="text-[#9A84A6] mb-6">
                                Are you sure you want to remove this faculty member?
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setConfirmId(null)}
                                    className="w-full border border-[#D8D1E9] py-2.5 rounded-xl hover:bg-[#F3F1FA] transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-[#EFD22E] text-[#2C1F70] font-semibold py-2.5 rounded-xl hover:brightness-95 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
