import { useEffect, useRef, useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Upload a PDF to begin." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfReady, setPdfReady] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const uploadPDF = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(20);
    setPdfReady(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "ready") {
        setProgress(100);
        setPdfReady(true);
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "✅ PDF uploaded & indexed. Ask your question!" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `❌ Upload failed: ${data.error}` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Backend not reachable. Is server running?" },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!input.trim() || !pdfReady) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/ask?question=${encodeURIComponent(input)}`
      );
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Backend not responding" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl h-[90vh] bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        <div className="px-6 py-4 bg-white/30 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">🤖 RAG Q&A Assistant</h1>
          <label className="cursor-pointer bg-indigo-600 px-4 py-2 rounded-xl">
            Upload PDF
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => uploadPDF(e.target.files[0])}
            />
          </label>
        </div>

        {uploading && (
          <div className="px-6 py-3">
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block px-4 py-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-white">AI is thinking…</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-white/30 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!pdfReady}
            placeholder={pdfReady ? "Ask from PDF…" : "Upload PDF first"}
            className="flex-1 px-4 py-3 rounded-xl"
          />
          <button
            onClick={askQuestion}
            disabled={!pdfReady}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
