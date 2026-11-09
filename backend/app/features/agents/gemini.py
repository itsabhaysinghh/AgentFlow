"""Backend-only Gemini client. API credentials never cross this boundary."""
import time
import httpx
from app.core.config import settings

class GeminiError(Exception):
    pass

def available_models() -> list[str]:
    if not settings.GEMINI_API_KEY:
        raise GeminiError("Gemini is not configured on the server.")
    response = httpx.get("https://generativelanguage.googleapis.com/v1beta/models", params={"key": settings.GEMINI_API_KEY}, timeout=20)
    if response.is_error:
        raise GeminiError("Gemini model discovery failed.")
    return [item["name"].removeprefix("models/") for item in response.json().get("models", []) if "generateContent" in item.get("supportedGenerationMethods", [])]

def generate(*, model: str, system_prompt: str, prompt: str, temperature: float) -> dict:
    if not settings.GEMINI_API_KEY:
        raise GeminiError("Gemini is not configured on the server.")
    started = time.perf_counter()
    payload = {"system_instruction": {"parts": [{"text": system_prompt}]}, "contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": {"temperature": temperature}}
    response = httpx.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", params={"key": settings.GEMINI_API_KEY}, json=payload, timeout=60)
    if response.is_error:
        raise GeminiError("Gemini could not complete this request. Check the selected model and server credential.")
    data = response.json()
    text = "".join(part.get("text", "") for candidate in data.get("candidates", []) for part in candidate.get("content", {}).get("parts", []))
    if not text:
        raise GeminiError("Gemini returned no generated text.")
    usage = data.get("usageMetadata", {})
    return {"output": text, "duration_seconds": round(time.perf_counter() - started, 3), "input_tokens": usage.get("promptTokenCount"), "output_tokens": usage.get("candidatesTokenCount")}
