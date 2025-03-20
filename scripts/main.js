document.getElementById('analyze-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('resume-upload');
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      // Replace with your AI API endpoint and key
      const apiKey = 'YOUR_AI_API_KEY';
      fetch('https://api.example.com/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          document.getElementById('results').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      alert('Please upload a resume file.');
    }
  });