// components/ExamModal.jsx
import { useState, useEffect } from "react";
import api from "../api/Auth";
import {
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaFileCsv,
  FaUpload,
  FaArrowLeft,
  FaDatabase,
  FaCalendarAlt,
  FaChartLine,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";
import { MdAnalytics, MdVerified } from "react-icons/md";

export default function ExamModal({ show, onExamSelected, onClose }) {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch existing exams when modal opens
  useEffect(() => {
    if (show) {
      fetchExams();
    }
  }, [show]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/exams");

      let examsList = [];
      if (res.data.exams && Array.isArray(res.data.exams)) {
        examsList = res.data.exams;
      } else if (Array.isArray(res.data)) {
        examsList = res.data;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        examsList = res.data.data;
      }

      const validExams = examsList.filter((exam) => exam && exam._id);
      setExams(validExams);

      if (validExams.length > 0 && !selectedExam) {
        setSelectedExam(validExams[0]._id);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      setError("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowUpload(false);
    setError(null);
    setExamTitle("");
    setCsvFile(null);
    setSelectedExam("");
  };

  const handleSelectExam = () => {
    if (!selectedExam) {
      setError("Please select an exam");
      return;
    }

    const exam = exams.find((e) => e._id === selectedExam);

    if (!exam || !exam._id) {
      setError("Invalid exam selected");
      return;
    }

    const examToPass = {
      _id: exam._id.toString(),
      title: exam.title || "Untitled Exam",
      createdAt: exam.createdAt || new Date().toISOString(),
    };

    onExamSelected(examToPass);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setError(null);
    } else if (file) {
      setError("Please select a valid CSV file");
      setCsvFile(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setCsvFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a valid CSV file");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!examTitle.trim()) {
      setError("Please enter an exam title");
      return;
    }

    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("title", examTitle.trim());
    formData.append("file", csvFile);

    try {
      setUploading(true);
      setError(null);

      const res = await api.post("/exams/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchExams();

      const examId = res.data.examId || res.data.exam?._id;

      if (!examId) {
        setError("Upload succeeded but exam ID not received");
        return;
      }

      const newExam = {
        _id: examId,
        title: examTitle.trim(),
        createdAt: new Date().toISOString(),
      };

      setExamTitle("");
      setCsvFile(null);
      setShowUpload(false);

      onExamSelected(newExam);
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid date";
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-container animate-slide-up">
        {/* Modal Header */}
        <div className="modal-header bg-gradient-primary">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-white bg-opacity-20 rounded-3 p-2">
              {!showUpload ? (
                <MdAnalytics className="text-white" size={20} />
              ) : (
                <FaCloudUploadAlt className="text-white" size={20} />
              )}
            </div>
            <div>
              <h5 className="modal-title text-white fw-bold mb-0">
                {!showUpload ? "Select Examination" : "Upload New Examination"}
              </h5>
              <small className="text-white-50">
                {!showUpload
                  ? "Choose an exam to view analytics dashboard"
                  : "Upload CSV file with exam results"}
              </small>
            </div>
          </div>
          <button
            className="btn btn-link text-white p-0"
            onClick={onClose}
            onClick={() => onClose && onClose()}
            style={{ textDecoration: "none" }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="modal-body"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center mb-4"
              style={{ borderRadius: "0.75rem" }}
            >
              <FaTimes className="me-2" size={14} />
              <div className="flex-grow-1">{error}</div>
              <button
                className="btn btn-link text-danger p-0"
                onClick={() => setError(null)}
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          {!showUpload ? (
            // SELECT EXISTING EXAM VIEW
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Available Exams</h6>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                  {exams.length} Exams
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <FaSpinner
                    className="fa-spin mb-3"
                    size={40}
                    style={{ color: "#667eea" }}
                  />
                  <p className="text-muted mb-0">Loading exams...</p>
                </div>
              ) : exams.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <FaDatabase size={30} className="text-muted opacity-50" />
                  </div>
                  <h6 className="fw-bold mb-1">No Exams Found</h6>
                  <p className="text-muted small mb-3">
                    Click "Upload New Exam" to get started
                  </p>
                </div>
              ) : (
                <div className="vstack gap-2 mb-4">
                  {exams.map((exam) => (
                    <div
                      key={exam._id}
                      className={`exam-card p-3 rounded-3 transition-all ${selectedExam === exam._id ? "selected" : "bg-light"}`}
                      style={{
                        cursor: "pointer",
                        border:
                          selectedExam === exam._id
                            ? "2px solid #667eea"
                            : "1px solid transparent",
                        backgroundColor:
                          selectedExam === exam._id
                            ? "rgba(102, 126, 234, 0.05)"
                            : "#f8f9fa",
                      }}
                      onClick={() => setSelectedExam(exam._id)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-3 flex-grow-1">
                          <div className="form-check mt-1">
                            <input
                              type="radio"
                              name="exam"
                              id={exam._id}
                              value={exam._id}
                              checked={selectedExam === exam._id}
                              onChange={() => setSelectedExam(exam._id)}
                              className="form-check-input"
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <label
                              htmlFor={exam._id}
                              style={{ cursor: "pointer" }}
                              className="d-block"
                            >
                              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <span className="fw-bold">
                                  {exam.title || exam.name || "Untitled"}
                                </span>
                                <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill">
                                  {exam.resultCount || 0} results
                                </span>
                              </div>
                              <div className="d-flex gap-3 mt-1">
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <FaCalendarAlt size={10} />{" "}
                                  {formatDate(exam.createdAt)}
                                </small>
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <FaInfoCircle size={10} /> ID:{" "}
                                  {exam._id.slice(-8)}
                                </small>
                              </div>
                            </label>
                          </div>
                        </div>
                        {selectedExam === exam._id && (
                          <FaCheckCircle className="text-primary" size={18} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <hr />

              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-primary flex-grow-1"
                  onClick={() => setShowUpload(true)}
                  disabled={loading}
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaUpload className="me-2" size={14} />
                  Upload New Exam
                </button>
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={handleSelectExam}
                  disabled={!selectedExam || loading}
                  style={{
                    borderRadius: "0.75rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  Continue
                  <FaArrowLeft
                    className="ms-2"
                    style={{ transform: "rotate(180deg)" }}
                    size={14}
                  />
                </button>
              </div>
            </div>
          ) : (
            // UPLOAD NEW EXAM VIEW
            <div>
              <button
                className="btn btn-link text-muted p-0 mb-3"
                onClick={() => {
                  setShowUpload(false);
                  setError(null);
                  setExamTitle("");
                  setCsvFile(null);
                }}
                style={{ textDecoration: "none", fontSize: "0.9rem" }}
              >
                <FaArrowLeft className="me-1" size={12} /> Back to Exams
              </button>

              <form onSubmit={handleUpload}>
                {/* Exam Title */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Exam Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g., NCLEX RN January 2024"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    disabled={uploading}
                    style={{ borderRadius: "0.75rem" }}
                  />
                  <small className="text-muted">
                    Give your exam a descriptive title
                  </small>
                </div>

                {/* CSV Upload Area */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FaFileCsv className="me-2" size={14} />
                    CSV File <span className="text-danger">*</span>
                  </label>

                  <div
                    className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      border: `2px dashed ${dragActive ? "#667eea" : "#dee2e6"}`,
                      borderRadius: "1rem",
                      backgroundColor: dragActive
                        ? "rgba(102, 126, 234, 0.05)"
                        : "#f8f9fa",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      document.getElementById("modalFileInput").click()
                    }
                  >
                    <input
                      id="modalFileInput"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="d-none"
                    />

                    {csvFile ? (
                      <div className="text-center p-4">
                        <div
                          className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <FaCheckCircle size={30} className="text-success" />
                        </div>
                        <h6 className="fw-bold mb-1">{csvFile.name}</h6>
                        <p className="text-muted small mb-2">
                          {(csvFile.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCsvFile(null);
                          }}
                          style={{ borderRadius: "0.5rem" }}
                        >
                          <FaTrash className="me-1" size={12} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-5">
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <FaCloudUploadAlt size={35} className="text-muted" />
                        </div>
                        <h6 className="fw-bold mb-2">
                          Drop your CSV file here
                        </h6>
                        <p className="text-muted small mb-2">
                          or click to browse
                        </p>
                        <small className="text-muted">
                          Supported format: .csv
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 p-2 bg-light rounded-3">
                    <small className="text-muted d-flex align-items-center gap-2">
                      <FaInfoCircle size={12} />
                      CSV must contain columns: candidate_name, score, school,
                      state, centre
                    </small>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={() => {
                      setShowUpload(false);
                      setError(null);
                      setExamTitle("");
                      setCsvFile(null);
                    }}
                    disabled={uploading}
                    style={{ borderRadius: "0.75rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success flex-grow-1"
                    disabled={uploading || !examTitle || !csvFile}
                    style={{
                      borderRadius: "0.75rem",
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      border: "none",
                    }}
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Upload & Continue
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer bg-light">
          <small className="text-muted">
            {!showUpload
              ? "Select an exam to view analytics dashboard"
              : "Upload CSV file with exam results to get started"}
          </small>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: white;
          border-radius: 1.5rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          padding: 1.5rem;
          flex: 1;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .bg-white-20 {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .exam-card {
          transition: all 0.3s ease;
        }

        .exam-card:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .file-upload-area {
          transition: all 0.3s ease;
        }

        .file-upload-area.drag-active {
          border-color: #667eea !important;
          background-color: rgba(102, 126, 234, 0.05) !important;
        }

        .form-control:focus,
        .form-select:focus,
        .form-check-input:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
