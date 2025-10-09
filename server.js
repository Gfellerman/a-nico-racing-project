const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'anrp-racing-secret-2025';

// Database initialization
const db = new sqlite3.Database('./anrp_database.sqlite');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// Session configuration
app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const projectId = req.body.projectId || 'general';
        const mediaType = file.mimetype.startsWith('image/') ? 'images' : 'videos';
        const dir = `./uploads/${projectId}/${mediaType}`;
        
        // Create directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Initialize database tables
db.serialize(() => {
    // Projects table
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            subtitle TEXT,
            engine TEXT,
            power TEXT,
            category TEXT,
            status TEXT DEFAULT 'planning',
            description TEXT,
            featured_image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Project updates table
    db.run(`
        CREATE TABLE IF NOT EXISTS project_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            update_date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    `);

    // Project events table
    db.run(`
        CREATE TABLE IF NOT EXISTS project_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            event_date DATE NOT NULL,
            location TEXT,
            result TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    `);

    // Project media table
    db.run(`
        CREATE TABLE IF NOT EXISTS project_media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            original_name TEXT,
            file_path TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER,
            caption TEXT,
            is_featured BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    `);

    // Admin users table
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Insert default admin user (password: admin123)
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`
        INSERT OR IGNORE INTO admin_users (username, email, password_hash) 
        VALUES ('admin', 'admin@anrp.com', ?)
    `, [defaultPassword]);

    // Insert default projects
    const projects = [
        {
            slug: 'bmw-e46-m3-gtr',
            title: 'BMW E46 M3 GTR',
            subtitle: 'S62 V8 Engine Conversion',
            engine: 'S62 V8',
            power: '479 HP',
            category: 'Track Racing',
            status: 'in_progress',
            description: 'Complete race preparation featuring S62 V8 engine conversion for maximum track performance'
        },
        {
            slug: 'nissan-terrano-vg30e',
            title: 'Nissan Terrano',
            subtitle: 'Off-Road Rally Build',
            engine: 'VG30E V6',
            power: '150 HP',
            category: 'Off-Road Rally',
            status: 'planning',
            description: 'Off-road racing preparation with VG30E V6 engine optimization for competitive rally racing'
        },
        {
            slug: 'kartcross-ducati',
            title: 'Kart Cross',
            subtitle: 'Ducati Engine Swap',
            engine: 'Ducati 700cc',
            power: '70 HP',
            category: 'Kart Racing',
            status: 'planning',
            description: 'Off-road kart build featuring Ducati 700cc engine with reinforced suspension for competitive kart cross racing'
        },
        {
            slug: 'porsche-911-turbo-997',
            title: 'Porsche 911 (997) Turbo',
            subtitle: 'Complete Chassis Rebuild',
            engine: 'Twin-Turbo Flat-6',
            power: '650 HP',
            category: 'Supercar Rebuild',
            status: 'planning',
            description: 'Complete chassis-up rebuild targeting 650 HP with comprehensive mechanical restoration'
        }
    ];

    projects.forEach(project => {
        db.run(`
            INSERT OR IGNORE INTO projects (slug, title, subtitle, engine, power, category, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [project.slug, project.title, project.subtitle, project.engine, project.power, project.category, project.status, project.description]);
    });
});

// API Routes

// Authentication Routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username } });
    });
});

// Public API Routes

// Get all projects
app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, projects) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(projects);
    });
});

// Get single project by slug
app.get('/api/projects/:slug', (req, res) => {
    const { slug } = req.params;
    
    db.get('SELECT * FROM projects WHERE slug = ?', [slug], (err, project) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get project media
        db.all('SELECT * FROM project_media WHERE project_id = ? ORDER BY is_featured DESC, created_at DESC', [project.id], (err, media) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Get project updates
            db.all('SELECT * FROM project_updates WHERE project_id = ? ORDER BY update_date DESC', [project.id], (err, updates) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                // Get project events
                db.all('SELECT * FROM project_events WHERE project_id = ? ORDER BY event_date DESC', [project.id], (err, events) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }

                    project.media = media;
                    project.updates = updates;
                    project.events = events;
                    res.json(project);
                });
            });
        });
    });
});

// Protected Admin Routes

// Create/Update project
app.post('/api/admin/projects', authenticateToken, upload.single('featured_image'), (req, res) => {
    const { slug, title, subtitle, engine, power, category, status, description } = req.body;
    const featured_image = req.file ? req.file.path : null;

    if (!slug || !title) {
        return res.status(400).json({ error: 'Slug and title are required' });
    }

    const query = `
        INSERT OR REPLACE INTO projects (slug, title, subtitle, engine, power, category, status, description, featured_image, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(query, [slug, title, subtitle, engine, power, category, status, description, featured_image], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Add project update
app.post('/api/admin/projects/:slug/updates', authenticateToken, (req, res) => {
    const { slug } = req.params;
    const { title, description, update_date } = req.body;

    if (!title || !update_date) {
        return res.status(400).json({ error: 'Title and update date are required' });
    }

    // First get project ID
    db.get('SELECT id FROM projects WHERE slug = ?', [slug], (err, project) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        db.run(
            'INSERT INTO project_updates (project_id, title, description, update_date) VALUES (?, ?, ?, ?)',
            [project.id, title, description, update_date],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true, id: this.lastID });
            }
        );
    });
});

// Add project event
app.post('/api/admin/projects/:slug/events', authenticateToken, (req, res) => {
    const { slug } = req.params;
    const { title, description, event_date, location, result } = req.body;

    if (!title || !event_date) {
        return res.status(400).json({ error: 'Title and event date are required' });
    }

    // First get project ID
    db.get('SELECT id FROM projects WHERE slug = ?', [slug], (err, project) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        db.run(
            'INSERT INTO project_events (project_id, title, description, event_date, location, result) VALUES (?, ?, ?, ?, ?, ?)',
            [project.id, title, description, event_date, location, result],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true, id: this.lastID });
            }
        );
    });
});

// Upload project media
app.post('/api/admin/projects/:slug/media', authenticateToken, upload.array('media', 10), (req, res) => {
    const { slug } = req.params;
    const { caption, is_featured } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    // First get project ID
    db.get('SELECT id FROM projects WHERE slug = ?', [slug], (err, project) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const mediaInserts = req.files.map(file => {
            return new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO project_media (project_id, filename, original_name, file_path, file_type, file_size, caption, is_featured)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [project.id, file.filename, file.originalname, file.path, file.mimetype, file.size, caption, is_featured ? 1 : 0],
                    function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    }
                );
            });
        });

        Promise.all(mediaInserts)
            .then(ids => {
                res.json({ success: true, uploaded: ids.length, media_ids: ids });
            })
            .catch(err => {
                res.status(500).json({ error: 'Database error during media upload' });
            });
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🏁 ANRP Website Server running on port ${PORT}`);
    console.log(`🏁 Frontend: http://localhost:${PORT}`);
    console.log(`🏁 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🏁 API: http://localhost:${PORT}/api`);
});

module.exports = app;