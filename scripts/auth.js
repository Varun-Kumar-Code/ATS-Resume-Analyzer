document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Add authentication logic here (e.g., Firebase or custom backend)
    alert('Login functionality to be implemented.');
  });
  
  document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Add signup logic here (e.g., Firebase or custom backend)
    alert('Signup functionality to be implemented.');
  });