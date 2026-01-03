from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline
import os

MAX_CONTEXT_CHARS = 1200  # 🔥 model-safe limit

def answer_question(question: str) -> str:
    if not os.path.exists("faiss_index"):
        return "❗ Please upload a PDF first."

    # ✅ Auto-expand very short queries
    if len(question.split()) <= 2:
        question = f"Explain {question} in detail based on the document."

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    db = FAISS.load_local(
        "faiss_index",
        embeddings,
        allow_dangerous_deserialization=True
    )

    docs = db.similarity_search(question, k=4)

    if not docs:
        return "Not available in the document."

    # ✅ Build SAFE context
    context = ""
    for doc in docs:
        if len(context) < MAX_CONTEXT_CHARS:
            context += doc.page_content + "\n"
        else:
            break

    context = context.strip()

    if len(context) < 100:
        return "Not available in the document."

    prompt = f"""
Answer the question ONLY using the document context below.
If the answer is not present, say "Not available in the document".

Document Context:
{context}

Question:
{question}

Answer:
"""

    hf_pipeline = pipeline(
        "text2text-generation",
        model="google/flan-t5-base",
        max_new_tokens=200
    )

    llm = HuggingFacePipeline(pipeline=hf_pipeline)

    # ✅ Correct modern call
    answer = llm.invoke(prompt)

    if not answer or len(answer.strip()) < 10:
        return "Not available in the document."

    return answer.strip()
