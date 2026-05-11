const { client } = require('../config/database');

exports.loginVulnerable = async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const { username, password } = req.body;

    console.log(`[!] Login Attempt - Username: ${username}, Payload:`, password);

    const user = await db.collection('users').findOne({ username, password });

    if (user) {
        return res.json({ message: "Login successful!", data: user });
    }
    res.status(401).json({ message: "Invalid credentials" });
};

exports.loginBlindRegex = async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const { username, password } = req.body;

    console.log(`[!] Blind Regex Injection attempt for: ${username}`);

    const user = await db.collection('users').findOne({
        username: username,
        password: { $regex: password }
    });

    if (user) {
        return res.json({ message: "Login successful via Blind Regex!", data: user });
    }
    res.status(401).json({ message: "Invalid credentials" });
};

exports.loginWithScript = async (req, res) => {
    try {
        const db = client.db(process.env.DB_NAME);
        const { username, password } = req.body;

        console.log(`[!] Processing JS Injection attempt for: ${username}`);

        const user = await db.collection('users').findOne({
            username: username,
            $where: `this.password == '${password}'` 
        });

        if (user) {
            return res.json({ message: "Login successful via SSJI!", data: user });
        }
        res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.loginSecure = async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Security Alert: Invalid input type!" });
    }

    const user = await db.collection('users').findOne({ username, password });
    if (user) return res.json({ message: "Secure Login Success!" });
    res.status(401).json({ message: "Invalid credentials" });
};

