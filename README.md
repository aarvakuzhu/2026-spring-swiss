# 🇨🇭 Switzerland Trip Planner — Apr 4–12, 2026

Two-family trip companion app. Node/Express + MongoDB Atlas + Render.

## Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Frontend**: Vanilla HTML/CSS/JS (served as static files)
- **Hosting**: Render.com

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` and fill in:
```
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=any-random-string
PORT=3000
```

### 3. Seed the checklist
```bash
node server/seed.js
```

### 4. Add family members
POST to `/api/members` for each person. Example:
```json
{
  "family": "ashok",
  "name": "Ashok",
  "age": 45,
  "role": "adult",
  "gender": "male",
  "interests": ["photography", "food", "hiking"],
  "avatar": "👨",
  "color": "#2563EB"
}
```

### 5. Run locally
```bash
npm run dev
```

## Render Deployment
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: set `MONGODB_URI` and `SESSION_SECRET` in Render dashboard

## API Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/members | All members |
| POST | /api/members | Create member |
| PATCH | /api/members/:id | Update member |
| GET | /api/members/:id/state | Member's last UI state |
| PATCH | /api/members/:id/state | Save member's UI state |
| GET | /api/checklist | All checklist items |
| POST | /api/checklist | Add item |
| PATCH | /api/checklist/:id/complete | Toggle completion for a member |
| DELETE | /api/checklist/:id | Delete item |
| GET | /api/notes?dayIndex=N | Notes for a day |
| POST | /api/notes | Add note |
| PATCH | /api/notes/:id | Pin/edit note |
| DELETE | /api/notes/:id | Delete note |
