window.onload = function() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const tel = params.get('tel');
    const company = params.get('company');
    const visiting = params.get('visiting');
    const reason = params.get('reason');

    // Set confirmation details
    document.getElementById('confirm-name').textContent = `Name: ${name}`;
    document.getElementById('confirm-tel').textContent = `Contact: ${tel}`;
    document.getElementById('confirm-company').textContent = `Company: ${company}`;
    document.getElementById('confirm-visiting').textContent = `Visiting: ${visiting}`;
    document.getElementById('confirm-reason').textContent = `Reason: ${reason}`;

    // Show confirmation pop-up (example alert)
    alert('Please verify your details.');
}

function goBack() {
    alert('Going back!');
  }

function submitForm() {
    
    alert('Form submitted successfully!');
}
