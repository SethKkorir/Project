// Function to validate form data
function validateVisitorData(data) {
    const requiredFields = ['name', 'email', 'purposeOfVisiting', 'hostId'];
  
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new Error(`${field} is required!!!`);
        }
    }
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
                sessionStorage.setItem('hostId', user.hosId)
                window.location.href = `/public/visitors/html/verify.html`;
               

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
  async function fetchHosts() {
    try {
        const response = await fetch('http://localhost:8002/api/users2');
        const hosts = await response.json(); // phew,  then i convert the resonse from json to javascript array
        const hostSelect = document.getElementById('host');
        //Next, this is uum loop through each host in the hosts array
        hosts.forEach(host => {
            const option = document.createElement('option'); // then i create a new option element jeeez this was not easy to understand how it works
            option.value = host.id; // then phew, here it will set the value of the option to the host's unique ID (host._id), which will be sent to the server when the form is submitted.
            option.textContent = `${host.firstName} ${host.lastName} - ${host.role}`; // Display full name and role
            hostSelect.appendChild(option); //using the appandChild keyword that will new option to the dropdown menu
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
  