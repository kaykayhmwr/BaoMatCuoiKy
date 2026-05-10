const { client } = require('../config/database');

// HÀM LỖI (Vulnerable): Để demo hack
exports.loginVulnerable = async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const { username, password } = req.body;

    // In log để cô thấy server đang nhận gì (giống Slide 11 ông mới thêm)
    console.log(`[!] Login Attempt - Username: ${username}, Payload:`, password);

    // LỖI CHÍNH: Nhét thẳng password (dù là String hay Object) vào truy vấn [cite: 159, 267]
    const user = await db.collection('users').findOne({ username, password });

    if (user) {
        return res.json({ message: "Login successful!", data: user }); // [cite: 182, 278]
    }
    res.status(401).json({ message: "Invalid credentials" });
};

// HÀM AN TOÀN (Secure): Đã vá lỗi bằng typeof [cite: 209, 283]
exports.loginSecure = async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const { username, password } = req.body;

    // Tấm khiên bảo vệ: Chỉ cho phép chuỗi văn bản [cite: 207, 281, 286]
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Security Alert: Invalid input type!" });
    }

    const user = await db.collection('users').findOne({ username, password });
    if (user) return res.json({ message: "Secure Login Success!" });
    res.status(401).json({ message: "Invalid credentials" });
};