document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const user = await response.json();
        alert(`Welcome back, ${user.firstName}!`);
        window.location.href = '/public/host/html/dashboard.html'; 
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
});