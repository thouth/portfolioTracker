from fastapi import APIRouter, Depends
from supabase import Client
from app.dependencies import get_current_user, get_supabase_client

router = APIRouter(prefix="/api", tags=["Portfolio"])

@router.get("/portfolio-overview")
async def portfolio_overview(user: str = Depends(get_current_user), supabase: Client = Depends(get_supabase_client)):
    user_id = user

    tx_res = supabase.from_('transactions').select("*").eq("user_id", user_id).execute()
    transactions = tx_res.data or []

    holdings_res = supabase.from_('holdings').select("*").eq("user_id", user_id).execute()
    holdings = holdings_res.data or []

    cash_res = supabase.from_('cash').select("amount").eq("user_id", user_id).single().execute()
    cash = cash_res.data['amount'] if cash_res.data else 0

    total_value = cash
    daily_change = 0

    simplified_holdings = []
    for h in holdings:
        mv = h['market_value']
        daily = h.get('daily_change', 0)
        total_value += mv
        daily_change += daily

        simplified_holdings.append({
            "ticker": h['ticker'],
            "name": h.get('name', ''),
            "market_value": mv,
            "portfolio_pct": 0  # Fylles inn senere
        })

    for h in simplified_holdings:
        h['portfolio_pct'] = h['market_value'] / total_value if total_value > 0 else 0

    return {
        "total_value": total_value,
        "daily_change": daily_change,
        "daily_change_pct": (daily_change / (total_value - daily_change)) * 100 if total_value - daily_change > 0 else 0,
        "cash": cash,
        "holdings": simplified_holdings
    }
