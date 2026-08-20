## 2024-08-13 - Graceful Fallbacks in Promise.all AI Aggregations
**Learning:** Throwing errors in individual AI service calls (like anomaly detection or insights) without a catch block destroys the entire `Promise.all` result, leading to complete failure of aggregated dashboard components even when other calls succeed. In this case, `getAnomalyDetection` throwing on malformed JSON or timeout destroyed `getMarketOverview`.
**Action:** Always wrap concurrent AI calls in timeouts and ensure they return typed graceful fallback objects instead of throwing errors directly, preserving partial state for the UI.

## 2024-08-15 - Enforcing Graceful Fallbacks in Promise.all AI Aggregations
**Learning:** Enforcing the previous learning, throwing errors in individual AI service calls without a catch block destroys the entire `Promise.all` result, leading to complete failure of aggregated components. In this case, `getMarketNews` throwing an error destroyed `getStockSWOT` in the Research page.
**Action:** Always wrap concurrent AI calls in timeouts and ensure they return typed graceful fallback objects instead of throwing errors directly, preserving partial state for the UI.
## 2024-08-16 - Safe JSON Parsing Prevents React UI Crashes
**Learning:** Blindly casting JSON.parse results to an expected type (like an array) can cause React components to crash completely if the model returns a different structure (e.g. `assets.map is not a function`). This happens even if a responseSchema is provided, as models can still occasionally output non-conforming shapes or error strings.
**Action:** Always validate the structural shape of a parsed AI response (e.g. `Array.isArray()`) before casting and returning it. Throwing a safe, expected error here allows the calling UI to trigger a graceful fallback state instead of crashing.
## 2024-08-17 - Portfolio Doctor Analysis Resilience Improvements
**Learning:** Returning unvalidated JSON parsing output directly without timeouts or fallbacks risks complete UI failure when the AI service hangs or returns malformed data (like missing required fields) for the `getPortfolioDoctorAnalysis` feature.
**Action:** Enforce strict structural validations, ensure a 15-second timeout wrapper, and implement a reliable default object fallback matching `PortfolioDoctorReport` instead of throwing raw API exceptions.
## 2025-02-28 - Risk Scenario Analysis Resilience Improvements
**Learning:** Returning unvalidated JSON parsing output directly without timeouts or fallbacks risks complete UI failure when the AI service hangs or returns malformed data for the `analyzeRiskScenario` feature.
**Action:** Enforce strict structural validations, ensure a 15-second timeout wrapper, and implement a reliable default object fallback matching `ScenarioAnalysisResult` instead of throwing raw API exceptions.

## 2025-02-28 - Investment Ideas Resilience Improvements
**Learning:** Returning unvalidated JSON parsing output directly without timeouts or fallbacks risks complete UI failure when the AI service hangs or returns malformed data for the `getInvestmentIdeas` feature.
**Action:** Enforce strict structural validations, ensure a 15-second timeout wrapper, and implement a reliable default object fallback instead of throwing raw API exceptions.
