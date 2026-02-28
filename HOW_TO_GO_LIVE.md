# Chadar Samaj Matrimony - Live Setup Guide

Yeh document batayega ki aap kaise apne local "data.json" database ko hata kar **Google Sheets** ko apna main database bana sakte hain, aur photos ko internet par save karne ke liye **Cloudinary** ka use kaise kar sakte hain. Iske baad aap Vercel/Render par is website ko mukt me Live (Online) kar sakenge!

---

## 📸 Step 1: Cloudinary Setup (Photos Ke Liye)
Jab project live hota hai, toh photos server par save nahi hoti. Hum free me photos upload karne ke liye "Cloudinary" ka use karenge.

1. **Account Banayein:** [Cloudinary.com](https://cloudinary.com/) par jayen aur free account banayein.
2. **Dashboard Check Karein:** Login karne ke baad dashboard/settings mein aapko 3 cheezein bhengi:
   - `Cloud Name`
   - `API Key`
   - `API Secret`
3. **Settings Update Karein:** Apne project ke `server` folder me `.env` file ko open karein, aur in teeno values ko waha daal dein:
   ```env
   USE_CLOUDINARY=true
   CLOUDINARY_CLOUD_NAME=aapka_cloud_name
   CLOUDINARY_API_KEY=aapki_api_key
   CLOUDINARY_API_SECRET=aapka_api_secret
   ```

---

## 📊 Step 2: Google Sheets Setup (Database Ke Liye)
Hum JSON file ki jagah direct Google Excel sheet me user ka data save karenge.

1. **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com/) par jayen aur apne Gmail se login karein.
2. Ek "New Project" banayein (Jaise: MatrimonyDB).
3. Upar Search bar mein **"Google Sheets API"** likhe aur usko "Enable" kardein.
4. **Service Account (Jisse Code Connect Hoga):**
   - Left side menu me "Credentials" par jayein.
   - "Create Credentials" > "Service Account" select karein aur account banaalein.
   - Ab us Service Account par click karein > "Keys" tab me jayen > "Add Key" > "Create new key" (JSON select karein).
   - Ek JSON file download ho jayegi. Is file ke andar ek `client_email` aur lamba sa `private_key` hoga.
5. **Apna Google Sheet Banayen:**
   - Apne personal Google Drive me ek nayi khaali (Empty) "Google Sheet" banaye.
   - Upar Share button dabayein, aur uss downloaded JSON file wale `client_email` par Editor ka permission de dein.
   - Sheet ke URL link me se uska **Sheet ID** copy kar lein. (Jaise: `docs.google.com/spreadsheets/d/YEH_WALA_ID/edit`)
6. **Settings Update Karein:** Apne `server/.env` file me apni teeno details daal dein:
   ```env
   USE_GOOGLE_SHEETS=true
   GOOGLE_SERVICE_ACCOUNT_EMAIL=woh_client_email@xyz.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nAAPKI_LAMBI_KEY\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=aapki_sheet_ka_id
   ```

**❓ Google Sheet Database Kis Email Par Hai Kaise Pata Karein?**
Jab aap local DB (`data.json`) chhod kar Google Sheet use karna shuru kar denge, toh aapka database Google Sheet mein save hoga. Ye Google Sheet ussi Gmail (Google account) par hogi **jisse login karke aapne Step 2.5 mein sheet banayi thi.**

Ise check karne ya database open karne ka tareeka:
1. Apna woh normal Gmail account login karein (jisme aapne upar wali Sheet banayi thi).
2. Apne browser mein **[sheets.google.com](https://sheets.google.com)** likh kar open karein.
3. Wahan aapko aapki banayi hui Sheet dikh jayegi.
4. Usko open karte hi aapko **`users`**, **`profiles`**, aur **`reports`** naam ki tabs (neeche ki taraf) dikh jayengi jisme sara data hoga!

---

## 🌐 Step 3: Project Ko Live Karna (Free Hosting)

Jab dono setup ho jaye, to aap code ko free me online live kar sakte hain!

1. **Github Push:** Apna pura code [Github](https://github.com/dileepchadar/ChadarSamaj) par add and commit karke push karein.
2. **Backend (Server) ke liye Render.com:**
   - [Render.com](https://render.com/) par account banaye, "Web Service" banaye, apne Github se connect karein.
   - Root Directory `server` dale.
   - Environment variables (ENV) me woh saari keys aur IDs paste/add karden `.env` file wali.
3. **Frontend (Client) ke liye Vercel.com:**
   - [Vercel.com](https://vercel.com/) par login karein, project import karein, Root Directory `client` select karein.
   - Build command me `npm run build` automatic aa jayega.
   - Waha ek Environment Variable add kare jo Render wale Backend URL ko point karega (API call ke liye).

**Badhai Ho! Ab aapki Matrimony website Live ho chukti hai aur data sidhe Google Sheet par aayega!**
