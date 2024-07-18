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
const continueBtn = document.getElementById('continue');
// continueBtn.addEventListener('click', async (event) => {
//   try {
//       event.preventDefault();

//       // Get form data
//       const formData = new FormData(document.getElementById('userForm'));
//       const data = Object.fromEntries(formData.entries());

//       // Validate form data
//       validateVisitorData(data);

//       // Send data to server using fetch
//       const response = await fetch('/users', {
//           method: 'POST',
//           body: formData  // Sending formData directly
//       });

//       // Handle server response
//       if (response.ok) {
//           const user = await response.json();
//           console.log('User created:', user);
//           // Redirect or perform additional actions
//       } else {
//           const error = await response.json();
//           console.error('Error creating user:', error.message);
//           // Handle error
//       }
//   } catch (error) {
//       console.error('Error:', error.message);
//       alert(error.message); // Display error message to the user
//   }
// });
continueBtn.addEventListener('click', async (event) => {
  try {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('userForm'));
    const data = Object.fromEntries(formData.entries());

    // Validate form data
    validateVisitorData(data);

    // Send data to server using fetch
    const response = await fetch('/users', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const user = await response.json();
      console.log('User created:', user);
      // Redirect or perform additional actions
    } else {
      const errorData = await response.text();
      console.error('Error creating user:', errorData);
      alert(`Error: ${errorData}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    alert(error.message);
  }
});

// Function to handle "Back" button click
function goBack() {
  alert('Going back!');
  // Add logic to handle going back (optional)
}
