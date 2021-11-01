from .db import Connection
import io
import dataclasses as dc
import datetime as dt
import hashlib
import magic
import shutil

@dc.dataclass
class FileMeta():
    """
    CREATE TABLE IF NOT EXISTS "Files" (
        "Digest"        BYTEA PRIMARY KEY,
        "ContentType"   VARCHAR(127),   -- https://stackoverflow.com/questions/19852/maximum-length-of-a-mime-content-type-header-field
        "Size"          INTEGER,
        "Name"          VARCHAR(255),   -- https://serverfault.com/questions/9546/filename-length-limits-on-linux
        "Created"       TIMESTAMP NOT NULL,
        "Category"      TEXT
    );
    """
    Digest:str
    ContentType:str
    Size:int
    Name:str
    Created:dt.datetime
    Category:str
    def astuple(self):
        return (self.Digest.hex(),self.ContentType,self.Size,self.Name,self.Created.timestamp(),self.Category)

def get_all(con:Connection):
    cur = con.cursor()
    cur.execute(f'SELECT "Digest","ContentType","Size","Name","Created","Category" FROM "Files"')
    #rows = cur.fetchall()
    #print(rows)
    return (FileMeta(*row) for row in cur)

def get(con:Connection, digest:bytes):
    cur = con.cursor()
    cur.execute(f'SELECT "Digest","ContentType","Size","Name","Created","Category" FROM "Files" WHERE "Digest"={con.QP}', (digest,))
    rows = cur.fetchall()
    #print(rows)
    if len(rows)!=1:
        return None
    return FileMeta(*rows[0])

def process_file_upload(con:Connection, data:io.BytesIO, filename:str, content_type:str, category:str="Temp")->FileMeta:
    BLOCK_SIZE = 65536
    h = hashlib.sha256()
    mimetype = None
    while True:
        buf = data.read(BLOCK_SIZE)
        if len(buf)==0:
            break
        if mimetype is None:
            mimetype = magic.from_buffer(buf, mime=True)
        h.update(buf) # Update the hash
    filesize = data.tell()
    data.seek(0,0)
    if content_type!=mimetype:
        print(f"[NEW UPLOAD] Changing content_type to magic inferred {mimetype} (was {content_type})")
        content_type=mimetype

    meta = FileMeta(Digest=h.digest(),ContentType=content_type,Size=filesize,Name=filename,Created=dt.datetime.utcnow(), Category=category)
    print(f"[NEW UPLOAD] {meta.ContentType},{meta.Size},{meta.Digest.hex()},{meta.Name}")
    target = con.FILEDB_STORE_ROOT.joinpath(meta.Digest.hex())
    if not target.exists():
        with open(target,'wb') as f:
            shutil.copyfileobj(data,f)
    cur=con.cursor()
    cur.execute(
        f"""INSERT INTO "Files" ("ContentType", "Size", "Name", "Digest", "Created", "Category") VALUES ({con.QP}, {con.QP}, {con.QP}, {con.QP}, {con.QP}, {con.QP})""",
        (meta.ContentType, meta.Size, meta.Name, meta.Digest, meta.Created, meta.Category)
    )
    con.commit()
    return meta