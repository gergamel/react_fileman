import sqlite3
import psycopg
import os
import typing
from pathlib import Path

Connection=typing.Union[sqlite3.Connection,psycopg.Connection]

def connect(root:Path,engine:str='psycopg')->Connection:
    if type(root) is str:
        root=Path(root)
    else:
        root=root
    if engine=='sqlite3':
        db_file = root.joinpath('.db')
        print(f"[DB {engine}] connecting (file {db_file})...")
        #sqlite3.Connection.QP = "?" # sqlite uses ?
        con = sqlite3.connect(db_file, check_same_thread=False)
    if engine=='psycopg':
        DB_HOST = os.getenv('PGHOST')
        DB_NAME = os.getenv('PGDATABASE')
        DB_USER = os.getenv('PGUSER')
        DB_PASS = os.getenv('PGPASSWORD')
        print(f"[DB {engine}] connecting ({DB_USER}@{DB_HOST},{DB_NAME})...")
        con = psycopg.connect()
        con.QP = "%s" # psycopg uses %s is sql query strings to denote paramaters
    con.FILEDB_STORE_ROOT = root
    from .files import FileMeta
    cur = con.cursor()
    cur.execute(FileMeta.__doc__)
    con.commit()
    return con

# def flush(con:Connection):
#     cur = con.cursor()
#     cur.execute("""DROP TABLE IF EXISTS "Files";""")
#     cur.execute("""DROP TABLE IF EXISTS "FileStorage";""")
#     cur.execute(FileMeta.__doc__)
#     con.commit()
#     cur.close()




