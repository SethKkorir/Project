// Function to validate form data
function validateVisitorData(data) {
    const requiredFields = ['name', 'email', 'purposeOfVisiting', 'hostId'];

    for (const field of requiredFields) {
        if (!data[field]) {
            throw new Error(`${field} is required!!!`);
        }
    }

    // Validate email format


    // Validate name to ensure it only contains alphabetic characters
    if (!isNameValid(data.name)) {
        throw new Error('Name must contain only alphabetic characters!');
        alert('Name must contain only alphabetic characters!');
    }
    if (!isEmailValid(data.email)) {
        throw new Error('Invalid email format!');
    }
}

// Function to validate email format
function isEmailValid(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    return emailPattern.test(email);
}

// Function to validate names (alphabetic characters only)
function isNameValid(name) {
    const namePattern = /^[a-zA-Z\s]+$/; // Allows letters and spaces
    return namePattern.test(name);
}

// Function to show confirmation dialog
function showConfirmationDialog(data) {
    const confirmationMessage = `
      Please confirm your details:
      Name: ${data.name}
      Email: ${data.email}
      Purpose of visiting: ${data.purposeOfVisiting}
    `;

    return confirm(confirmationMessage); // Returns true if confirmed, false otherwise
}

// Function to handle form submission
const continueBtn = document.getElementById('continueBtn');
continueBtn.addEventListener('click', async (event) => {
    try {
        event.preventDefault();

        // Get form data
        const formData = new FormData(document.getElementById('userForm'));
        const data = Object.fromEntries(formData.entries());

        // Validate form data
        validateVisitorData(data);

        // Show confirmation dialog
        if (showConfirmationDialog(data)) {
            // Prepare data as JSON
            const jsonData = JSON.stringify(data);

            // Send data to server using fetch with Content-Type header
            const response = await fetch('http://localhost:8002/api/users', {
                method: 'POST',
                body: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                console.log('User created:', user);
                alert('Welcome! Thank you for registering. We are excited to have you here. You can now proceed.');
                sessionStorage.setItem('visitorName', user.name);
                sessionStorage.setItem('hostId', user.hostId);
                window.location.href = `/public/visitors/html/verify.html`;
            } else {
                const errorData = await response.json();
                console.error('Error creating user:', errorData);
                alert(`Error: ${errorData.error || 'An error occurred while creating the user.'}`);
            }
        } else {
            alert('Form submission canceled.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message); // Display error message to the user
    }
});

// Function to fetch hosts
async function fetchHosts() {
    try {
        const response = await fetch('http://localhost:8002/api/users2');
        const hosts = await response.json(); // Convert the response from JSON to JavaScript array
        const hostSelect = document.getElementById('host');

        // Loop through each host in the hosts array
        hosts.forEach(host => {
            const option = document.createElement('option'); // Create a new option element
            option.value = host._id; // Set the value of the option to the host's unique ID (host._id)
            option.textContent = `${host.firstName} ${host.lastName} - ${host.role}`; // Display full name and role
            hostSelect.appendChild(option); // Append the new option to the dropdown menu
        });
    } catch (error) {
        console.error('Error fetching hosts:', error);
    }
}

// Call the function to fetch hosts on page load
window.onload = fetchHosts;

// Function to handle "Back" button click
function goBack() {
    alert('Going back!');
    window.history.back();
    // Add logic to handle going back (optional)
}