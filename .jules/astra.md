## 2024-08-13 - Graceful Fallbacks in Promise.all AI Aggregations
**Learning:** Throwing errors in individual AI service calls (like anomaly detection or insights) without a catch block destroys the entire `Promise.all` result, leading to complete failure of aggregated dashboard components even when other calls succeed. In this case, `getAnomalyDetection` throwing on malformed JSON or timeout destroyed `getMarketOverview`.
**Action:** Always wrap concurrent AI calls in timeouts and ensure they return typed graceful fallback objects instead of throwing errors directly, preserving partial state for the UI.

## 2024-08-16 - Safe JSON Parsing Prevents React UI Crashes
**Learning:** Blindly casting JSON.parse results to an expected type (like an array) can cause React components to crash completely if the model returns a different structure (e.g. `assets.map is not a function`). This happens even if a responseSchema is provided, as models can still occasionally output non-conforming shapes or error strings.
**Action:** Always validate the structural shape of a parsed AI response (e.g. `Array.isArray()`) before casting and returning it. Throwing a safe, expected error here allows the calling UI to trigger a graceful fallback state instead of crashing.
