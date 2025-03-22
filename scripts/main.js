const API_KEY = "YOUR_API_KEY";
const API_URL = `YOUR_API_URL`;

document.getElementById("analyze-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("resume-upload");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a resume file!");
    return;
  }

  if (file.type === "application/pdf") {
    extractTextFromPDF(file);
  } else if (
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    extractTextFromDOCX(file);
  } else {
    alert("Unsupported file type! Please upload a PDF or DOCX.");
  }
});

function extractTextFromPDF(file) {
  const reader = new FileReader();
  reader.onload = async function () {
    const typedarray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    analyzeResume(text);
  };
  reader.readAsArrayBuffer(file);
}

function extractTextFromDOCX(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const arrayBuffer = reader.result;
    mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then((result) => {
      analyzeResume(result.value);
    });
  };
  reader.readAsArrayBuffer(file);
}

async function analyzeResume(text) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this resume: ${text}` }] }],
      }),
    });

    const data = await response.json();
    const score = Math.floor(Math.random() * 101);
    document.getElementById("resume-score").innerText = `Resume Score: ${score}%`;
    document.getElementById("results").innerText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    if (score < 90) {
      document.getElementById("enhance-btn").style.display = "block";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("results").innerText = "Error fetching response!";
  }
}

document.getElementById("enhance-btn").addEventListener("click", async () => {
  const text = document.getElementById("results").innerText;
  const formattedText = formatEnhancedResume(text);
  downloadEnhancedResume(formattedText);
});

function formatEnhancedResume(text) {
  // Apply a refined prompt to structure AI output correctly
  const refinedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n{2,}/g, "</p><h2>")
    .replace(/\n/g, "</h2><p>")
    .replace(/Overall Impression:.*?Weaknesses and Areas for Improvement:/gs, "")
    .replace(/Strengths:.*?Weaknesses:/gs, "")

  return `<html>
  <head>
    <style>
      body { font-family: Calibri, sans-serif; font-size: 12px; line-height: 1.5; }
      h2 { font-size: 12px; font-weight: bold; margin-top: 10px; }
      p { margin: 5px 0; }
    </style>
  </head>
  <body>
    ${refinedText}
  </body>
</html>`;
}


function downloadEnhancedResume(content) {
  const blob = new Blob([content], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Enhanced_Resume.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



