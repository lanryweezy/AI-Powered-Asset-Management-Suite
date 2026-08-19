
import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";
import { PortfolioAsset, OptimizationSuggestion, ComplianceCheck, ScenarioAnalysisResult, GroundedInsight, GroundingChunk, RiskProfile, PortfolioDoctorReport, SWOTAnalysis, Stock, ModelPortfolio, ModelPortfolioAnalysis } from '../types.ts';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock API key. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_api_key" });

const useMock = !process.env.API_KEY || process.env.API_KEY === "mock_api_key";

// AI Quality Insight: Wrap AI calls in timeout to prevent hanging UI
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`AI Request timed out after ${ms}ms`)), ms)
        )
    ]);
};

export const getPortfolioOptimization = async (assets: PortfolioAsset[]): Promise<OptimizationSuggestion[]> => {
    if (useMock) {
         return Promise.resolve([
            { ticker: "DANGCEM", action: "HOLD", reasoning: "Strong market leader in cement, but facing some FX headwinds.", confidenceScore: 0.80 },
            { ticker: "MTNN", action: "BUY", reasoning: "Dominant player in telecom, strong data revenue growth.", confidenceScore: 0.90 },
            { ticker: "GTCO", action: "HOLD", reasoning: "Solid bank, but affected by broader economic uncertainty.", confidenceScore: 0.75 },
        ]);
    }

    const prompt = `Analyze the following investment portfolio of Nigerian stocks and provide optimization suggestions. For each stock, suggest whether to 'BUY', 'SELL', or 'HOLD', provide a brief reasoning relevant to the Nigerian market, and a confidence score between 0 and 1. Portfolio: ${JSON.stringify(assets.map(a => ({ ticker: a.ticker, value: a.value, allocation: a.allocation })))}`;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                ticker: { type: Type.STRING },
                action: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] },
                reasoning: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER }
            },
            required: ['ticker', 'action', 'reasoning', 'confidenceScore']
        }
    };

    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }), 15000);

        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText);

        // AI Quality Insight: Validate expected shape before casting to prevent UI crashes like React .map() errors
        if (!Array.isArray(suggestions)) {
            throw new Error("AI output was not an array");
        }
        return suggestions as OptimizationSuggestion[];

    } catch (error) {
        console.error("Error fetching portfolio optimization:", error);
        throw new Error("Failed to get AI-powered optimization suggestions.");
    }
};


export const getAnalyticsInsight = async (chartName: string, data: any): Promise<string> => {
     if (useMock) {
        return Promise.resolve("This is a mock analysis. The model indicates a strong positive trend based on the provided data, with key indicators pointing towards sustained growth. However, watch for potential market corrections in the next quarter.");
    }
    const prompt = `You are a financial analyst. Provide a brief, insightful summary for a chart titled "${chartName}". The data for the chart is: ${JSON.stringify(data)}. Keep it concise and professional.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch(error) {
        console.error(`Error fetching analytics insight for ${chartName}:`, error);
        return "Could not load AI analysis."
    }
};

export const getMarketOverview = async (assets: PortfolioAsset[]): Promise<string> => {
    if (useMock) {
        return Promise.resolve("The Nigerian stock market shows moderate gains today, driven by strong performance in the telecommunications sector, particularly MTNN. Financial stocks like GTCO remain stable despite some profit-taking. Investors are closely watching inflation figures to be released later this week.");
    }
    const prompt = `You are a financial analyst. Provide a brief, insightful summary of the current Nigerian stock market, especially concerning the following assets: ${assets.map(a => a.ticker).join(', ')}. Mention any recent trends or news affecting these stocks or their sectors. Keep it concise (2-3 sentences) and professional for a dashboard market overview.`;
    
    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        }), 8000);
        return response.text;
    } catch(error) {
        console.error(`Error fetching market overview:`, error);
        // AI Quality Insight: Return graceful fallback instead of breaking UI
        return "Could not load AI-powered market overview."
    }
};

export const getComplianceRemediation = async (check: ComplianceCheck): Promise<string> => {
    if (useMock) {
        return Promise.resolve("### Remediation Plan:\n\n**1. Identify Overweight Assets:**\n   - Review the portfolio to identify the specific unquoted securities causing the breach of the 5% limit.\n\n**2. Develop a Divestment Strategy:**\n   - Formulate a plan to reduce the holding of these assets below the 5% threshold. This may involve partial or full liquidation.\n\n**3. Rebalance the Portfolio:**\n   - Reinvest the proceeds from the divestment into compliant assets to ensure the portfolio adheres to all PENCOM guidelines.");
    }

    const prompt = `As a compliance expert for a Nigerian asset management firm, provide a concise, actionable remediation plan for the following failed compliance check.
    - **Failed Rule:** "${check.rule}"
    - **Details:** "${check.details}"
    
    Structure your response with clear, numbered steps. Use markdown for formatting.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching compliance remediation:", error);
        return "Failed to load AI remediation suggestion.";
    }
};

export const generateReportSummary = async (clientName: string, reportType: string, reportingPeriod: string, assets: PortfolioAsset[]): Promise<string> => {
    if (useMock) {
        return Promise.resolve(`This summary for **${clientName}**'s **${reportType}** for the period of **${reportingPeriod}** highlights a period of steady growth. The portfolio saw a significant uptick in the Telecommunications sector, driven by MTNN's strong performance. While the Industrials sector faced minor headwinds, the overall portfolio remains well-positioned for future growth. Our strategy of maintaining a diversified allocation across key sectors of the Nigerian economy continues to yield positive results. We remain optimistic about the upcoming quarter.`);
    }

    const prompt = `You are a professional financial advisor for a Nigerian asset management firm. Your client's name is ${clientName}.
    You are writing a summary for their "${reportType}" for the period "${reportingPeriod}".
    Based on their portfolio, which consists of these assets: ${JSON.stringify(assets.map(a => ({ ticker: a.ticker, value: a.value, change: a.change, sector: a.sector })))}, please write a brief, professional, and encouraging summary for the client.
    Keep it to 3-4 sentences. Use markdown for bolding key terms.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating report summary:", error);
        return "Failed to load AI-generated summary.";
    }
};


export const startChat = (): Chat => {
    if (useMock) {
        // This is a mock chat for environments without an API key
        return {
            sendMessage: async (request: any) => {
                 const response: GenerateContentResponse = {
                    text: "This is a mock response as the API key is not configured. Please ask your administrator to set up the API key.",
                    candidates: [],
                    usageMetadata: { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0},
                    data: undefined,
                    functionCalls: undefined,
                    executableCode: undefined,
                    codeExecutionResult: undefined,
                 }
                 return response;
            },
            sendMessageStream: async function* (request: any) {
                const mockResponse = "This is a mock response as the API key is not configured. Please ask your administrator to set up the API key.";
                for (const word of mockResponse.split(" ")) {
                    yield {
                        text: word + " ",
                        candidates:[],
                        usageMetadata: { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0},
                        data: undefined,
                        functionCalls: undefined,
                        executableCode: undefined,
                        codeExecutionResult: undefined,
                    };
                    await new Promise(res => setTimeout(res, 50));
                }
            }
        } as unknown as Chat;
    }

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful AI assistant for a financial asset management platform focused on the Nigerian market. Your name is "FinAI". Be concise and professional. You can answer questions about portfolio data, market trends, and general financial concepts related to Nigeria.',
        }
    });
};

export const getRiskSummary = async (assets: PortfolioAsset[]): Promise<string> => {
    if (useMock) {
        return Promise.resolve("The portfolio's current risk profile is moderate, primarily driven by a significant allocation to the Financials sector, which exhibits higher volatility. The Telecommunications holding (MTNN) provides a stabilizing effect due to its lower market correlation. Diversification into less correlated sectors could further mitigate overall risk.");
    }
    const prompt = `You are a financial risk analyst. Provide a brief, qualitative summary of the risk profile for the following investment portfolio. Highlight the main drivers of risk (e.g., sector concentration, high volatility assets) and any mitigating factors. Portfolio: ${JSON.stringify(assets.map(a => ({ ticker: a.ticker, allocation: a.allocation, riskScore: a.riskScore, volatility: a.volatility, sector: a.sector })))}. Keep it concise (2-4 sentences) and professional.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch(error) {
        console.error(`Error fetching risk summary:`, error);
        return "Could not load AI-powered risk summary."
    }
};


export const analyzeRiskScenario = async (assets: PortfolioAsset[], scenario: string): Promise<ScenarioAnalysisResult> => {
    if (useMock) {
        let estimatedImpact = 0;
        if (scenario.includes('Crash')) {
            estimatedImpact = -18.5;
        } else if (scenario.includes('Rally')) {
            estimatedImpact = 12.3;
        } else {
            estimatedImpact = -5.2;
        }
        return Promise.resolve({
            estimatedImpact,
            summary: `This is a mock analysis for the "${scenario}" scenario. Financial sector stocks like GTCO and ZENITHBANK would likely see the largest impact due to their high market correlation. Conversely, BUAFOODS may show more resilience as a consumer staple. The overall portfolio is expected to react in line with the broader market, but diversification helps cushion the blow.`
        });
    }

    const prompt = `Analyze the potential impact of the following economic scenario on an investment portfolio.
    **Scenario:** "${scenario}"
    **Portfolio:** ${JSON.stringify(assets.map(a => ({ ticker: a.ticker, value: a.value, sector: a.sector, volatility: a.volatility, marketCorrelation: a.marketCorrelation })))}
    
    Provide a quantitative estimate of the portfolio's percentage value change and a brief qualitative summary explaining which assets would be most affected and why.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            estimatedImpact: { 
                type: Type.NUMBER,
                description: 'The estimated percentage change in the total portfolio value. E.g., -15.5 for a 15.5% loss.' 
            },
            summary: { 
                type: Type.STRING,
                description: 'A brief summary (2-3 sentences) explaining the reasoning behind the impact assessment.' 
            },
        },
        required: ['estimatedImpact', 'summary']
    };

    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }), 15000);

        const jsonText = response.text.trim();

        // AI Quality Insight: Safe JSON parsing and structural validation
        try {
            const parsed = JSON.parse(jsonText);
            if (
                parsed &&
                typeof parsed.estimatedImpact === 'number' &&
                typeof parsed.summary === 'string'
            ) {
                return parsed as ScenarioAnalysisResult;
            }
            console.warn("Invalid output format from Risk Scenario Analysis");
        } catch (e) {
            console.error("Malformed AI output:", e);
        }

    } catch (error) {
        console.error("Error analyzing risk scenario:", error);
    }

    // AI Quality Insight: Return graceful fallback instead of throwing error
    return {
        estimatedImpact: 0,
        summary: "Analysis currently unavailable. Please try again later."
    };
};

export const getMarketNews = async (): Promise<GroundedInsight> => {
    if (useMock) {
        return Promise.resolve({
            text: "The Nigerian equities market closed on a positive note, with the All-Share Index (ASI) gaining 0.25%. This was driven by gains in banking stocks, particularly GTCO and Zenith Bank, following positive Q3 earnings announcements. However, the industrial sector saw some profit-taking in DANGCEM. Market turnover was moderate as investors await inflation data later this week.",
            sources: [
                { web: { uri: '#', title: 'Nigerian Bourse Ends Positive on Banking Sector Gains - Proshare' } },
                { web: { uri: '#', title: 'Investors Take Profit in Dangote Cement, Market Remains Bullish - Nairametrics' } },
            ]
        });
    }

    const prompt = `Provide a concise summary (3-4 sentences) of the latest news and key trends in the Nigerian stock market for today.`;

    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        }), 8000);
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingChunk[] = chunks
            .filter(c => c.web?.uri && c.web.title)
            .map(c => ({
                web: {
                    uri: c.web!.uri!,
                    title: c.web!.title!
                }
            }));
        return { text: response.text, sources };
    } catch (error) {
        console.error("Error fetching market news:", error);
        // AI Quality Insight: Return graceful fallback instead of throwing error which breaks Promise.all
        return {
            text: "Currently unable to reach the AI market news service. We will try again shortly.",
            sources: []
        };
    }
};

export const getGroundedInsight = async (query: string): Promise<GroundedInsight> => {
    if (useMock) {
        return Promise.resolve({
            text: `Regarding your query about "${query}", the outlook for the Nigerian banking sector remains cautiously optimistic. Analysts predict continued revenue growth from digital channels and loan books. However, potential headwinds include rising inflation, which could impact loan performance, and the upcoming regulatory changes by the CBN. Key banks to watch are GTCO for its digital innovation and UBA for its pan-African expansion.`,
            sources: [
                { web: { uri: '#', title: 'Nigerian Banking Sector Report Q4 2024 - Financial Times' } },
                { web: { uri: '#', title: 'CBN Announces New Capital Requirements for Banks - Central Bank of Nigeria' } },
            ]
        });
    }

    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
            },
        }), 8000);
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingChunk[] = chunks
            .filter(c => c.web?.uri && c.web.title)
            .map(c => ({
                web: {
                    uri: c.web!.uri!,
                    title: c.web!.title!
                }
            }));
        return { text: response.text, sources };
    } catch (error) {
        console.error("Error fetching grounded insight:", error);
        // AI Quality Insight: Return graceful fallback instead of throwing error which breaks Promise.all
        return {
            text: "Currently unable to reach the AI insight service. We will try again shortly.",
            sources: []
        };
    }
};

export const getAnomalyDetection = async (): Promise<{ title: string; details: string; level: 'critical' | 'warning' | 'info' }> => {
    if (useMock) {
        return Promise.resolve({
            title: "High Volatility in Financials",
            details: "Unusual trading volume detected in GTCO and ZENITHBANK. Potential market-moving news expected.",
            level: "warning",
        });
    }

    const prompt = `You are an AI Sentinel monitoring a portfolio of Nigerian stocks. Detect one potential anomaly, risk, or significant event from the market. Classify its severity as 'critical', 'warning', or 'info'. Provide a short title and a one-sentence detail.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            details: { type: Type.STRING },
            level: { type: Type.STRING, enum: ['critical', 'warning', 'info'] }
        },
        required: ['title', 'details', 'level']
    };

    try {
        // AI Quality Insight: 8s timeout to ensure dashboard insights don't hang Promise.all
        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }), 8000);
        const jsonText = response.text.trim();

        // AI Quality Insight: Safe JSON parsing
        try {
            const parsed = JSON.parse(jsonText);
            if (parsed && typeof parsed.title === 'string' && typeof parsed.details === 'string') {
                return parsed;
            }
            throw new Error("Invalid output format");
        } catch (e) {
            console.error("Malformed AI output:", e);
            // Fallthrough to fallback
        }
    } catch (error) {
        console.error("Error fetching anomaly detection:", error);
    }

    // AI Quality Insight: Graceful fallback instead of throwing error which breaks Promise.all
    return {
        title: "Anomaly Check Unavailable",
        details: "Currently unable to reach the AI anomaly detection service. We will try again shortly.",
        level: "info"
    };
}

export const getClientRiskProfileSummary = async (profile: RiskProfile): Promise<string> => {
    if (useMock) {
        return Promise.resolve(`This client has a **${profile.riskAppetite}** risk tolerance with a focus on **${profile.investmentGoals}** over a **${profile.investmentHorizon}** horizon. The behavioral score of **${profile.behavioralRiskScore.toFixed(2)}** suggests a disciplined investor, but they may be susceptible to loss aversion during market downturns. A balanced portfolio with a mix of equities and fixed income is recommended.`);
    }

    const prompt = `You are a financial advisor. Analyze the following client risk profile and provide a concise, professional summary (2-3 sentences).
    - Investment Goals: ${profile.investmentGoals}
    - Risk Appetite: ${profile.riskAppetite}
    - Investment Horizon: ${profile.investmentHorizon}
    - Behavioral Risk Score (0=calm, 1=panicked): ${profile.behavioralRiskScore.toFixed(2)}
    
    Synthesize this into a professional summary for an advisor to quickly understand the client's profile. Use markdown for bolding.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch(error) {
        console.error(`Error fetching client risk profile summary:`, error);
        return "Could not load AI-powered summary."
    }
};

export const getInvestmentIdeas = async (): Promise<{ title: string; reasoning: string; tickers: string[]; }> => {
     if (useMock) {
        return Promise.resolve({
            title: "Fintech Expansion in West Africa",
            reasoning: "Growing mobile penetration and a large unbanked population are driving significant growth in the fintech sector. Companies focused on payment processing and digital lending are well-positioned.",
            tickers: ["INTERSWITCH", "PAYSTACK", "FLUTTERWAVE"],
        });
    }
    const prompt = `You are a financial analyst specializing in emerging markets. Generate one new, actionable investment theme relevant to the current Nigerian or broader African market. Provide a title, a 1-2 sentence reasoning, and suggest 2-3 representative (real or plausible) stock tickers.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            tickers: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'reasoning', 'tickers']
    };

     try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }), 15000);
        const jsonText = response.text.trim();

        // AI Quality Insight: Safe JSON parsing and structural validation
        try {
            const parsed = JSON.parse(jsonText);
            if (
                parsed &&
                typeof parsed.title === 'string' &&
                typeof parsed.reasoning === 'string' &&
                Array.isArray(parsed.tickers)
            ) {
                return parsed;
            }
            console.warn("Invalid output format from Investment Ideas");
        } catch (e) {
            console.error("Malformed AI output:", e);
        }
    } catch (error) {
        console.error("Error fetching investment ideas:", error);
    }

    // AI Quality Insight: Return graceful fallback instead of throwing error which causes silent UI failure
    return {
        title: "Investment Ideas Unavailable",
        reasoning: "Currently unable to reach the AI insight service. We will try again shortly.",
        tickers: []
    };
};

export const getPortfolioDoctorAnalysis = async (assets: PortfolioAsset[]): Promise<PortfolioDoctorReport> => {
    if (useMock) {
        return Promise.resolve({
            overallScore: 78,
            summary: "This is a well-balanced portfolio with strong exposure to the Industrials and Telecom sectors. However, it is slightly overweight in Financials, which increases its correlation to local market volatility. There is an opportunity to improve diversification by adding assets from the Consumer Goods or Healthcare sectors.",
            positivePoints: [
                "Good allocation to market leaders like DANGCEM and MTNN.",
                "Portfolio has shown resilience in recent market conditions.",
                "Strong liquidity profile across most holdings."
            ],
            areasForImprovement: [
                "Reduce concentration in the Financials sector to mitigate risk.",
                "Consider adding a non-correlated asset class like a commodities ETF.",
                "The overall risk score is slightly higher than a typical 'Moderate' profile."
            ]
        });
    }

    const prompt = `You are an AI Portfolio Doctor. Analyze the following investment portfolio and provide a detailed health check. The portfolio is for a client with a 'Moderate' risk tolerance.
    Portfolio: ${JSON.stringify(assets.map(a => ({ ticker: a.ticker, value: a.value, allocation: a.allocation, sector: a.sector, riskScore: a.riskScore })))}
    
    Based on this data, provide a structured analysis in JSON format.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            overallScore: { 
                type: Type.INTEGER,
                description: "An overall portfolio health score from 0 to 100, where 100 is excellent."
            },
            summary: {
                type: Type.STRING,
                description: "A 2-3 sentence summary of the portfolio's health, mentioning its main strengths and weaknesses."
            },
            positivePoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-3 key strengths or positive aspects of the portfolio."
            },
            areasForImprovement: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-3 actionable suggestions for improving the portfolio's structure or risk profile."
            }
        },
        required: ['overallScore', 'summary', 'positivePoints', 'areasForImprovement']
    };

    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }), 15000);

        const jsonText = response.text.trim();

        // AI Quality Insight: Safe JSON parsing and structural validation
        try {
            const parsed = JSON.parse(jsonText);
            if (
                parsed &&
                typeof parsed.overallScore === 'number' &&
                typeof parsed.summary === 'string' &&
                Array.isArray(parsed.positivePoints) &&
                Array.isArray(parsed.areasForImprovement)
            ) {
                return parsed;
            }
            throw new Error("Invalid output format from Portfolio Doctor");
        } catch (e) {
             console.error("Malformed AI output:", e);
        }
    } catch (error) {
        console.error("Error fetching portfolio doctor analysis:", error);
    }

    // AI Quality Insight: Return graceful fallback instead of throwing error
    return {
        overallScore: 0,
        summary: "Analysis currently unavailable. Please try again later.",
        positivePoints: ["Unable to load analysis."],
        areasForImprovement: ["Unable to load analysis."]
    };
};

export const getStockSWOT = async (ticker: string): Promise<SWOTAnalysis> => {
     if (useMock) {
        return Promise.resolve({
            strengths: ["Strong brand recognition and market leadership in its sector.", "Diversified revenue streams and recent expansion into new markets."],
            weaknesses: ["High operational costs compared to competitors.", "Dependence on a single flagship product for a majority of revenue."],
            opportunities: ["Growing consumer demand in emerging markets.", "Potential for strategic partnerships with tech startups."],
            threats: ["Increasing regulatory scrutiny in key markets.", "Intensifying competition from both domestic and international players."]
        });
    }

    const prompt = `You are a senior equity analyst. Provide a detailed SWOT analysis for the Nigerian company with the stock ticker: ${ticker}. For each of the four categories (Strengths, Weaknesses, Opportunities, Threats), provide exactly two distinct, concise points.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two key strengths." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two key weaknesses." },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two key opportunities." },
            threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two key threats." }
        },
        required: ['strengths', 'weaknesses', 'opportunities', 'threats']
    };

    try {
        // AI Quality Insight: Wrap in timeout to prevent hanging UI
        const response: GenerateContentResponse = await withTimeout(ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        }), 10000);
        const jsonText = response.text.trim();

        // AI Quality Insight: Safe JSON parsing
        try {
            const parsed = JSON.parse(jsonText);
            if (parsed && Array.isArray(parsed.strengths) && Array.isArray(parsed.weaknesses) && Array.isArray(parsed.opportunities) && Array.isArray(parsed.threats)) {
                return parsed;
            }
        } catch (e) {
            console.error("Malformed AI output:", e);
        }
    } catch (error) {
        console.error(`Error fetching SWOT for ${ticker}:`, error);
    }

    // AI Quality Insight: Return graceful fallback instead of throwing error which breaks Promise.all
    return {
        strengths: ["Currently unavailable"],
        weaknesses: ["Currently unavailable"],
        opportunities: ["Currently unavailable"],
        threats: ["Currently unavailable"]
    };
};


export const compareStocks = async (stocks: Stock[]): Promise<string> => {
    if (useMock) {
        const stock1 = stocks[0]?.ticker || 'Stock A';
        const stock2 = stocks[1]?.ticker || 'Stock B';
        return Promise.resolve(`While **${stock1}** offers a more attractive dividend yield and a lower P/E ratio, indicating potential value, **${stock2}** has demonstrated stronger recent price performance and operates in a sector with higher growth forecasts. The choice depends on whether the investment objective is value and income (${stock1}) or growth (${stock2}).`);
    }

    const prompt = `You are a financial analyst. Concisely compare the following Nigerian stocks based on the provided data. Highlight their key differences and which might be preferable for different investment styles (e.g., value vs. growth).
    
    Stock Data: ${JSON.stringify(stocks.map(s => ({ ticker: s.ticker, sector: s.sector, peRatio: s.peRatio, dividendYield: s.dividendYield, change: s.change })))}
    
    Keep the summary to 2-3 sentences. Use markdown for bolding tickers.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error comparing stocks:", error);
        throw new Error("Failed to get AI stock comparison.");
    }
};

export const getModelPortfolioAnalysis = async (model: ModelPortfolio): Promise<ModelPortfolioAnalysis> => {
    if (useMock) {
        let projectedReturn = 12.5;
        let maxDrawdown = -15.2;
        if(model.riskLevel === 'High') {
            projectedReturn = 18.5;
            maxDrawdown = -25.8;
        } else if (model.riskLevel === 'Low') {
            projectedReturn = 7.2;
            maxDrawdown = -8.1;
        }
        return Promise.resolve({
            summary: `The ${model.name} model is a ${model.riskLevel}-risk strategy focused on ${model.description.toLowerCase()}. Its heavy concentration in specific sectors provides targeted exposure but may also lead to higher volatility compared to a more diversified approach.`,
            strengths: [
                "Clear strategic focus on a specific market segment.",
                "Potentially higher returns if the targeted sector performs well."
            ],
            weaknesses: [
                "Lack of broad market diversification.",
                "Susceptible to downturns affecting its core sectors."
            ],
            projectedReturn: projectedReturn,
            maxDrawdown: maxDrawdown
        });
    }

    const prompt = `You are a quantitative analyst. Analyze the following model portfolio based on its constituent weights and risk level. Provide a professional analysis.
    - Model Name: ${model.name}
    - Description: ${model.description}
    - Risk Level: ${model.riskLevel}
    - Constituents: ${JSON.stringify(model.constituents)}
    
    Provide your analysis in a structured JSON format.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A 2-3 sentence summary of the model's strategy, its pros, and cons." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two key strengths of this model portfolio." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two key weaknesses or risks of this model." },
            projectedReturn: { type: Type.NUMBER, description: "A plausible projected annualized return percentage (e.g., 12.5)." },
            maxDrawdown: { type: Type.NUMBER, description: "A plausible estimated maximum drawdown percentage (e.g., -20.5)." }
        },
        required: ['summary', 'strengths', 'weaknesses', 'projectedReturn', 'maxDrawdown']
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching model portfolio analysis:", error);
        throw new Error("Failed to get AI model portfolio analysis.");
    }
};
