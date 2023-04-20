// App.tsx
import React, { useState } from "react";
import ChartComponent from "./ChartComponent";

const Charts: React.FC = () => {
    const [coinName, setCoinName] = useState<string>("");
    const [submittedCoinName, setSubmittedCoinName] = useState<string>("");
  
    const handleSubmit = () => {
      setSubmittedCoinName(coinName);
    };
  
    return (
      <div>
        <input
          type="text"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
          placeholder="Enter coin name"
        />
        <button onClick={handleSubmit}>Submit</button>
        <ChartComponent coinName={submittedCoinName} />
      </div>
    );
  };

export default Charts;
