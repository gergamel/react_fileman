from flask import Flask, jsonify, request, send_file, send_from_directory, flash, redirect, url_for
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import secrets
from pathlib import Path
import binascii
import dataclasses as dc
import simplejson as json

from dotenv import load_dotenv
load_dotenv()
import db, db.files

app = Flask(__name__, static_url_path='', static_folder='./build')

# CORS implemented so that we don't get errors when trying to access the server from a different server location
CORS(app)

app.config["FILEDB_FOLDER"] = "./.files"
app.secret_key = secrets.token_hex(16)

tempdir = Path(app.config["FILEDB_FOLDER"])
tempdir.mkdir(parents=True, exist_ok=True)
con = db.connect(tempdir)
#file.db.flush(con)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

@app.route('/api/files')
def api_files():
    rows = db.files.get_all(con)
    #print(rows)
    return jsonify([row.astuple() for row in rows])
    #return json.dumps([row.astuple() for row in rows])

@app.route('/api/upload', methods=['POST'])
def api_upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file:
            meta = db.files.process_file_upload(con, file, filename=secure_filename(file.filename), content_type=file.content_type)
            return jsonify(meta.astuple())

@app.route('/api/file/contents/<id>', methods=['GET'])
def file_contents(id:str):
    digest = binascii.unhexlify(id)
    meta = db.files.get(con,digest)
    if meta is not None:
        target = Path(os.path.join(app.config['FILEDB_FOLDER'], id))
        print(meta)
        return send_file(target,
            as_attachment=False,
            download_name=meta.Name,
            attachment_filename=meta.Name,
            mimetype=meta.ContentType)

# @app.route('/files')
# def all_files():
#     #cur=con.cursor()
#     #cur.execute(f'SELECT "Digest","ContentType","Size","Name","Category" FROM "Files" ORDER BY "Name"')
#     #rows = cur.fetchall()
#     #print(rows)
#     #rows = (FileMeta(row[0],row[1],row[2],row[3]) for row in cur)
#     rows = db.files.get_all(con)
#     result = f'''
#     <!doctype html>
#     <head>
#     <link href="/static/css/2.0a9ec390.chunk.css" rel="stylesheet"><link href="/static/css/main.d4f31fe3.chunk.css" rel="stylesheet">
#     </head>
#     <title>Files</title>
#     <body height="100vh">
#         <div class="container">
#         <h1>Files</h1>
#         <table class="table table-sm">
#             <thead>
#                 <tr>
#                     <th>Bytes</th>
#                     <th>ContentType</th>
#                     <th>Category</th>
#                     <th>Filename</th>
#                 </tr>
#             </thead>'''
#     for meta in rows:
#         result += f'''
#             <tr>
#                 <td class="small">{meta.Size}</td>
#                 <td class="small">{meta.ContentType}</td>
#                 <td class="small">{meta.Category}</td>
#                 <td class="small"><a href="{url_for('file', id=meta.Digest.hex())}">{meta.Name}</a></td>
#             </tr>'''
#     result += f'''
#         </table>
#         <form method=post enctype=multipart/form-data action="{url_for('file_upload')}">
#             <div class="row g-3 align-items-center">
#                 <div class="col-auto"><b>New File</b></div>
#                 <div class="col-auto"><input class="form-control" type="file" name="file"></div>
#                 <div class="col-auto"><input class="btn btn-primary" type="submit" value="Upload"></div>
#             </div>
#         </form>
#         </div>
#     </body>
#     '''
#     return result

# @app.route('/upload', methods=['GET', 'POST'])
# def file_upload():
#     if request.method == 'POST':
#         # check if the post request has the file part
#         if 'file' not in request.files:
#             flash('No file part')
#             return redirect(request.url)
#         file = request.files['file']
#         # If the user does not select a file, the browser submits an
#         # empty file without a filename.
#         if file.filename == '':
#             flash('No selected file')
#             return redirect(request.url)
#         if file:
#             meta = db.files.process_file_upload(con, file, filename=secure_filename(file.filename), content_type=file.content_type)
#             return redirect(url_for('file', id=meta.Digest.hex()))
#     #if request.method == 'GET':
#     return f'''
#         <!doctype html>
#         <head>
#         <link href="/static/css/2.0a9ec390.chunk.css" rel="stylesheet"><link href="/static/css/main.d4f31fe3.chunk.css" rel="stylesheet">
#         </head>
#         <title>Upload new File</title>
#         <h1>Upload new File</h1>
#         <form method=post enctype=multipart/form-data action="{url_for('file_upload')}">
#             <input type=file name=file>
#             <input type=submit value=Upload>
#         </form>
#         '''

# @app.route('/file/<id>', methods=['GET', 'POST'])
# def file(id:str):
#     if request.method == 'GET':
#         if id!='new':
#             digest = binascii.unhexlify(id)
#             meta = db.files.get(con,digest)
#             if meta is not None:
#                 print(meta)
#                 return f'''
#                 <!doctype html>
#                 <head>
#                 <link href="/static/css/2.0a9ec390.chunk.css" rel="stylesheet"><link href="/static/css/main.d4f31fe3.chunk.css" rel="stylesheet">
#                 </head>
#                 <title>{meta.Name}</title>
#                 <body height="100vh">
#                     <ul>
#                         <li><b>Name:</b> {meta.Name}</li>
#                         <li><b>ContentType:</b> {meta.ContentType}</li>
#                         <li><b>Size:</b> {meta.Size}</li>
#                         <li><b>Digest:</b> {id}</li>
#                         <li><b>Download:</b> <a href="{url_for('file_contents', id=id)}">{meta.Name}</a></li>
#                     </ul>
#                     <object data="{url_for('file_contents', id=id)}" type="{meta.ContentType}" style="width:100%;height:100vh;">
#                     </object>
#                 </body>
#                 '''