const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        profiles: [],
        reports: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const readDB = () => {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    // Generic Find
    find: (collection, query = {}) => {
        const db = readDB();
        return db[collection].filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    },
    
    // Generic FindOne
    findOne: (collection, query = {}) => {
        const db = readDB();
        return db[collection].find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    },

    // Generic Create
    create: (collection, item) => {
        const db = readDB();
        const newItem = { _id: Date.now().toString(), createdAt: new Date(), ...item };
        db[collection].push(newItem);
        writeDB(db);
        return newItem;
    },

    // Generic Update
    update: (collection, id, updates) => {
        const db = readDB();
        const index = db[collection].findIndex(i => i._id === id);
        if (index === -1) return null;
        
        db[collection][index] = { ...db[collection][index], ...updates };
        writeDB(db);
        return db[collection][index];
    },

    // Generic Delete
    delete: (collection, id) => {
        const db = readDB();
        const index = db[collection].findIndex(i => i._id === id);
        if (index === -1) return null;
        
        db[collection].splice(index, 1);
        writeDB(db);
        return true;
    },

    // Custom filtering for search
    filterProfiles: (filters) => {
        const db = readDB();
        
        // DEBUG LOGGING
        console.log('--- FILTERING ---');
        console.log('Filters:', filters);

        return db.profiles.filter(p => {
            if(!p.isApproved) return false; 

            if(filters.gender && p.gender !== filters.gender) return false;
            
            // Disability Filter
            if(filters.disability === 'true' || filters.disability === true) {
                 if(!p.disability) return false;
                 const d = String(p.disability).toLowerCase().trim();
                 if(d === '' || d === 'none' || d === 'no' || d === 'na' || d === 'n/a') return false;
            }

            if(filters.religion && p.religion !== filters.religion) return false;
            if(filters.caste && p.caste !== filters.caste) return false;
            if(filters.district && !p.district.toLowerCase().includes(filters.district.toLowerCase())) return false; 
            if(filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
            if(filters.minAge && p.age < Number(filters.minAge)) return false;
            if(filters.maxAge && p.age > Number(filters.maxAge)) return false;

            return true;
        }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get all (for admin)
    getAll: (collection) => {
        const db = readDB();
        return db[collection].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};
