function appendOutput(output, text, addPrompt = false) {
    if (addPrompt) {
        output.append(`$ ${text}\n`);
    } else {
        output.append(`${text}\n`);
    }
    output.scrollTop(output.prop("scrollHeight"));
}

 function executeScript(script, output) {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = console.error = function (message) {
        appendOutput(output, message, false);
    };
    const wrappedScript = `(async () => { ${script} })();`;

    try {
        eval(wrappedScript);
    } catch (error) {
        appendOutput(output, `Error: ${error.message} \n script ${script}`, false);
    }

    //console.log = originalConsoleLog;
    //console.error = originalConsoleError;
}

function processServerResponse(data, output) {
    // Extract JavaScript code inside triple backticks, with or without the word "javascript"
    const codeRegex = /```(?:javascript)?\s*([\s\S]*?)\s*```/g;
    const codeMatch = codeRegex.exec(data);

    if (codeMatch) {
       // appendOutput(output, `${data}`, false);
        const scriptContent = codeMatch[1].trim();
        executeScript(scriptContent, output);
    } else {
        appendOutput(output, `${data}`, false);
    }
}
