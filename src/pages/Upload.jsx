// pages/dashboard/UploadExam.jsx
import { useState } from "react";
import api from "../api/Auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaFileCsv,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaTrash,
  FaFileAlt,
  FaDatabase,
  FaChartLine,
} from "react-icons/fa";
import { MdAnalytics, MdVerified } from "react-icons/md";
// #32803e #78a372


export default function UploadExam() {
  const { setSelectedExam } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid CSV file");
      setFile(null);
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
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a valid CSV file");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      setError("Please provide exam title and CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/exams/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const exam = {
        _id: res.data.examId,
        title: title,
      };

      setSelectedExam(exam);
      setSuccess("Upload successful! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  const requiredColumns = [
    "candidate_id",
    "candidate_name",
    "score",
    "school",
    "state",
    "centre",
  ];
   if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <Loading />
            <h5 className="text-muted">Loading exams...</h5>
          </div>
        </div>
      );
    }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1
            className="h2 fw-bold mb-0"
            style={{
              color: "#32803e",
             
            }}
          >
            Upload New Exam
          </h1>
          <h4>Nursing and Midwifery Council of Nigeria </h4>

          <p className="text-muted mt-2">
            Upload exam data in CSV format to start analyzing results
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Upload Form */}
        <div className="col-lg-7">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-gradient-success rounded-3 p-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #32803e 0%, #78a372 100%)",
                  }}
                >
                  <FaCloudUploadAlt className="text-white" size={18} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Exam Details</h5>
                  <small className="text-muted">
                    Enter exam information and upload CSV file
                  </small>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center mb-4"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaTimesCircle className="me-2" size={18} />
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success d-flex align-items-center mb-4"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaCheckCircle className="me-2" size={18} />
                  <div>{success}</div>
                </div>
              )}

              <form onSubmit={handleUpload}>
                {/* Exam Title */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FaFileAlt className="me-2" size={14} />
                    Exam Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g., NMCN May 2026 Examination"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    style={{ borderRadius: "0.75rem" }}
                  />
                  <small className="text-muted">
                    Choose a descriptive title for this exam
                  </small>
                </div>

                {/* File Upload Area */}
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
                      border: `2px dashed ${dragActive ? "#32803e" : "#dee2e6"}`,
                      borderRadius: "1rem",
                      backgroundColor: dragActive
                        ? "rgba(13, 110, 253, 0.05)"
                        : "#f8f9fa",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept=".csv"
                      onChange={handleFile}
                      disabled={loading}
                      className="d-none"
                    />

                    {file ? (
                      <div className="text-center p-4">
                        <div
                          className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <FaCheckCircle size={30} className="text-success" />
                        </div>
                        <h6 className="fw-bold mb-1">{file.name}</h6>
                        <p className="text-muted small mb-2">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
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
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-success flex-grow-1"
                    disabled={loading || !title || !file}
                    style={{
                      borderRadius: "0.75rem",
                      padding: "0.75rem",
                      background:
                        "linear-gradient(135deg, #32803e 0%, #78a372 100%)",
                      border: "none",
                    }}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Upload Exam
                      </>
                    )}
                  </button>

                  {(title || file) && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={clearForm}
                      disabled={loading}
                      style={{ borderRadius: "0.75rem" }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="col-lg-5">
          {/* Requirements Card */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <FaInfoCircle className="text-info" size={18} />
                <h5 className="fw-bold mb-0">CSV Requirements</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <p className="small text-muted mb-3">
                Your CSV file must include the following columns:
              </p>
              <div className="vstack gap-2">
                {requiredColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center gap-2 p-2 bg-light rounded-3"
                  >
                    <code className="small flex-grow-1">{col}</code>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill">
                      Required
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <FaChartLine className="text-success" size={18} />
                <h5 className="fw-bold mb-0">CSV Format Tips</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="vstack gap-3">
                <div className="d-flex gap-2">
                  <div className="text-success">✓</div>
                  <small>First row should contain column headers</small>
                </div>
                <div className="d-flex gap-2">
                  <div className="text-success">✓</div>
                  <small>Scores should be numbers between 0-100</small>
                </div>
                <div className="d-flex gap-2">
                  <div className="text-success">✓</div>
                  <small>Avoid empty rows or special characters</small>
                </div>
                <div className="d-flex gap-2">
                  <div className="text-success">✓</div>
                  <small>Maximum file size: 10MB</small>
                </div>
              </div>
            </div>
          </div>

          {/* Example Card */}
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <FaDatabase className="text-warning" size={18} />
                <h5 className="fw-bold mb-0">Example Format</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div
                className="bg-dark rounded-3 p-3"
                style={{ overflowX: "auto" }}
              >
                <pre
                  className="text-light mb-0"
                  style={{ fontSize: "11px", fontFamily: "monospace" }}
                >
                  {`candidate_id,candidate_name,score,school,state,centre
C001,John Doe,85,ABC High School,Lagos,Centre A
C002,Jane Smith,92,DEF Academy,Abuja,Centre B
C003,Michael Lee,67,GHI College,Rivers,Centre A`}
                </pre>
              </div>
              <button
                className="btn btn-sm btn-outline-success mt-3 w-100"
                onClick={() => {
                  // Create and download example CSV
                  const exampleData = `candidate_id,candidate_name,score,school,state,centre\nC001,John Doe,85,ABC High School,Lagos,Centre A\nC002,Jane Smith,92,DEF Academy,Abuja,Centre B\nC003,Michael Lee,67,GHI College,Rivers,Centre A`;
                  const blob = new Blob([exampleData], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "exam_template.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <FaFileCsv className="me-1" size={12} /> Download Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
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
        
        .file-upload-area {
          transition: all 0.3s ease;
        }
        
        .file-upload-area.drag-active {
          border-color: #32803e !important;
          background-color: rgba(13, 110, 253, 0.05) !important;
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          border-color: #32803e;
        }
        
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        code {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
