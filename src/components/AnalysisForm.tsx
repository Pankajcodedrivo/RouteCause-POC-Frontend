import React, { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import upload from "../assets/images/feather_upload-cloud.svg";
import pdfIcon from "../assets/images/pdf.svg";
import docIcon from "../assets/images/doc.svg";
import txtIcon from "../assets/images/txt.svg";
import cross from "../assets/images/cross.svg";
import excel from "../assets/images/excel.svg"
import imageIcon from "../assets/images/image.svg";
import { showErrorToast } from "../utils/toast/toast";

interface AnalysisFormProps {
  onSubmit: (data: {
    docs: File[];
    images: File[];
    description: string;
  }) => void;
}

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const MAX_FILENAME_LENGTH = 20;

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit }) => {
  const [docs, setDocs] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("");

  const docInputRef = useRef<HTMLInputElement | null>(null);
  const imgInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, type: "doc" | "img") => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const validDocs = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    const validImages = ["image/jpeg", "image/png"];

    const filteredFiles = files.filter((file) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showErrorToast(`${file.name} exceeds ${MAX_SIZE_MB}MB limit.`);
        return false;
      }

      const isValid =
        type === "doc"
          ? validDocs.includes(file.type)
          : validImages.includes(file.type);

      if (!isValid) {
        showErrorToast(`"${file.name}" is not an allowed file type.`);
        return false;
      }

      return true;
    });

    if (type === "doc") {
      if (docs.length + filteredFiles.length > MAX_FILES) {
        showErrorToast(`You can upload a maximum of ${MAX_FILES} document files.`);
        e.target.value = "";
        return;
      }
      setDocs((prev) => [...prev, ...filteredFiles]);
    } else {
      if (images.length + filteredFiles.length > MAX_FILES) {
        showErrorToast(`You can upload a maximum of ${MAX_FILES} image files.`);
        e.target.value = "";
        return;
      }
      setImages((prev) => [...prev, ...filteredFiles]);
    }

    e.target.value = ""; // reset input
  };

  const removeFile = (type: "doc" | "img", index: number) => {
    if (type === "doc") setDocs((prev) => prev.filter((_, i) => i !== index));
    else setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!docs.length) {
      showErrorToast("Please upload at least one document.");
      return;
    }
    if (!description.trim()) {
      showErrorToast("Please enter a description.");
      return;
    }

    onSubmit({ docs, images, description });
  };

  const getFileIcon = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith(".pdf")) return pdfIcon;
    if (lowerName.endsWith(".docx") || lowerName.endsWith(".doc")) return docIcon;
    if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) return excel;
    if (lowerName.endsWith(".txt")) return txtIcon;
    return imageIcon;
  };

  const truncateFileName = (name: string): string => {
    if (name.length <= MAX_FILENAME_LENGTH) return name;
    const parts = name.split(".");
    const ext = parts.pop();
    const base = parts.join(".");
    return `${base.substring(0, MAX_FILENAME_LENGTH - (ext?.length || 0) - 3)}...${ext}`;
  };

  return (
    <div className="card-custom">
      {/* Document Upload */}
      <div className="upload-box mb-20">
        <input
          ref={docInputRef}
          type="file"
          className="input-file"
          accept=".pdf,.docx,.txt,.xlsx"
          multiple
          onChange={(e) => handleFileUpload(e, "doc")}
          hidden
        />
        <span className="upload-icon">
          <img src={upload} alt="upload" />
        </span>
        <h6>Upload Document *</h6>
        <p>
          Upload file in pdf, docx, txt, or xlsx format — up to {MAX_SIZE_MB} MB only
          (max {MAX_FILES} files).
        </p>
        <button
          className="btn btn-primary sm"
          onClick={() => docInputRef.current?.click()}
        >
          Select File
        </button>
      </div>

      {docs.length > 0 && (
        <div className="mb-20">
          {docs.map((file, i) => (
            <p className="upload-txt" key={i}>
              <span>
                <img src={getFileIcon(file.name)} alt="file" />
              </span>
              {truncateFileName(file.name)}
              <em
                onClick={() => removeFile("doc", i)}
                style={{ cursor: "pointer" }}
              >
                <img src={cross} alt="remove" />
              </em>
            </p>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="mb-20">
        <label className="form-label">Description *</label>
        <textarea
          className="form-control"
          placeholder="Enter a short description of the problem..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div className="upload-box flex mb-20">
        <input
          ref={imgInputRef}
          type="file"
          className="input-file"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={(e) => handleFileUpload(e, "img")}
          hidden
        />
        <span className="upload-icon">
          <img src={upload} alt="upload" />
        </span>
        <div>
          <h6>Upload Photo (Optional)</h6>
          <p>
            Upload files in .jpg or .png format — up to {MAX_SIZE_MB} MB only
            (max {MAX_FILES} files).
          </p>
        </div>
        <button
          className="btn btn-primary sm"
          onClick={() => imgInputRef.current?.click()}
        >
          Select File
        </button>
      </div>

      {images.length > 0 && (
        <div className="mb-30">
          {images.map((file, i) => (
            <p className="upload-txt" key={i}>
              <span>
                <img src={imageIcon} alt="image" />
              </span>
              {truncateFileName(file.name)}
              <em
                onClick={() => removeFile("img", i)}
                style={{ cursor: "pointer" }}
              >
                <img src={cross} alt="remove" />
              </em>
            </p>
          ))}
        </div>
      )}

      <div className="text-center">
        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          Generate Root Cause
        </button>
      </div>
    </div>
  );
};

export default AnalysisForm;