## 2024-08-13 - Graceful Fallbacks in Promise.all AI Aggregations
**Learning:** Throwing errors in individual AI service calls (like anomaly detection or insights) without a catch block destroys the entire `Promise.all` result, leading to complete failure of aggregated dashboard components even when other calls succeed. In this case, `getAnomalyDetection` throwing on malformed JSON or timeout destroyed `getMarketOverview`.
**Action:** Always wrap concurrent AI calls in timeouts and ensure they return typed graceful fallback objects instead of throwing errors directly, preserving partial state for the UI.

## 2024-08-15 - Enforcing Graceful Fallbacks in Promise.all AI Aggregations
**Learning:** Enforcing the previous learning, throwing errors in individual AI service calls without a catch block destroys the entire `Promise.all` result, leading to complete failure of aggregated components. In this case, `getMarketNews` throwing an error destroyed `getStockSWOT` in the Research page.
**Action:** Always wrap concurrent AI calls in timeouts and ensure they return typed graceful fallback objects instead of throwing errors directly, preserving partial state for the UI.
