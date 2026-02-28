require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const USE_SHEETS = process.env.USE_GOOGLE_SHEETS === 'true';

// --- GOOGLE SHEETS IMPLEMENTATION ---
let doc;
if (USE_SHEETS) {
    doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    }).then(() => doc.loadInfo()).then(async () => {
        console.log(`[Google Sheets] Connected to document: ${doc.title}`);
        const names = ['users', 'profiles', 'reports'];
        for (const name of names) {
            if (!doc.sheetsByTitle[name]) {
                console.log(`Creating missing sheet: ${name}`);
                const headers = name === 'profiles' ? 
                    ['_id', 'createdAt', 'name', 'gender', 'age', 'height', 'maritalStatus', 'religion', 'caste', 'education', 'occupation', 'village', 'district', 'state', 'mobile', 'description', 'familyDetails', 'userId', 'photos', 'isApproved', 'gotra', 'fatherName', 'motherName', 'disability'] : 
                    name === 'users' ? ['_id', 'createdAt', 'mobile', 'role'] :
                    ['_id', 'createdAt', 'profileId', 'reason', 'reportedBy'];
                
                await doc.addSheet({ title: name, headerValues: headers });
            }
        }
    }).catch(err => {
        console.error("[Google Sheets] Init Error: Please check .env credentials", err.message);
    });
}

// Format rows object back to normal JS Object (Parse arrays/booleans correctly)
const formatRow = (row) => {
    const obj = {};
    const headers = row._sheet.headerValues;
    for (const key of headers) {
        let val = row.get(key);
        if (val === 'TRUE') val = true;
        if (val === 'FALSE') val = false;
        
        // Photos array
        if (key === 'photos' && val) {
            try { val = JSON.parse(val); } catch(e) { val = []; }
        }
        obj[key] = val;
    }
    obj._row = row; // store reference for updating/deleting
    return obj;
};

const sheetDB = {
    find: async (collection, query = {}) => {
        const sheet = doc.sheetsByTitle[collection];
        if(!sheet) return [];
        const rows = await sheet.getRows();
        return rows.map(r => formatRow(r)).filter(item => {
            return Object.keys(query).every(key => item[key] == query[key]);
        });
    },
    findOne: async (collection, query = {}) => {
        const sheet = doc.sheetsByTitle[collection];
        if(!sheet) return null;
        const rows = await sheet.getRows();
        const found = rows.find(r => {
            const item = formatRow(r);
            return Object.keys(query).every(key => item[key] == query[key]);
        });
        return found ? formatRow(found) : null;
    },
    create: async (collection, item) => {
        const sheet = doc.sheetsByTitle[collection];
        const newItem = { _id: Date.now().toString(), createdAt: new Date().toISOString(), ...item };
        
        // Stringify arrays before insert
        const sheetItem = { ...newItem };
        if (sheetItem.photos) sheetItem.photos = JSON.stringify(sheetItem.photos);
        
        await sheet.addRow(sheetItem);
        return newItem;
    },
    update: async (collection, id, updates) => {
        const sheet = doc.sheetsByTitle[collection];
        const rows = await sheet.getRows();
        const row = rows.find(r => r.get('_id') == id);
        if (!row) return null;
        
        for (const [key, val] of Object.entries(updates)) {
            let newVal = val;
            if (key === 'photos') newVal = JSON.stringify(val);
            if (typeof val === 'boolean') newVal = val ? 'TRUE' : 'FALSE';
            row.assign({ [key]: newVal });
        }
        await row.save();
        return formatRow(row);
    },
    delete: async (collection, id) => {
        const sheet = doc.sheetsByTitle[collection];
        const rows = await sheet.getRows();
        const row = rows.find(r => r.get('_id') == id);
        if (row) {
            await row.delete();
            return true;
        }
        return false;
    },
    filterProfiles: async (filters) => {
        const profiles = await sheetDB.find('profiles');
        return profiles.filter(p => {
            if(!p.isApproved) return false; 
            if(filters.gender && p.gender !== filters.gender) return false;
            if(filters.disability === 'true' || filters.disability === true) {
                 if(!p.disability) return false;
                 const d = String(p.disability).toLowerCase().trim();
                 if(d === '' || d === 'none' || d === 'no' || d === 'na' || d === 'n/a') return false;
            }
            if(filters.religion && p.religion !== filters.religion) return false;
            if(filters.caste && p.caste !== filters.caste) return false;
            if(filters.district && !String(p.district).toLowerCase().includes(filters.district.toLowerCase())) return false; 
            if(filters.name && !String(p.name).toLowerCase().includes(filters.name.toLowerCase())) return false;
            if(filters.minAge && Number(p.age) < Number(filters.minAge)) return false;
            if(filters.maxAge && Number(p.age) > Number(filters.maxAge)) return false;
            return true;
        }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    getAll: async (collection) => {
        const items = await sheetDB.find(collection);
        return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
};

// --- JSON DATABASE IMPLEMENTATION (FALLBACK) ---
const DB_FILE = path.join(__dirname, 'data.json');

if (!USE_SHEETS && !fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], profiles: [], reports: [] }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const jsonDB = {
    find: async (collection, query = {}) => Object.keys(query).length === 0 ? readDB()[collection] : readDB()[collection].filter(item => Object.keys(query).every(key => item[key] == query[key])),
    findOne: async (collection, query = {}) => readDB()[collection].find(item => Object.keys(query).every(key => item[key] == query[key])),
    create: async (collection, item) => {
        const db = readDB();
        const newItem = { _id: Date.now().toString(), createdAt: new Date().toISOString(), ...item };
        db[collection].push(newItem);
        writeDB(db);
        return newItem;
    },
    update: async (collection, id, updates) => {
        const db = readDB();
        const index = db[collection].findIndex(i => i._id == id);
        if (index === -1) return null;
        db[collection][index] = { ...db[collection][index], ...updates };
        writeDB(db);
        return db[collection][index];
    },
    delete: async (collection, id) => {
        const db = readDB();
        const index = db[collection].findIndex(i => i._id == id);
        if (index === -1) return null;
        db[collection].splice(index, 1);
        writeDB(db);
        return true;
    },
    filterProfiles: async (filters) => {
        const db = readDB();
        return db.profiles.filter(p => {
            if(!p.isApproved) return false; 
            if(filters.gender && p.gender !== filters.gender) return false;
            if(filters.disability === 'true' || filters.disability === true) {
                 if(!p.disability) return false;
                 const d = String(p.disability).toLowerCase().trim();
                 if(d === '' || d === 'none' || d === 'no' || d === 'na' || d === 'n/a') return false;
            }
            if(filters.religion && p.religion !== filters.religion) return false;
            if(filters.caste && p.caste !== filters.caste) return false;
            if(filters.district && p.district && !p.district.toLowerCase().includes(filters.district.toLowerCase())) return false; 
            if(filters.name && p.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
            if(filters.minAge && p.age < Number(filters.minAge)) return false;
            if(filters.maxAge && p.age > Number(filters.maxAge)) return false;
            return true;
        }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    getAll: async (collection) => readDB()[collection].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
};

module.exports = USE_SHEETS ? sheetDB : jsonDB;
