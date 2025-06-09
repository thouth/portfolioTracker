# app/routes/stock_history.py
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
import os
from datetime import datetime, timedelta
import httpx

router = APIRouter()

@router.get("/api/stock-history/{ticker}")
async def get_stock_history(ticker: str, user_id: str = Depends(get_current_user)):
    API_KEY = os.getenv("FINNHUB_API_KEY")
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Finnhub API-nøkkel mangler.")

    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=365)

    url = (
        f"https://finnhub.io/api/v1/stock/candle"
        f"?symbol={ticker.upper()}&resolution=D"
        f"&from={int(start_date.timestamp())}&to={int(end_date.timestamp())}&token={API_KEY}"
    )

    async with httpx.AsyncClient() as client:
        res = await client.get(url)

    if res.status_code != 200:
        raise HTTPException(status_code=400, detail="Klarte ikke hente aksjedata.")

    data = res.json()
    if data.get("s") != "ok":
        raise HTTPException(status_code=400, detail="Ugyldig ticker eller ingen data.")

    closes = data["c"]
    timestamps = data["t"]

    def moving_average(values, window):
        return [
            sum(values[i - window:i]) / window if i >= window else None
            for i in range(len(values))
        ]

    ma50 = moving_average(closes, 50)
    ma200 = moving_average(closes, 200)

    result = [
        {
            "date": datetime.utcfromtimestamp(t).strftime("%Y-%m-%d"),
            "close": closes[i],
            "ma50": ma50[i],
            "ma200": ma200[i],
        }
        for i, t in enumerate(timestamps)
    ]

    return result
