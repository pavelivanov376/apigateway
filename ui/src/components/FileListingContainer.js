import React, { useState, useEffect } from "react";
import FileTable from "./FileTable";

export default function FileListContainer() {
  const [content, setContent] = useState([]);
  //TODO: Replace with actual directory ID from routing or props
  //TODO: See how to get current directory ID for curent user root directory
  const [currentDirectoryId, setCurrentDirectoryId] = useState(
    "10000000-0000-0000-0000-000000000001"
  );

  useEffect(() => {
    fetch("http://localhost:80/api/folder/" + currentDirectoryId)
    // fetch("/api/folder/" + currentDirectoryId)
      .then((response) => response.json())
      .then((data) => setContent(data))
      .catch((error) => {
        console.error("Error fetching files:", error);
        //TODO: Remove Fallback data for demonstration purposes
        setContent([
          { id: 1, name: "contract.pdf", size: "1.5 MB", creationDate: "2025-06-25" },
          { id: 2, name: "invoice.xlsx", size: "430 KB", creationDate: "2025-06-24" },
          { id: 3, name: "present.pptx", size: "3.1 MB", creationDate: "2025-06-23" },
          { id: 3, name: "present.pptx", size: "3.1 MB", creationDate: "2025-06-23" },
        ]);
      });
  }, []);

  return <FileTable files={content} />;
}
