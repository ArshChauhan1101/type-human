document.addEventListener("DOMContentLoaded", async () => {
    const inputText = document.getElementById("input-text");
    const outputText = document.getElementById("output-text");
    const personaSelect = document.getElementById("persona-select");
    const transformBtn = document.getElementById("transform-btn");
    const copyBtn = document.getElementById("copy-btn");
    
    // Create an "Approve & Replace" button dynamically
    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve & Replace";
    approveBtn.className = "primary-btn";
    approveBtn.style.marginTop = "8px";
    approveBtn.style.backgroundColor = "#34c759"; // Green to distinguish it
    approveBtn.style.display = "none"; // Hidden until we have output
    
    // Insert approve button under the output textarea
    const container = document.querySelector(".container");
    container.insertBefore(approveBtn, copyBtn.nextSibling);

    // 1. Fetch text selection from the active tab automatically on open
    chrome.runtime.sendMessage({ action: "getTextSelection" }, (response) => {
        if (response && response.selectedText) {
            inputText.value = response.selectedText;
        }
    });

    // 2. Transform the text
    transformBtn.addEventListener("click", () => {
        const text = inputText.value;
        const persona = personaSelect.value;

        if (!text.trim()) {
            alert("Please select or paste text to humanize.");
            return;
        }

        chrome.runtime.sendMessage(
            { action: "humanizeText", text, persona },
            (response) => {
                if (response && response.transformedText) {
                    outputText.value = response.transformedText;
                    approveBtn.style.display = "block"; // Show the approval button
                }
            }
        );
    });

    // 3. Replace the selected text on the page when approved
    approveBtn.addEventListener("click", () => {
        const transformed = outputText.value;
        if (!transformed) return;

        chrome.runtime.sendMessage(
            { action: "replaceTextSelection", transformedText: transformed },
            (response) => {
                if (response && response.success) {
                    alert("Text replaced successfully on the page!");
                    window.close(); // Close the extension popup
                }
            }
        );
    });

    copyBtn.addEventListener("click", () => {
        outputText.select();
        document.execCommand("copy");
        alert("Copied to clipboard!");
    });
});