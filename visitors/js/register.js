function openConfirmation() {
  // Get form data
  const name = document.getElementById('name').value;
  const tel = document.getElementById('tel').value;
  const company = document.getElementById('company').value;
  const visiting = document.getElementById('visiting').value;
  const reason = document.getElementById('reason').value;

  // Redirect to confirmation page with query parameters
  window.location.href = `confirmation.html?name=${encodeURIComponent(name)}&tel=${encodeURIComponent(tel)}&company=${encodeURIComponent(company)}&visiting=${encodeURIComponent(visiting)}&reason=${encodeURIComponent(reason)}`;
}

function goBack() {
  alert('Going back!');
}
