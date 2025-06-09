from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.models import TransactionCreate, Transaction
from typing import List
import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

def get_db_conn():
    return psycopg2.connect(os.getenv("SUPABASE_DB_URL"))

@router.get("/", response_model=List[Transaction])
def list_transactions(user_id: str = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM transactions WHERE user_id = %s ORDER BY trade_date DESC", (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@router.post("/", response_model=Transaction)
def add_transaction(tx: TransactionCreate, user_id: str = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        INSERT INTO transactions (user_id, ticker, trade_type, shares, price, trade_date)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING *""",
        (user_id, tx.ticker.upper(), tx.trade_type, tx.shares, tx.price, tx.trade_date)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row

@router.delete("/{tx_id}")
def delete_transaction(tx_id: str, user_id: str = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM transactions WHERE id = %s AND user_id = %s", (tx_id, user_id))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Slettet"}

@router.put("/{tx_id}", response_model=Transaction)
def update_transaction(tx_id: str, tx: TransactionCreate, user_id: str = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        UPDATE transactions
        SET ticker=%s, trade_type=%s, shares=%s, price=%s, trade_date=%s
        WHERE id=%s AND user_id=%s
        RETURNING *""",
        (tx.ticker.upper(), tx.trade_type, tx.shares, tx.price, tx.trade_date, tx_id, user_id)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Transaksjon ikke funnet")
    return row
