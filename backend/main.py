from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ingest import ingest_pdf
from rag import answer_question
import shutil
import os

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        with open("data.pdf", "wb") as f:
            shutil.copyfileobj(file.file, f)

        ingest_pdf("data.pdf")

        if not os.path.exists("faiss_index"):
            return {"status": "failed", "error": "FAISS index not created"}

        return {"status": "ready"}

    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/ask")
def ask(question: str):
    return {"answer": answer_question(question)}
