import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Certificate() {
  const navigate = useNavigate();
  const location = useLocation();
  const certData = location.state?.certificate; // Passed via state
  
  if (!certData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-xl text-gray-500 mb-4">Certificate not found.</p>
        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 underline">Return to Dashboard</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert("Certificate link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      
      {/* Controls Container - Hide on Print */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-indigo-600 font-bold"
        >
          &larr; Back to Dashboard
        </button>
        <div className="flex space-x-4">
          <button 
            onClick={handleShare}
            className="bg-white border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition"
          >
            Share
          </button>
          <button 
            onClick={handlePrint}
            className="bg-indigo-600 text-white font-bold px-6 py-2 rounded shadow-md hover:bg-indigo-700 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Download / Print
          </button>
        </div>
      </div>

      {/* Certificate Canvas */}
      <div className="bg-white w-full max-w-4xl shadow-2xl rounded-sm p-12 border-[16px] border-double border-indigo-900 relative print:shadow-none print:border-[8px]">
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Logo Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-widest uppercase">Lakshya Academy</h1>
            <p className="text-sm font-bold text-indigo-600 tracking-widest">Open Challenge Exam Platform</p>
          </div>

          <h2 className="text-5xl font-serif text-indigo-900 mb-8 mt-4 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            Certificate of Achievement
          </h2>

          <p className="text-lg text-gray-600 mb-4 italic">This certificate is proudly presented to</p>
          
          <h3 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-200 pb-2 inline-block px-12">
            {certData.studentName || 'Student Name'}
          </h3>

          <p className="text-xl text-gray-700 max-w-2xl leading-relaxed mb-10">
            For outstanding performance and successfully completing <br/>
            <span className="font-bold text-indigo-600 text-2xl">{certData.completedLevels.length} Challenge Levels</span> 
            <br/> with a cumulative average score of <span className="font-bold text-indigo-600">{certData.score.toFixed(2)}%</span>.
          </p>

          <div className="flex w-full justify-between items-end px-12 mt-12">
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-gray-400 mb-2"></div>
              <p className="text-gray-500 font-bold uppercase text-sm">Issued Date</p>
              <p className="text-gray-900 font-medium">{new Date(certData.issuedDate).toLocaleDateString()}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full border-2 border-yellow-400 flex items-center justify-center shadow-inner">
                <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-gray-400 mb-2"></div>
              <p className="text-gray-500 font-bold uppercase text-sm">Certificate ID</p>
              <p className="text-gray-900 font-medium font-mono">{certData.certificateId}</p>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
