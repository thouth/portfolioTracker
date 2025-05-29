from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import protected, transactions, holdings
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 👇 Tillatte domener for frontend
origins = [
    "http://localhost:5173",            # Lokal utvikling
    "https://dittdomene.vercel.app",    # Produksjonsdomene (endre ved behov)
]

# 🔐 CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 API-ruter
app.include_router(protected.router)
app.include_router(transactions.router)
app.include_router(holdings.router)

# 🔍 Helse-sjekk
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
