import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import { submitAlignmentRequest } from '@components/submission/alignmentSubmission';
import { initializeBackend } from '@components/submission/initializeBackend';
import { logger } from '@components/utils/logger';

const SubmissionButton = ({
  chain,
  input,
  flag,
  params,
  results,
  setResults,
}: {
  chain: 'heavy' | 'light';
  input: string | null;
  flag: 'file' | 'sequence';
  params: any;
  results: any;
  setResults: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backendMessage, setBackendMessage] = useState<string>("");

  useEffect(() => {
    initializeBackend(setBackendMessage);
  }, []);

  const handleSubmit = async () => {
    if (!input) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);
    setBackendMessage("");

    try {
      const submissionData = {
        chain,
        input,
        flag,
        params,
      };

      const response = await submitAlignmentRequest(submissionData, setProgress);
      setResults(response);
      setProgress(0);
    } catch (err) {
      logger.error('Submission Error:', err);
      setError('Failed to process alignment request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="relative pt-8 pb-10 md:pt-12 md:pb-16">
        {loading && (
          <div className="progress-bar-container flex justify-center items-center mb-4">
            <div className="progress-bar bg-gray-200 rounded-full h-2 w-1/3">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        
        {!loading && backendMessage && (
          <div className={`text-center text-sm ${backendMessage.includes("CPU") ? "text-red-500" : "text-green-500"} mb-2`}>
            {backendMessage}
          </div>
        )}

        <div className="flex items-center justify-center">
          {!results ? (
            <button
              type="button"
              id="submitButton"
              className={`text-white ${loading ? 'bg-gray-700' : 'bg-purple-600'} hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-3 text-center me-2 mb-2`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? `Processing... ${progress}%` : 'Submit Alignment'}
            </button>
          ) : (
            <button
              id="resetButton"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => setResults(null)}
            >
              Reset Results
            </button>
          )}
        </div>

        {error && <div className="text-center text-red-600">{error}</div>}

      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Warning"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-lg font-semibold text-red-600">Warning</h2>
        <p>Please provide a sequence or upload a file before submitting.</p>
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </Modal>
    </section>
  );
};

export default SubmissionButton;



// import React, { useState } from 'react';
// import { submitAlignmentRequest } from '@components/submission/alignmentSubmission';
// import Modal from 'react-modal';

// const SubmissionButton = ({
//   chain,
//   input,
//   flag,
//   params,
//   results,
//   setResults,
// }: {
//   chain: 'heavy' | 'light';
//   input: string | null;
//   flag: 'file' | 'sequence';
//   params: any;
//   results: any;
//   setResults: React.Dispatch<React.SetStateAction<any>>;
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleSubmit = async () => {
//     // Check if input is null and show a warning if true
//     if (!input) {
//       setIsModalOpen(true);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResults(null);

//     try {
//       const submissionData = {
//         chain,
//         input,
//         flag,
//         params
//       };
      
//       const response = await submitAlignmentRequest(submissionData);
//       setResults(response);
//     } catch (err) {
//       logger.error('Submission Error:', err);
//       setError('Failed to process alignment request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setResults(null);
//     setError(null);
//   };

//   return (
//     <section>
//       <div className="relative pt-8 pb-10 md:pt-12 md:pb-16">
//         <div className="flex items-center justify-center">
//           {!results ? (
//             <button
//               type="button"
//               id="submitButton"
//               className={`text-white ${loading ? 'bg-gray-700' : 'bg-purple-600'} hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-3 text-center me-2 mb-2`}
//               onClick={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? 'Processing...' : 'Submit Alignment'}
//             </button>
//           ) : (
//             <button
//               id="resetButton"
//               className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
//               onClick={handleReset}
//             >
//               Reset Results
//             </button>
//           )}
//         </div>
//         {results && (
//           <div className="max-w-6xl mx-auto px-4 sm:px-6">
//             <p>Results processed successfully!</p>
//           </div>
//         )}
//       </div>

//       {error && <div className="error text-center text-red-600 font-semibold">{error}</div>}
//       {/* {results && (
//         <div className="results">
//           <h3>Alignment Results</h3>
//           <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-x-auto">{JSON.stringify(results, null, 2)}</pre>
//         </div>
//       )} */}

//       {/* Modal for warning when no input is provided */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//         contentLabel="Warning"
//         className="modal"
//         overlayClassName="modal-overlay"
//       >
//         <h2 className="text-lg font-semibold text-red-600">Warning</h2>
//         <p>Please provide a sequence or upload a file before submitting.</p>
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           Close
//         </button>
//       </Modal>
//     </section>
//   );
// };