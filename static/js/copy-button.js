document.addEventListener("DOMContentLoaded", function() {
    // Find all <pre> tags (which contain the code blocks)
    var preElements = document.querySelectorAll("pre");

    preElements.forEach(function(pre) {
        // Create a wrapper div to accurately position the absolute button
        var wrapper = document.createElement("div");
        wrapper.className = "copy-code-wrapper";

        // Insert the wrapper before the <pre> tag, then move the <pre> inside it
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Create the copy button
        var button = document.createElement("button");
        button.className = "copy-code-btn";
        button.innerText = "Copy";
        wrapper.appendChild(button);

        // Add the click event to copy text to clipboard
        button.addEventListener("click", function() {
            // Find the <code> tag inside the <pre> tag, or fallback to <pre> itself
            var code = pre.querySelector("code");
            var textToCopy = code ? code.innerText : pre.innerText;

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
