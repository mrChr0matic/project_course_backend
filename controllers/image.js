const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SftpClient = require('ssh2-sftp-client');

const sftp = new SftpClient();
const IP= process.env.IP;
const username="ubuntu-server";
const password=process.env.password;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempPath = path.join(__dirname, 'temp_uploads'); 
        console.log(tempPath)
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
        cb(null, tempPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const uploadToVM = async (localFilePath, remoteFilePath) => {
    try {
        await sftp.connect({
            host: IP,
            port: 22,
            username,  
            password
        });

        await sftp.put(localFilePath, remoteFilePath);
        await sftp.end();
        return `http://${IP}/uploads/${path.basename(remoteFilePath)}`;
    } catch (err) {
        console.error('SFTP Upload Error:', err);
        throw new Error('Failed to upload file to storage VM');
    }
};

const handleUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const localFilePath = path.join(__dirname, 'temp_uploads', req.file.filename);
    const remoteFilePath = `/var/www/images/uploads/${req.file.filename}`; 

    try {
        const imageUrl = await uploadToVM(localFilePath, remoteFilePath);
        fs.unlinkSync(localFilePath); 
        res.json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, handleUpload };
