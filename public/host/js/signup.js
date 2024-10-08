
function validateFormData(data) {
    const requiredFields = ['idNumber', 'firstName', 'lastName', 'surName', 'role', 'mobileNumber', 'email', 'password', 'confirmPassword'];

    for (const field of requiredFields) {
        if (!data[field]) {
            throw new Error(`${field} is required.`);
        }
    }

    if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match.');
    }
    
    // if (data.password.length < 8) {
    //     throw new Error('Password must be at least 8 characters long.');
    // }

    // if (!isEmailValid(data.email)) {
    //     throw new Error('Invalid email format.');
    // }
    const validateName = (firstName) =>{
        if(!/^[a-zA-Z]+$/.test(firstName)){
            alert("Invalid first name. Only aplhabets are allowed")
            throw new error("Invalid names. Only alphabets are allowed.")
        }
        if(!/^[a-zA-Z]+$/.test(lastName)){
            alert("Invalid last name. Only aplhabets are allowed")
            throw new error("Invalid names. Only alphabets are allowed.")

    
        }
        if(!/^[a-zA-Z]+$/.test(surName)){
            alert("Invalid surname. Only aplhabets are allowed")
            throw new error("Invalid names. Only alphabets are allowed.")

    
        }
    }
    
    
}
const validateName = (firstName) =>{
    if(!/^[a-zA-Z]+$/.test(firstName)){
        alert("Invalid first name. Only aplhabets are allowed")
        throw new error("Invalid names. Only alphabets are allowed.")
    }
    if(!/^[a-zA-Z]+$/.test(lastName)){
        alert("Invalid last name. Only aplhabets are allowed")
        throw new error("Invalid names. Only alphabets are allowed.")


    }
    if(!/^[a-zA-Z]+$/.test(surName)){
        alert("Invalid surname. Only aplhabets are allowed")
        throw new error("Invalid names. Only alphabets are allowed.")


    }
}


function showConfirmationDialog(data) {
    const confirmationMessage = `
      Please confirm your details: 
      First Name: ${data.firstName}
      Last Name: ${data.lastName}
      Surname: ${data.surName}
      ID: ${data.idNumber}
      Mobile Number: ${data.mobileNumber}
      Role: ${data.role}
      Email: ${data.email}
      Password: ${data.password}  
      Confirm Password: ${data.confirmPassword}
    `;

    return confirm(confirmationMessage);
}

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async (event) => {
    try {
        event.preventDefault();

        const formData = new FormData(document.getElementById('userForm'));
        const data = Object.fromEntries(formData.entries());

        // Validate form data
        validateFormData(data);

        // // Hash the password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(data.password, salt);

        // // Replacing the plain password with the hashed password
        // data.password = hashedPassword;
        // data.confirmPassword = undefined; 

        if (showConfirmationDialog(data)) {
            const jsonData = JSON.stringify(data);

            const response = await fetch('http://localhost:8002/api/users2', {
                method: 'POST',
                body: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error:', errorData);
                alert(`Error: ${errorData}`);
                return;
            }

            const user = await response.json();
            console.log('User created:', user);
            alert(`Welcome, ${user.firstName} Your registration was successfull. Proceed to login!!`);
            window.location.href = '/public/host/html/host.html';
        } else {
            alert('Form submission canceled.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
});