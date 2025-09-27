import React, { useState, useEffect } from "react";
import FileTable from "./FileTable";

export default function FileListingContainer() {
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
      });
  }, []);

  return <FileTable files={content} />;
}
