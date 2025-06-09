# Portefølje app

# 📊 AI Stock Portfolio Tracker

Dette er en fullstack webapp for å spore din personlige aksjeportefølje.  
Bygget med **React (Vite)** frontend og **FastAPI** backend, koblet til **Supabase** for autentisering og database.  
Integrasjon med **Finnhub** for sanntids markedsdata.

---

## 🚀 Teknologi
- **Frontend**: React, Tailwind CSS, react-chartjs-2
- **Backend**: FastAPI, httpx, Supabase
- **Database & Auth**: Supabase (Postgres)
- **API**: Finnhub (realtime market data)
- **Hosting**: Render

---

## 📦 Kom i gang lokalt
Kjør først setup-scriptet som konfigurerer prosjektet:

```bash
bash scripts/setup.sh
```


### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Mac/Linux)
venv\\Scripts\\activate   # (Windows)
pip install -r requirements.txt

### Opprett .env-fil i backend/ med:
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_JWT_SECRET=...
FINNHUB_API_KEY=...

### Start backend:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

###Frontend
cd frontend
npm install

###Opprett .env.local i frontend/ med:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

###Start frontend:
npm run dev
