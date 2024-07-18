// Function to validate form data
function validateVisitorData(data) {
  const requiredFields = ['name', 'email', 'whoAreYouVisiting', 'purposeOfVisiting'];

  for (const field of requiredFields) {
      if (!data[field]) {
          throw new Error(`Validation failed: ${field} is required.`);
      }
  }
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

      // Prepare data as JSON
      const jsonData = JSON.stringify(data);

      // Send data to server using fetch with Content-Type header
      const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          body: jsonData,
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          const user = await response.json();  
          console.log('User created:', user);
          // Redirect or display success message (optional)
          alert('Thank you for registering! You can now proceed.');
          // You could also redirect to a confirmation page here
      } else {
          const errorData = await response.json();
          console.error('Error creating user:', errorData);
          alert(`Error: ${errorData}`);
      }
  } catch (error) {
      console.error('Error:', error.message);
      alert(error.message); // Display error message to the user
  }
});

// Function to handle "Back" button click
function goBack() {
  alert('Going back!');
  // Add logic to handle going back (optional)
}