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
**Learning:** Returning unvalidated JSON parsing output directly without timeouts or fallbacks risks complete UI failure when the AI service hangs or returns malformed data for the `getInvestmentIdeas` feature. If the UI component (like `MarketIntelligence`) swallows the error without rendering it, this leads to a silent failure.
**Action:** Enforce strict structural validations, ensure a 15-second timeout wrapper, and implement a reliable default object fallback matching the expected return type instead of throwing raw API exceptions.

## 2025-02-28 - Investment Ideas Resilience Improvements
**Learning:** Returning unvalidated JSON parsing output directly without timeouts or fallbacks risks complete UI failure when the AI service hangs or returns malformed data for the `getInvestmentIdeas` feature.
**Action:** Enforce strict structural validations, ensure a 15-second timeout wrapper, and implement a reliable default object fallback instead of throwing raw API exceptions.

## 2025-02-28 - Model Portfolio Analysis Resilience Improvements
**Learning:** Returning unvalidated JSON parsing output directly without timeouts or fallbacks risks complete UI failure when the AI service hangs or returns malformed data for the `getModelPortfolioAnalysis` feature.
**Action:** Enforce strict structural validations, ensure a 15-second timeout wrapper, and implement a reliable default object fallback matching `ModelPortfolioAnalysis` instead of throwing raw API exceptions.
## 2025-02-28 - Preventing Silent UI Failures in String-Returning AI Calls
**Learning:** Throwing raw errors for unguarded string-returning AI calls (like `compareStocks`) can cause silent failures in the UI if the calling component catches the error but doesn't display any error message to the user, resulting in a blank section.
**Action:** Always wrap concurrent AI calls in timeouts and ensure they return a graceful fallback string instead of throwing errors directly when the UI expects a string and does not handle errors explicitly.

## 2024-05-18 - Graceful Fallbacks for String-Returning AI Endpoints
**Learning:** String-returning AI endpoints without structured schemas can still cause silent UI failures (e.g. blank or empty sections) or crash Promise.all() concurrency if they throw raw errors on network or AI failure.
**Action:** Always wrap AI calls in `withTimeout()` and return a descriptive fallback string (e.g., "Feature currently unavailable") in the catch block rather than throwing errors, especially in concurrent loading scenarios.
## 2025-02-28 - Item-Level Validation for AI Array Outputs
**Learning:** Checking `Array.isArray()` is necessary but not sufficient for AI responses that return lists of objects. If the array contains malformed items (e.g., missing required fields like `confidenceScore` or `action`), mapping over these items in a React component and accessing those fields (like `.toFixed(0)`) will cause the UI to crash entirely.
**Action:** Always validate the structure and types of the individual items within an array before casting and returning it. Throw an error if an item is malformed so the UI can gracefully catch and handle it instead of crashing.

## 2026-08-31 - Item-Level Type Checking for AI Array Fields
**Learning:** Checking `Array.isArray()` is necessary but not sufficient for nested AI array fields (e.g., `tickers` or `strengths`). If a model incorrectly returns objects or numbers instead of strings within the array, passing these to React components expecting strings can cause complete UI crashes (like "Objects are not valid as a React child").
**Action:** Always strictly validate the types of individual items within AI array outputs (e.g., using a custom `isArrayOfStrings` helper) before returning the parsed object, to ensure graceful fallback instead of rendering crashes.

## 2025-02-28 - Validate Enum Fields in AI JSON Outputs
**Learning:** Checking the types of properties (e.g., `typeof parsed.title === 'string'`) is not sufficient for fields that have specific enum values in TypeScript (like `'critical' | 'warning' | 'info'`). If an AI model hallucinated a different string or if the field is missing entirely, returning it unvalidated could cause React components to crash or break styling logic that depends on those exact enum values.
**Action:** Always explicitly validate enum properties using `.includes()` against the allowed values before casting and returning parsed AI JSON output, to ensure a graceful fallback is triggered on malformed responses.

## 2026-09-11 - Mitigating Prompt Injection in Grounded Insights
**Learning:** Passing raw user input directly as the `contents` of an AI API call leaves the system vulnerable to prompt injection, where the user can command the model to ignore its purpose and perform unauthorized actions or output off-topic responses.
**Action:** When constructing AI prompts with raw user input, always wrap the input within a prompt template (e.g., using `<user_query>` tags) and explicitly define the persona/role using the `systemInstruction` config field to enforce boundaries and prevent off-topic responses.

## 2026-09-14 - Mitigating Prompt Injection in Risk Scenarios
**Learning:** Passing raw user input directly as the `contents` of an AI API call leaves the system vulnerable to prompt injection in the `analyzeRiskScenario` feature, allowing a user to break the AI out of its expected financial analyst constraints.
**Action:** Always wrap the user input (like `<scenario>...</scenario>`) and add `systemInstruction: FINAI_SYSTEM_PROMPT` to the API configuration to strictly enforce the FinAI persona.
## 2026-09-23 - Mitigating Prompt Injection in Client Reports
**Learning:** Passing raw user input directly as the `contents` of an AI API call leaves the system vulnerable to prompt injection in the `generateReportSummary` feature, where inputs like `clientName` or `reportType` could be manipulated to bypass the intended task and extract internal instructions or generate off-topic responses.
**Action:** Always wrap the user input (e.g., `<client_details>...</client_details>`) and add `systemInstruction: FINAI_SYSTEM_PROMPT` to the API configuration to strictly enforce the AI persona boundaries and safely encapsulate the data.
## 2026-10-01 - Mitigating Prompt Injection in Client Risk Profiles
**Learning:** Passing raw user input directly as the `contents` of an AI API call leaves the system vulnerable to prompt injection in the `getClientRiskProfileSummary` feature, allowing a user to break the AI out of its expected financial advisor constraints by providing malicious input in fields like `investmentGoals`.
**Action:** Always wrap the user input (like `<client_profile>...</client_profile>`) and add `systemInstruction: FINAI_SYSTEM_PROMPT` to the API configuration to strictly enforce the AI persona boundaries and prevent prompt injection.
## 2026-09-26 - Mitigating Prompt Injection in Compliance Remediation
**Learning:** Passing raw input directly as the `contents` of an AI API call leaves the system vulnerable to prompt injection in the `getComplianceRemediation` feature, allowing a user to break the AI out of its expected compliance expert constraints by providing malicious input in fields like `rule` or `details`.
**Action:** Always wrap the user input (like `<compliance_check>...</compliance_check>`) and add `systemInstruction: FINAI_SYSTEM_PROMPT` to the API configuration to strictly enforce the AI persona boundaries and prevent prompt injection.
