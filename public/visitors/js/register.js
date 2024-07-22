// Function to validate form data
function validateVisitorData(data) {
    const requiredFields = ['name', 'email', 'whoAreYouVisiting', 'purposeOfVisiting'];
  
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new Error(`Validation failed: ${field} is required.`);
        }
    }
  }
  
  // Function to show confirmation dialog
  function showConfirmationDialog(data) {
    const confirmationMessage = `
      Please confirm your details:
      Name: ${data.name}
      Email: ${data.email}
      Who are you visiting: ${data.whoAreYouVisiting}
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
            const response = await fetch('http://localhost:8003/api/users', {
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
            
            } else {
                const errorData = await response.json();
                console.error('Error creating user:', errorData);
                alert(`Error: ${errorData}`);
            }
        } else {
            alert('Form submission canceled.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message); // Display error message to the user
    }
  });
  
  // Function to handle "Back" button click
  function goBack() {
    alert('Going back!');
    window.history.back();
    // Add logic to handle going back (optional)
  }
  