document.addEventListener("DOMContentLoaded", function() {
    var highlights = document.querySelectorAll(".highlight");

    highlights.forEach(function(highlight) {
        // Create the copy button
        var button = document.createElement("button");
        button.className = "copy-code-btn";
        button.innerText = "Copy";
        highlight.appendChild(button);

        // Add the click event to copy text to clipboard
        button.addEventListener("click", function() {
            // If it's a Chroma table layout, the code is in the last td
            var codeContainer = highlight.querySelector("td.lntd:last-child pre code");

            // If not a table, fallback to standard pre > code
            if (!codeContainer) {
                codeContainer = highlight.querySelector("pre code") || highlight.querySelector("pre");
            }

            var textToCopy = codeContainer ? codeContainer.innerText : highlight.innerText;

            navigator.clipboard.writeText(textToCopy).then(
                function() {
                    button.innerText = "Copied!";
                    setTimeout(function() {
                        button.innerText = "Copy";
                    }, 2000);
                },
                function(err) {
                    console.error("Failed to copy text: ", err);
                    button.innerText = "Error";
                }
            );
        });
    });
});
