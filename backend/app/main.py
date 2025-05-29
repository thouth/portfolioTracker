from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import protected, transactions
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Tillatte domener for CORS
origins = [
    "http://localhost:5173",            # Vite dev server
    "https://dittdomene.vercel.app",    # Sett inn ditt produksjonsdomene
]

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inkluder API-ruter
app.include_router(protected.router)
app.include_router(transactions.router)

# Helse-sjekk endepunkt
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
