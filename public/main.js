$(document).ready(function () {
    const input = $("#input");
    const output = $("#output");
    let executing = false;

    input.on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!executing) {
                executing = true;
                const command = input.val();
                input.val("");

                if (command.toLowerCase() === "clear") {
                    output.html("");
                    executing = false;
                } else {
                    appendOutput(output, "Execution in progress...", false);
                    input.prop("disabled", true);

                    $.ajax({
                        url: "/execute-command",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({ command: command }),
                    })
                        .done(function (data) {
                            output.html(output.html().replace("Execution in progress...\n", ""));
                            appendOutput(output, `${command}`, true);
                            processServerResponse(data, output);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            output.html(output.html().replace("Execution in progress...\n", ""));
                            appendOutput(output, `${command}\nError: ${errorThrown}`, true);
                        })
                        .always(function () {
                            input.prop("disabled", false);
                            executing = false;
                        });
                }
            }
        } else if (e.key === "c" && e.ctrlKey) {
            if (executing) {
                appendOutput(output, "Execution interrupted", false);
                input.prop("disabled", false);
                executing = false;
            }
        }
    });
});
