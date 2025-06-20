import React from "react";
import { ShellBar, Button } from "@ui5/webcomponents-react";

function App() {
  return (
    <div>
      <ShellBar
        primaryTitle="My Gateway UI"
        showCoPilot
        showNotifications
        showSearchField
      />
      <div style={{ padding: "2rem" }}>
        <Button onClick={() => alert("Hello from UI!! 1
        ")}>Click Me</Button>
      </div>
    </div>
  );
}

export default App;
