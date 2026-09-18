# UDAY MAGAZINE — Official Institute Magazine Portal

> **"Magna est veritas et praevalebit"**  
> Official Magazine of the Indian Institute of Science Education and Research (IISER) Bhopal.  
> **Designed & Developed with ❤️ by Souradip & Sayandeep**

---

## 🚀 Architectural Overview & What's New

1. **Multi-Page Architecture**:
   - `/` — **Home**: Hero section with logo, latest magazine spotlight with PDF download, community blog highlights, and announcements ticker.
   - `/magazines` — **Official Magazines Archive**: Repository of published volumes with cover artworks, Raga & seasonal sections, and direct PDF download links.
   - `/blogs` — **Community Blogs**: Separate platform for student/researcher blogs with rolling 30-day exposure, search, category filter, and "Post Your Blog" modal.
   - `/gallery` — **Visual Arts & Photography**: Curated photo essays and student artworks with interactive lightbox modal.
   - `/events` — **Literary Events & Announcements**: Upcoming notices with RSVP and past events gallery.
   - `/feedback` — **Feedback Desk**: Direct email and critique collection synced to Google Sheets.
   - `/contact` — **Editorial Directory**: Faculty advisor Dr. Renny Thomas, student editors, campus address, and inquiry form.
   - `/admin` — **Admin Control Suite**: Dedicated dashboard for publishing magazine PDFs, approving community blogs, updating gallery images, and managing security.

2. **Admin Magazine PDF Publisher**:
   - Admin can upload official magazine PDF files (`.pdf`) or provide public Google Drive / cloud PDF links.
   - Upon release, the volume is automatically added to `/magazines` with a direct download button.

3. **Separate 30-Day Community Blogs**:
   - Students submit articles/poetry.
   - Review alert sent to **`sayandeep.biswas04@gmail.com`** with 1-click approve/reject link.
   - Once approved, the piece remains featured for **30 days** with an active countdown badge (*"X days left"*).

4. **Security & Un-prefilled Credentials**:
   - Admin login inputs start completely blank (no prefilled values).
   - Configured via environment variables for Render: `ADMIN_USERNAME` (`udaymag25`) and `ADMIN_PASSWORD` (`uDAY26deV`).
   - Password changes strictly require a 6-digit confirmation code dispatched exclusively to **`sayandeep.biswas04@gmail.com`**.

5. **Mobile Responsive Hamburger Drawer**:
   - Touch-friendly slide-out drawer menu with smooth transition, active route indicators, and instant CTAs.

6. **Merchandise Removed**:
   - The merchandise portal has been completely eliminated.

7. **Copyright**:
   - Explicitly attributed to **Souradip and Sayandeep** across the portal and footer.

8. **Zero-Latency Landing Page (Render Cold-Start Masking)**:
   - Eliminates the 30–60 second cold-start delay on Render free tiers when clicking public/social links.
   - **Standalone Static Gateway (`landing/index.html`)**: Instant zero-bundle page deployable to GitHub Pages, Vercel, or custom CDN.
   - **Logo Animation**: UDAY logo pulses and glows 3 times with radiant warm shockwaves.
   - **Cinematic Typographic Sequence**: Sequentially displays **WAKE UP** → **WRITE** → **CLICK** → **DRAW** → **THINK** → **UDAY......**
   - **Background Wakeup Engine**: Concurrently polls `/api/health` to spin up Render in the background; smoothly transitions to the portal once the server awakens.
   - Also available inside the SPA via route `/landing` and direct server route `/gateway`.

---

## 🛠️ Deploying to Render in 3 Steps

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Uday Magazine Portal"
git remote add origin https://github.com/YOUR_USERNAME/uday-website.git
git push -u origin main
```

### Step 2: Create Web Service on Render
1. Go to **[dashboard.render.com](https://dashboard.render.com)** and click **New + > Web Service**.
2. Connect your GitHub repository.
3. Render will automatically read `render.yaml` or you can verify:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 3: Configure Environment Variables (Optional)
In Render > **Environment**:
| Key | Default Value | Note |
|---|---|---|
| `ADMIN_USERNAME` | `udaymag25` | Admin username |
| `ADMIN_PASSWORD` | `uDAY26deV` | Initial admin password |
| `NOTIFICATION_EMAIL` | `sayandeep.biswas04@gmail.com` | Receives review alerts & OTPs |
| `NODE_ENV` | `production` | Production mode |

Click **Deploy** — your website will be live with free SSL!

---

## 💻 Local Running

```bash
cd "/Users/sayandeepbiswas/Documents/uday website"

# Run both server and client:
npm start
```
Open **[http://localhost:5001](http://localhost:5001)** in your browser.

- **Admin Login Page**: [http://localhost:5001/admin](http://localhost:5001/admin)
  - Username: `udaymag25`
  - Password: `uDAY26deV`
