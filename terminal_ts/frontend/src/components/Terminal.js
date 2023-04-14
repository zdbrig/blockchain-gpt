// import React, { useState } from "react";
// import "./Terminal.css";

// import request from "superagent";

// const Terminal = () => {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState([]);
//   const [apiBaseUrl, setApiBaseURL] = useState("/backend");


//   const getData = (input) => {
//     return new Promise((resolve, reject) => {
//       request
//         .post("/gpt-test")
//         .send({ command: input })
//         .set("Accept", "application/json")
//         .set("Access-Control-Allow-Origin", "*")
//         .end((err, res) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(res);
//           }
//         });
//     });
//   };
//   const _getCryptoCurrencyPrice = async (cryptoName, date) => {
//     cryptoName = cryptoName.toLowerCase();
//     // If no date is specified, use today's date
//     if (!date) {
//       date = new Date().toISOString().slice(0, 10);
//     }

//     // Construct the API URL
//     const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}/history?date=${date}`;

//     // Fetch the data from the API
//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     // If the API returns an error, throw an error
//     if (data.error) {
//       throw new Error(data.error);
//     }

//     // Return the price in USD
//     return data.market_data.current_price.usd;
//   };

//   const _getCurrentCryptoCurrencyPrice = async (cryptoName) => {
//     cryptoName = cryptoName.toLowerCase();
//     // Construct the API URL
//     const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoName}`;

//     // Fetch the data from the API
//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     // If the API returns an error, throw an error
//     if (data.error) {
//       throw new Error(data.error);
      
//     }

//     // Return the current price in USD
//     return data.market_data.current_price.usd;
//   };
//   const processServerResponse = async (data, commandWriter) => {
//     const codeRegex = /```(?:javascript)?\s*([\s\S]*?)\s*```/g;
//     const codeMatch = codeRegex.exec(data);

//     if (codeMatch) {
//       const scriptContent = codeMatch[1].trim();
//       const wrappedScript = `(async () => { ${scriptContent} })();`;

//       try {
//         let capturedOutput;
//         const originalConsoleLog = console.log;
//         console.log = commandWriter;
//         const result = await eval(wrappedScript);
//         return capturedOutput;
//       } catch (error) {
//         return `Error: ${error.message} \n script ${scriptContent}`;
//       }
//     } else {
//       return `${data}\n`;
//     }
//   };
//   const handleInputChange = (event) => {
//     setInput(event.target.value);
//   };

//   const handleInputSubmit = async (event) => {
//     event.preventDefault();
//     hadleOutput(input);
//     if (input.trim().toLowerCase() === "clear") {
//    setOutput([])  
//     setInput("");
//     } else {
//         hadleOutput("Execution in progress ...");
//       try {
//        // await check_login();
//         let result;
//         const res = await getData(input);
//         result = await processServerResponse(res.text, hadleOutput);
//         setInput("");
//       } catch (error) {
//         hadleOutput(`Error: ${error.message}\n`);
//       }
//     }
//   };

//   const hadleOutput = (new_output) => {
//     setOutput([...output, { command: new_output }]);
//   };

//   return (
//     <div className="terminal">
//       <div className="terminal-output">
//         {output.map((line, index) => (
//           <div key={index}>
//             <span className="terminal-prompt">$</span> {line.command}
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleInputSubmit}>
//         <div className="terminal-input-container">
//           <span className="terminal-prompt">$</span>
//           <input
//             type="text"
//             className="terminal-input"
//             value={input}
//             onChange={handleInputChange}
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Terminal;
