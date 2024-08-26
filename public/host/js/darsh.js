document.addEventListener('DOMContentLoaded', async () => {
    const hostId = sessionStorage.getItem("hostId"); // Get the hostId from session storage
    const hostName = sessionStorage.getItem("hostName") || "Guest"; // Fetch host name
    document.getElementById('hostName').textContent = hostName; // Display host name

    console.log("Host Id:", hostId); // Log the host ID for debugging

    // Fetch all visitors
    try {
        const visitorResponse = await fetch(`http://localhost:8002/api/users`); // Fetch all visitors
        if (!visitorResponse.ok) {
            throw new Error('Failed to fetch visitors');
        }

        const visitors = await visitorResponse.json();
        const pendingVisitorsTable = document.getElementById('pending-visitors');
        pendingVisitorsTable.innerHTML = ''; // Clear existing rows

        // Count pending visitors
        let pendingCount = 0;
        let hasVisitors = false; // Flag to check if there are any visitors

        visitors.forEach(visitor => {
            const row = document.createElement('tr');

            // Compare visitor's hostId with the session hostId
            if (visitor.hostId.toString() === hostId) { // Ensure both are strings for comparison
                hasVisitors = true; // Set flag to true if there are visitors
                // Check if the visitor status is waiting
                if (visitor.status === 'waiting') {
                    pendingCount++; // Increment the count for pending visitors

                    row.innerHTML = `
                        <td>${visitor.name}</td>
                        <td>${visitor.purposeOfVisiting}</td>
                        <td>${new Date(visitor.createdAt).toLocaleTimeString()}</td>
                        <td>
                            <button onclick="approveVisitor('${visitor._id}', '${visitor.name}')">Approve</button>
                            <button onclick="denyVisitor('${visitor._id}', '${visitor.name}')">Deny</button>
                        </td>
                    `;
                    pendingVisitorsTable.appendChild(row); // Add the row to the table
                }
            }
        });

        // Update the pending count display
        document.getElementById('pending-count').textContent = pendingCount;

        // Alert if there are no visitors
        if (!hasVisitors) {
            alert("You don't have any visitors.");
        }

    } catch (error) {
        console.error('Error fetching visitors:', error);
        alert('Error fetching visitors');
    }
});

// Function to handle approving a visitor
async function approveVisitor(userId, visitorName) {
    try {
        const response = await fetch(`http://localhost:8002/api/users/${userId}/approve`, {
            method: 'POST' // Specify the HTTP method as POST
        });
        if (!response.ok) {
            throw new Error('Failed to approve visitor');
        }

        // Alert the host about their approval
        alert(`You have approved ${visitorName}.`);

        // Reload the page to see updated counts
        location.reload(); 
    } catch (error) {
        console.error('Error approving visitor:', error);
        alert('Error approving visitor');
    }
}

// Function to handle denying a visitor
async function denyVisitor(userId, visitorName) {
    try {
        const response = await fetch(`http://localhost:8002/api/users/${userId}/deny`, {
            method: 'POST' // Specify the HTTP method as POST
        });
        if (!response.ok) {
            throw new Error('Failed to deny visitor');
        }

        // Alert the host about their denial
        alert(`You have denied ${visitorName}.`);

        // Reload the page to see updated counts
        location.reload(); 
    } catch (error) {
        console.error('Error denying visitor:', error);
        alert('Error denying visitor');
    }
}

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.clear(); // Clear session storage
    window.location.href = '/public/host/html/host.html'; // Redirect to login page
});