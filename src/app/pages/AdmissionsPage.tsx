import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import {
  GraduationCap, User, Phone, BookOpen, Award,
  Send, Loader2, CheckCircle, Phone as PhoneIcon,
  Mail, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdmissionsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    stream: '',
    marks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const streams = [
    { id: 'science-pcmc', title: 'Science (PCMC)' },
    { id: 'science-pcmb', title: 'Science (PCMB)' },
    { id: 'commerce-ebac', title: 'Commerce (EBAC)' },
    { id: 'arts-heba', title: 'Arts (HEBA)' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter student name');
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.stream) {
      toast.error('Please select a stream');
      return false;
    }
    if (!formData.marks || isNaN(Number(formData.marks)) || Number(formData.marks) < 0 || Number(formData.marks) > 100) {
      toast.error('Please enter valid marks percentage (0-100)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // CRITICAL: Save with timestamp field for ReceptionDashboard sorting
      await addDoc(collection(db, 'admissions'), {
        studentName: formData.name.trim(),
        phone: formData.phone.trim(),
        course: formData.stream,
        marks: Number(formData.marks),
        status: 'New',
        notes: 'Direct Website Enquiry',
        timestamp: serverTimestamp() // Required for Dashboard ordering
      });

      setIsSubmitted(true);
      toast.success('Application Sent! We will call you shortly.');

      // Reset form
      setFormData({ name: '', phone: '', stream: '', marks: '' });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSubmitted) {
    return (
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
              <CheckCircle className="size-10" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">
              Enquiry Submitted!
            </h1>
            <p className="text-lg text-body mb-6">
              Thank you for your interest in INCPUC. Our admissions team will call you within <strong>24 hours</strong>.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Submit Another Enquiry
              </button>
              <Link
                to="/courses"
                className="w-full px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors text-center"
              >
                Explore Our Courses
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <GraduationCap className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Admissions Open</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Admission Enquiry 2026
          </h1>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Fill in your details to request a callback from our admission desk.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Card - Takes 3 columns */}
          <div className="lg:col-span-3 bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
              <h2 className="text-xl font-bold">Request Callback</h2>
              <p className="text-sm text-primary-foreground/80">We'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Student Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  <User className="size-4 inline mr-2" />
                  Student Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  <Phone className="size-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Stream Interest */}
              <div>
                <label htmlFor="stream" className="block text-sm font-medium text-foreground mb-2">
                  <BookOpen className="size-4 inline mr-2" />
                  Stream Interest *
                </label>
                <select
                  id="stream"
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value="">Select a stream</option>
                  {streams.map(stream => (
                    <option key={stream.id} value={stream.title}>
                      {stream.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 10th Marks */}
              <div>
                <label htmlFor="marks" className="block text-sm font-medium text-foreground mb-2">
                  <Award className="size-4 inline mr-2" />
                  10th Standard Marks (%) *
                </label>
                <input
                  type="number"
                  id="marks"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    Request Callback
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-bold text-primary mb-4">Contact Us Directly</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">
                    <PhoneIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Phone</p>
                    <p className="font-medium text-foreground">+91-80-2345-6789</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <p className="font-medium text-foreground">admissions@incpuc.edu.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">Address</p>
                    <p className="font-medium text-foreground">123 Education Lane, Jayanagar, Bangalore - 560041</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-border">
              <h3 className="font-bold text-primary mb-3">Why Choose INCPUC?</h3>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                  98%+ Pass Rate Consistently
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                  Experienced Faculty (10+ Years Avg)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                  Modern Infrastructure & Labs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                  Competitive Exam Preparation
                </li>
              </ul>
            </div>

            <Link
              to="/courses"
              className="block bg-card rounded-xl p-6 border border-border hover:border-accent transition-colors group"
            >
              <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                Explore Our Courses →
              </h3>
              <p className="text-sm text-muted">
                View detailed information about PCMC, PCMB, EBAC, and HEBA streams.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
