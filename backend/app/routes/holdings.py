from fastapi import APIRouter, Depends
from app.deps import get_current_user
import os, psycopg2, psycopg2.extras
import finnhub
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/holdings", tags=["Holdings"])

finnhub_client = finnhub.Client(api_key=os.getenv("FINNHUB_API_KEY"))

def get_db_conn():
    return psycopg2.connect(os.getenv("SUPABASE_DB_URL"))

@router.get("/")
def calculate_holdings(user_id: str = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM transactions WHERE user_id = %s", (user_id,))
    transactions = cur.fetchall()
    cur.close()
    conn.close()

    holdings = defaultdict(lambda: {"shares": 0, "cost": 0})

    for tx in transactions:
        t = tx["ticker"].upper()
        if tx["trade_type"] == "BUY":
            holdings[t]["shares"] += tx["shares"]
            holdings[t]["cost"] += tx["shares"] * tx["price"]
        elif tx["trade_type"] == "SELL":
            if holdings[t]["shares"] > 0:
                avg_cost = holdings[t]["cost"] / holdings[t]["shares"]
                holdings[t]["shares"] -= tx["shares"]
                holdings[t]["cost"] -= tx["shares"] * avg_cost

    # Beregn markedsverdi og P/L
    result = []
    total_value = 0
    for ticker, data in holdings.items():
        if data["shares"] <= 0:
            continue
        quote = finnhub_client.quote(ticker)
        current_price = quote.get("c") or 0
        market_value = current_price * data["shares"]
        avg_cost = data["cost"] / data["shares"]
        unrealized_pl = market_value - data["cost"]

        result.append({
            "ticker": ticker,
            "shares": data["shares"],
            "avg_cost": round(avg_cost, 2),
            "current_price": round(current_price, 2),
            "market_value": round(market_value, 2),
            "unrealized_pl": round(unrealized_pl, 2)
        })
        total_value += market_value

    # Legg til portefølje-andel per aksje
    for r in result:
        r["portfolio_pct"] = round((r["market_value"] / total_value) * 100, 2) if total_value > 0 else 0

    return {
        "total_value": round(total_value, 2),
        "holdings": result
    }
