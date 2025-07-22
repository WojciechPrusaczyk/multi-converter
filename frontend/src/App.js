import React, { useState, useEffect } from "react";
import axios from "axios";
import FileDropzone from "./components/FileDropzone";
import ProgressBar from "./components/ProgressBar";
import FormatSelector from "./components/FormatSelector";
import "./styles.css";

function App() {
  const [fileType, setFileType] = useState("image");
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    axios.get(`/formats?type=${fileType}`).then((res) => {
      setFormats(res.data);
      setSelectedFormat(res.data[0] || "");
    });
  }, [fileType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);
    formData.append("format", selectedFormat);

    const res = await axios.post("/convert", formData, {
      responseType: "blob",
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      },
    });

    setProgress(100);

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${selectedFormat}`;
    a.click();

    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 1500);
  };

  return (
    <div className="app-container">
      <div className="converter-card">
        <h1 className="title">Multikonwerter</h1>

        <div className="type-selector">
          <label>Rodzaj pliku</label>
          <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
            <option value="image">Obraz</option>
            <option value="video">Wideo</option>
          </select>
        </div>

        <FormatSelector
          formats={formats}
          selected={selectedFormat}
          onChange={setSelectedFormat}
        />

        <FileDropzone file={file} setFile={setFile} />

        {loading && <ProgressBar progress={progress} />}

        <button className="convert-btn" onClick={handleSubmit} disabled={loading || !file}>
          {loading ? "Konwertowanie..." : "Konwertuj"}
        </button>
      </div>
    </div>
  );
}

export default App;