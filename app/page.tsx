"use client";

import { useState } from "react";
import { FileInput, Label } from "flowbite-react";

export default function Component() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      alert(`File uploaded successfully: ${result.file.filename}`);
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
  };

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="file-upload" value="Upload file" />
      </div>
      <FileInput id="file-upload" onChange={handleFileChange} />
      <button
        onClick={uploadFile}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Upload File
      </button>
    </div>
  );
}
