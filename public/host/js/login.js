document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const firstName = document.querySelector('input[name="firstName"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        const response = await fetch('http://localhost:8002/api/users2/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        console.log('Login successful:', data);
        alert(`Welcome ${data.firstName}, You can now check your visitors.`);
        window.location.href = '/public/host/html/dashboard.html'; // Adjust path if needed
    
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed: ' + error.message); // Display error message to the user
    }
});
