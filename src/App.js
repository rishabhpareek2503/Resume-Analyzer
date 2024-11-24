import React, { useState, useEffect } from 'react';  // Import useEffect
import { FaMoon, FaSun } from 'react-icons/fa';
import FileUpload from './components/FileUpload';
import analyzeResume from './components/analyzeResume';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toast';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  const taglines = [
    'Tailor Your Career Path with Precision.',
    'Decode the Job Market, Step by Step.',
    'Your First Step Towards the Dream Job.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  

  const handleFilesUploaded = (uploadedFiles) => {
    setFiles(uploadedFiles);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const startAnalysis = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description!');
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one resume!');
      return;
    }

    setAnalyzing(true);
    setLoading(true);
    setResults([]);

    try {
      const analysisResults = await Promise.all(
        files.map(async (file) => {
          const analysis = await analyzeResume(file.text, jobDescription);
          return { name: file.name, ...analysis };
        })
      );
      setResults(analysisResults);
      toast.success('Resume analysis completed successfully!');
    } catch (error) {
      console.error('Error analyzing resumes:', error);
      toast.error('Failed to analyze resumes.');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const downloadReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      // Page border
      const margin = 10;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const borderThickness = 1;

      // Outer border (thicker)
      doc.setDrawColor(0);
      doc.setLineWidth(borderThickness);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      // Title section with background color
      doc.setFillColor(63, 81, 181); // Blue for the title section
      doc.rect(margin + 5, margin + 5, pageWidth - 2 * (margin + 5), 20, 'FD'); // Title background
      doc.setTextColor(255, 255, 255); // White text color
      doc.setFontSize(16);
      doc.text('Resume Analysis Report', pageWidth / 2, margin + 15, { align: 'center' });

      // Section title
      doc.setTextColor(0, 0, 0); // Reset to black for content
      doc.setFontSize(14);
      doc.text('Resume Analysis Results', margin + 10, 40);

      let yPosition = 50;

      results.forEach((result, index) => {
        // Resume Name
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. Resume: ${result.name}`, margin + 10, yPosition);
        yPosition += 10;

        // Score
        doc.setFont('helvetica', 'normal');
        doc.text(`Score: ${result.score}`, margin + 10, yPosition);
        yPosition += 10;

        // Feedback
        doc.setFont('helvetica', 'normal');
        doc.text(`Feedback:`, margin + 10, yPosition);
        yPosition += 8;
        doc.setFontSize(10);
        const feedbackText = result.feedback;
        const splitFeedback = doc.splitTextToSize(feedbackText, pageWidth - 2 * (margin + 10)); // Wrap the text properly
        doc.text(splitFeedback, margin + 10, yPosition);
        yPosition += splitFeedback.length * 5; // Adjust yPosition based on text length

        // Add spacing between resumes
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
      });

      // Save the document
      doc.save('resume_analysis_report.pdf');
    } catch (error) {
      console.error('Error generating the PDF:', error);
      toast.error('Failed to generate the report.');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    toast.info(`Switched to ${darkMode ? 'Light' : 'Dark'} Mode`); // Info notification
  };

  const getScoreColor = (score) => {
    if (score < 40) return 'bg-red-500 text-white';
    if (score < 70) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const renderScoreCircle = (score) => {
    const getLabel = () => {
      if (score < 40) return 'Low';
      if (score < 70) return 'Medium';
      if (score < 90) return 'High';
      return 'Excellent';
    };

    const getCircleColor = () => {
      if (score < 40) return 'bg-red-500';
      if (score < 70) return 'bg-yellow-500';
      if (score < 90) return 'bg-green-500';
      return 'bg-blue-500';
    };

    return (
      <div className="flex justify-center items-center mt-4">
        <div className={`w-40 h-40 border-8 ${getCircleColor()} rounded-full flex justify-center items-center`}>
          <p className="text-white text-4xl font-semibold">{score}%</p>
        </div>
        <p className="mt-2 text-sm font-medium">{getLabel()}</p>
      </div>
    );
  };

  const renderProgressBar = (score) => {
    const getLabel = () => {
      if (score < 40) return 'Low';
      if (score < 70) return 'Medium';
      if (score < 90) return 'High';
      return 'Excellent';
    };

    const getBarColor = () => {
      if (score < 40) return 'bg-red-500';
      if (score < 70) return 'bg-yellow-500';
      if (score < 90) return 'bg-green-500';
      return 'bg-blue-500';
    };

    return (
      <div className="mt-4">
        <div className="relative w-full h-6 bg-gray-300 rounded-lg overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full ${getBarColor()}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-sm font-medium mt-2">{getLabel()}</p>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-all`}>
      <header className="py-6 px-8 text-white shadow-md" style={{ backgroundColor: '#D3D3D3' }}>

        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Resume Analyzer</h1>
          <button
            onClick={toggleTheme}
            className="text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2"
            style={{ backgroundColor: '#4A90E2', hover: { backgroundColor: '#357ABD' } }}

          >
            {darkMode ? (
              <>
                <FaSun /> <span></span>
              </>
            ) : (
              <>
                <FaMoon /> <span></span>
              </>
            )}
          </button>
        </div>
      </header>
      <main className="container mx-auto px-8 py-12">
        {/* Flashing Taglines Section */}
        <section className="w-full text-gray-500 rounded-lg p-6 mb-6">
        <div className="text-4xl font-bold text-center">{taglines[currentTaglineIndex]}</div>
        </section>

      <main className="container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Upload Resumes</h2>
          <FileUpload onFilesUploaded={handleFilesUploaded} />
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter the job description here..."
          />
        </section>

        <div className="col-span-1 md:col-span-2 text-center">
          {!analyzing && (
            <button
              onClick={startAnalysis}
              className="mt-4 text-white py-2 px-6 rounded-lg font-medium"
              style={{ backgroundColor: '#4A90E2', hover: { backgroundColor: '#357ABD' } }}


            >
              Analyze Resumes
            </button>
          )}
        </div>

        {loading && (
          <div className="col-span-1 md:col-span-2 text-center">
            <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl font-medium">Analyzing Resumes...</p>
          </div>
        )}

        {results.length > 0 && !loading && (
          <section className="mt-8 col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold  mb-4">Analysis Results</h3>
            {results.map((result, index) => (
              <div key={index} className="mb-6">
                {renderScoreCircle(result.score)}
                {renderProgressBar(result.score)}
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Feedback:</h4>
                  <ul className="list-disc pl-5">
                    {result.feedback.split('\n').map((line, idx) => (
                      <li key={idx} className="text-sm">{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="mt-6 text-center">
              <button
                onClick={downloadReport}
                className="text-white py-2 px-6 rounded-lg font-medium"
                style={{ backgroundColor: '#4A90E2', hover: { backgroundColor: '#357ABD' } }}



              >
                Download Report
              </button>
            </div>
          </section>
        )}
      </main>

      <ToastContainer />
    </main>
    </div>
  );
};

export default App;
