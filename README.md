# 📘 RAG-Based Intelligent Q&A System (PDF Question Answering)

A full-stack **Retrieval-Augmented Generation (RAG)** based Intelligent Question & Answering system that enables users to upload PDF documents and ask natural-language questions.  
The system retrieves relevant information from the document using **semantic search** and generates accurate, context-aware answers using **Hugging Face language models**.

---

## 🔍 Project Overview

This project demonstrates a real-world implementation of a **RAG pipeline**, combining document retrieval with generative AI.  
Unlike traditional chatbots, all answers are **strictly grounded in the uploaded PDF**, which significantly reduces hallucinations and improves reliability.

The application is designed to be **portfolio-ready**, **interview-ready**, and aligned with **industry best practices** in Generative AI engineering.

---

## 🎯 Key Features

- 📄 Upload and index PDF documents  
- 🔎 Semantic search using vector embeddings  
- 🤖 Context-aware answer generation using Hugging Face LLMs  
- 🧠 Retrieval-Augmented Generation (RAG) architecture  
- 💬 Professional chat-style user interface  
- 🚫 Prevents answers outside document scope  
- ⚙️ Modular and scalable backend design  

---

## 🧠 How It Works (RAG Pipeline)

1. User uploads a PDF document from the frontend  
2. Backend extracts and splits text into overlapping chunks  
3. Text chunks are converted into vector embeddings  
4. Embeddings are stored in a FAISS vector database  
5. User asks a natural-language question  
6. Relevant chunks are retrieved using semantic similarity search  
7. Retrieved context is passed to the language model  
8. The model generates a grounded answer based on the document  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Vite  
- Tailwind CSS  

### Backend
- FastAPI  
- Uvicorn  

### AI & Data
- Hugging Face (FLAN-T5)  
- LangChain  
- FAISS (Vector Database)  
- Sentence-Transformers (all-MiniLM-L6-v2)  
- PyPDF  

### Environment
- Python 3.11  

---

## 📂 Project Structure

