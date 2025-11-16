import { GoogleGenAI, Type } from "@google/genai";
import { Step } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const stepSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "一個簡潔有力的步驟標題"
        },
        description: {
            type: Type.STRING,
            description: "詳盡具體的執行說明。應該要實際、可操作，並在適當時提供有用的提示、範例或建議。"
        },
    },
    required: ["title", "description"],
};

const responseSchema = {
    type: Type.ARRAY,
    items: stepSchema
};


export const generateTaskSteps = async (taskDescription: string): Promise<Step[]> => {
  try {
    const prompt = `
    你是一位世界級的專案管理專家與教學設計師。請根據使用者提供的任務，將其拆解成一系列盡可能詳盡、完整的步驟，通常 5 到 8 個步驟為佳。
    你的目標是幫助使用者將一個複雜或模糊的目標，轉化為一套清晰明確、高可行性的行動指南。
    如果任務中提及任何特定的產品、品牌、技術或專有名詞，請確保你生成的步驟標題和描述是基於普遍且公認的資訊，避免提供猜測或不準確的細節。

    任務: "${taskDescription}"
  `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7,
            topP: 0.95,
        },
    });

    const jsonStr = response.text.trim();
    
    try {
      const parsedData: Step[] = JSON.parse(jsonStr);
      if (Array.isArray(parsedData) && parsedData.every(item => 'title' in item && 'description' in item)) {
        return parsedData;
      } else {
        console.error("Parsed data is not in the expected format:", parsedData);
        return [];
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.error("Raw response text:", jsonStr);
      return [];
    }
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw error;
  }
};


const generateContentPrompt = (title: string, description: string): string => {
    return `
      你是一位多才多藝的內容創作者與執行專家。現在，你需要根據一個已規劃好的任務步驟，來生成具體的執行內容。

      這是你需要執行的步驟：
      - 標題: "${title}"
      - 描述: "${description}"

      請直接開始撰寫這個步驟所要求的內容。不要重複標題或描述，也不要添加任何額外的解釋或開場白。你的回答應該是直接、完整且高品質的產出，嚴格地完成該步驟所描述的任務。
      如果步驟中提及任何特定的產品、品牌、技術或專有名詞，請務必使用網路搜尋工具來查證最新、最準確的資訊，以確保內容的正確性。
      請盡可能使用 Markdown 格式來組織你的內容，例如使用粗體 (**text**) 來強調重點，使用條列式清單 (- item) 來列舉項目，讓內容更清晰易讀。
    `;
};

export const generateContentForStep = async (step: Step): Promise<string> => {
    try {
        const prompt = generateContentPrompt(step.title, step.description);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8,
                topP: 0.95,
                tools: [{googleSearch: {}}],
            }
        });
        
        let content = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (groundingChunks && groundingChunks.length > 0) {
            const sources = groundingChunks
                .map(chunk => chunk.web)
                .filter(web => web?.uri && web.title)
                .map(web => `- [${web.title}](${web.uri})`);
            
            const uniqueSources = [...new Set(sources)];
            
            if (uniqueSources.length > 0) {
                content += `\n\n---\n\n**參考資料:**\n${uniqueSources.join('\n')}`;
            }
        }
        
        return content;

    } catch (error) {
        console.error("Error generating content for step from Gemini API:", error);
        throw error;
    }
};