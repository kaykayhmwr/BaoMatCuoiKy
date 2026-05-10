document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const passwordRaw = document.getElementById('password').value;
    const resultArea = document.getElementById('resultArea');
    const statusMsg = document.getElementById('statusMsg');
    const jsonOutput = document.getElementById('jsonOutput');

    let password;
    try {
        password = passwordRaw.startsWith('{') ? JSON.parse(passwordRaw) : passwordRaw;
    } catch (e) {
        password = passwordRaw;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        resultArea.classList.remove('hidden');

        if (response.ok) {
            statusMsg.textContent = "[+] ACCESS GRANTED";
            statusMsg.className = "success";
        } else {
            statusMsg.textContent = "[-] ACCESS DENIED";
            statusMsg.className = "error";
        }
        jsonOutput.textContent = JSON.stringify(result, null, 2);

    } catch (error) {
        alert("Server error, check console!");
    }
});