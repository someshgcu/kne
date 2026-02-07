import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ArrowLeft, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    year: string;
    passRate: number;
    distinctionRate: number;
    totalStudents: number;
  };
}

export function DataUpload() {
  // NOTE: Auth is handled by ProtectedRoute wrapper in App.tsx
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx')) {
        toast.error('Please select a valid Excel file (.xlsx)');
        return;
      }

      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);

    // Simulate file processing (in production, this would upload to backend)
    setTimeout(() => {
      // Mock successful processing
      const mockResult: UploadResult = {
        success: true,
        message: 'Data uploaded and processed successfully!',
        data: {
          year: '2026',
          passRate: 99.2,
          distinctionRate: 87.5,
          totalStudents: 465
        }
      };

      setResult(mockResult);
      setIsUploading(false);
      toast.success('Data processed successfully!');
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = {
        target: { files: [droppedFile] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen bg-secondary/10">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-6" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Data Upload</h1>
              <p className="text-sm text-primary-foreground/80">
                Upload Excel data for Impact Engine
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
                  <p className="text-sm text-body">Student performance data</p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* File Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors hover:border-accent hover:bg-accent/5 cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="size-12 text-muted mx-auto mb-4" aria-hidden="true" />
                  <p className="text-body mb-2">
                    {file ? file.name : 'Drag and drop your Excel file here'}
                  </p>
                  <p className="text-sm text-muted">
                    or click to browse
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls"
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
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="size-5" aria-hidden="true" />
                      Upload & Process
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
                      <p className="font-semibold text-primary mb-2">
                        {result.message}
                      </p>
                      {result.data && (
                        <div className="space-y-1 text-sm text-body">
                          <p>Year: {result.data.year}</p>
                          <p>Pass Rate: {result.data.passRate}%</p>
                          <p>Distinction Rate: {result.data.distinctionRate}%</p>
                          <p>Total Students: {result.data.totalStudents}</p>
                        </div>
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
                Excel File Format
              </h2>
              <p className="text-body mb-4">
                Your Excel file should contain the following columns:
              </p>
              <div className="bg-secondary/10 rounded-lg p-4 space-y-2 text-sm font-mono">
                <div className="grid grid-cols-4 gap-2 font-semibold text-primary">
                  <span>Year</span>
                  <span>Stream</span>
                  <span>Student_ID</span>
                  <span>Result</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-body">
                  <span>2026</span>
                  <span>Science</span>
                  <span>S001</span>
                  <span>Pass</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-body">
                  <span>2026</span>
                  <span>Commerce</span>
                  <span>C001</span>
                  <span>Distinction</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent rounded-xl p-6">
              <h3 className="font-semibold text-primary mb-3">📋 Important Notes:</h3>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>File must be in .xlsx format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Column headers should match exactly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Result values: Pass, Fail, Distinction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Data will update the Impact Engine graphs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Maximum file size: 10MB</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Contact the technical team if you encounter any issues with data upload or processing.
              </p>
              <a
                href="mailto:tech@incpuc.edu.in"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium text-sm"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
