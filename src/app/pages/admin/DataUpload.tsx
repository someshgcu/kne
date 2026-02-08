import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, FileSpreadsheet, CheckCircle2, AlertCircle, Users, GraduationCap, Loader2 } from 'lucide-react';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { logAction } from '../../../lib/db-helpers';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

type DataType = 'faculty' | 'students';

interface ParsedRow {
  [key: string]: string | number | undefined;
}

interface UploadResult {
  success: boolean;
  message: string;
  count: number;
}

export function DataUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('students');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const extension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

    if (!validExtensions.includes(extension)) {
      toast.error('Please select a valid Excel or CSV file');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const parseExcelFile = async (file: File): Promise<ParsedRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(worksheet, { defval: '' });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setResult(null);

    try {
      const rows = await parseExcelFile(file);

      if (rows.length === 0) {
        toast.error('No data found in the file');
        setIsUploading(false);
        return;
      }

      // Process in batches (Firestore limit is 500 per batch)
      const BATCH_SIZE = 400;
      let totalUploaded = 0;

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const chunk = rows.slice(i, i + BATCH_SIZE);

        for (const row of chunk) {
          if (dataType === 'faculty') {
            // Map faculty columns
            const docRef = doc(collection(db, 'teachers'));
            batch.set(docRef, {
              name: String(row['Name'] || row['name'] || '').trim(),
              subject: String(row['Subject'] || row['subject'] || row['Department'] || '').trim(),
              qualification: String(row['Qualification'] || row['qualification'] || row['Degree'] || '').trim(),
              email: String(row['Email'] || row['email'] || '').trim(),
              phone: String(row['Phone'] || row['phone'] || row['Contact'] || '').trim(),
              experience: String(row['Experience'] || row['experience'] || '').trim(),
              createdAt: serverTimestamp(),
              uploadedBy: auth.currentUser?.uid || 'unknown',
              source: 'excel_upload'
            });
          } else {
            // Map student/admissions columns
            const docRef = doc(collection(db, 'admissions'));
            batch.set(docRef, {
              name: String(row['Name'] || row['name'] || row['Student Name'] || '').trim(),
              course: String(row['Course'] || row['course'] || row['Stream'] || row['Department'] || '').trim(),
              phone: String(row['Phone'] || row['phone'] || row['Contact'] || row['Mobile'] || '').trim(),
              email: String(row['Email'] || row['email'] || '').trim(),
              parentName: String(row['Parent Name'] || row['parent_name'] || row['Guardian'] || '').trim(),
              address: String(row['Address'] || row['address'] || '').trim(),
              status: 'imported',
              createdAt: serverTimestamp(),
              uploadedBy: auth.currentUser?.uid || 'unknown',
              source: 'excel_upload'
            });
          }
        }

        await batch.commit();
        totalUploaded += chunk.length;
      }

      // Log action
      await logAction(
        auth.currentUser,
        'bulk_data_upload',
        `Uploaded ${totalUploaded} ${dataType === 'faculty' ? 'faculty members' : 'student records'} via Excel`
      );

      setResult({
        success: true,
        message: `Successfully uploaded ${totalUploaded} records!`,
        count: totalUploaded
      });

      toast.success(`Uploaded ${totalUploaded} records successfully!`);

    } catch (error) {
      console.error('Upload error:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process file',
        count: 0
      });
      toast.error('Failed to upload data');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <main className="min-h-screen bg-secondary/10">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/principal/dashboard"
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-6" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Bulk Data Upload</h1>
              <p className="text-sm text-primary-foreground/80">
                Upload Excel files to import data
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                  <FileSpreadsheet className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">Upload Excel File</h2>
                  <p className="text-sm text-body">Import faculty or student data</p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Data Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDataType('students')}
                      className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${dataType === 'students'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                        }`}
                    >
                      <GraduationCap className={`size-5 ${dataType === 'students' ? 'text-accent' : 'text-muted'}`} />
                      <span className={dataType === 'students' ? 'font-semibold text-foreground' : 'text-muted'}>
                        Student Admissions
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDataType('faculty')}
                      className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${dataType === 'faculty'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                        }`}
                    >
                      <Users className={`size-5 ${dataType === 'faculty' ? 'text-accent' : 'text-muted'}`} />
                      <span className={dataType === 'faculty' ? 'font-semibold text-foreground' : 'text-muted'}>
                        Faculty List
                      </span>
                    </button>
                  </div>
                </div>

                {/* File Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent hover:bg-accent/5'
                    }`}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className={`size-12 mx-auto mb-4 ${isDragging ? 'text-accent' : 'text-muted'}`} aria-hidden="true" />
                  <p className="text-body mb-2">
                    {file ? (
                      <span className="font-semibold text-accent">{file.name}</span>
                    ) : (
                      'Drag and drop your Excel file here'
                    )}
                  </p>
                  <p className="text-sm text-muted">
                    Supports .xlsx, .xls, and .csv files
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!file || isUploading}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="size-5" aria-hidden="true" />
                      Upload & Import
                    </>
                  )}
                </button>
              </form>

              {/* Result Display */}
              {result && (
                <div
                  className={`mt-6 p-6 rounded-lg border-2 ${result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    }`}
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-primary">
                        {result.message}
                      </p>
                      {result.success && (
                        <button
                          onClick={() => navigate('/principal/dashboard')}
                          className="mt-3 text-sm text-accent hover:underline"
                        >
                          ← Return to Dashboard
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                {dataType === 'faculty' ? 'Faculty File Format' : 'Student File Format'}
              </h2>
              <p className="text-body mb-4">
                Your Excel file should have these columns:
              </p>

              {dataType === 'faculty' ? (
                <div className="bg-secondary/10 rounded-lg p-4 space-y-2 text-sm font-mono overflow-x-auto">
                  <div className="grid grid-cols-4 gap-2 font-semibold text-primary min-w-max">
                    <span>Name</span>
                    <span>Subject</span>
                    <span>Qualification</span>
                    <span>Email</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-body min-w-max">
                    <span>John Doe</span>
                    <span>Physics</span>
                    <span>M.Sc., B.Ed</span>
                    <span>john@edu.in</span>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/10 rounded-lg p-4 space-y-2 text-sm font-mono overflow-x-auto">
                  <div className="grid grid-cols-4 gap-2 font-semibold text-primary min-w-max">
                    <span>Name</span>
                    <span>Course</span>
                    <span>Phone</span>
                    <span>Email</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-body min-w-max">
                    <span>Jane Smith</span>
                    <span>Science</span>
                    <span>9876543210</span>
                    <span>jane@email.com</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-accent/10 border border-accent rounded-xl p-6">
              <h3 className="font-semibold text-primary mb-3">📋 Important Notes:</h3>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Column names are case-insensitive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>First row should contain column headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Maximum 5000 records per upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Data is validated before import</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
