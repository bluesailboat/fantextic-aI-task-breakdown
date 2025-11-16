# 凡凡分解步驟小幫手 (Fantextic AI Task Breakdown Assistant)

這是一個利用 Google Gemini AI 將複雜任務拆解成清晰、可執行步驟的智慧助理。使用者只需輸入一個模糊的目標或任務，AI 將會生成一套結構化的行動指南，並能進一步為每個步驟生成詳細內容。

An intelligent assistant that uses the Google Gemini AI to break down complex tasks into clear, actionable steps. Simply input a vague goal or task, and the AI will generate a structured action plan, with the ability to further generate detailed content for each step.

---

## ✨ 功能特色 (Features)

*   **🤖 AI 智慧拆解 (AI-Powered Task Breakdown)**: 輸入任何任務，AI 會自動生成 5-8 個邏輯清晰的執行步驟。
*   **✏️ 步驟可編輯 (Editable Steps)**: 在生成詳細內容前，您可以自由修改每個步驟的標題和描述，確保計畫完全符合您的需求。
*   **⚡️ 一鍵生成內容 (One-Click Content Generation)**: 對於所有步驟，一鍵即可呼叫 AI 生成詳細的執行方案、程式碼、文案或其他所需內容。
*   **🌐 整合 Google 搜尋 (Google Search Integration)**: AI 在生成內容時會利用 Google 搜尋查證最新資訊，並附上參考資料來源。
*   **📋 輕鬆複製與匯出 (Easy Copy & Export)**: 完成後，您可以一鍵複製所有內容到剪貼簿，或將其匯出為 `.txt` 檔案方便保存。
*   **🎨 現代化介面 (Modern UI)**: 採用 Tailwind CSS 打造，介面美觀、響應式且易於使用。

---

## 🚀 如何使用 (How to Use)

整個流程非常簡單直觀，旨在讓您在幾分鐘內將一個複雜的想法變成一個具體的計畫。

1.  **🎯 步驟一：定義您的任務 (Step 1: Define Your Task)**
    在主畫面的輸入框中，盡可能清晰地描述您想完成的任務。別擔心太過複雜或模糊，AI 會盡力理解。
    *   *範例：* `學習 React 並建立一個待辦事項應用程式`、`規劃一場為期一週的日本關西自由行`、`撰寫一篇關於 AI 未來趨勢的部落格文章`。

2.  **🤖 步驟二：生成初步計畫 (Step 2: Generate the Initial Plan)**
    點擊 **「生成步驟」** 按鈕。AI 會將您的任務拆解成數個合乎邏輯的核心步驟，並提供初步的描述。這將成為您行動的骨架。

3.  **✏️ 步驟三：審核與客製化 (Step 3: Review & Customize)**
    這是您大展身手的時刻！檢查 AI 生成的步驟是否符合您的預期。您可以直接在卡片上編輯每個步驟的**標題**和**描述**，使其更貼近您的具體需求。這一步確保了最終計畫的個人化與實用性。

4.  **⚡️ 步驟四：一鍵生成詳細內容 (Step 4: Generate Detailed Content with One Click)**
    當您對步驟規劃感到滿意後，點擊 **「為所有步驟生成內容」**。AI 將會為每一個步驟，利用 Google 搜尋最新的資訊，生成詳盡的執行細節、程式碼範例、建議清單或任何所需內容。

5.  **📋 步驟五：匯出與執行 (Step 5: Export & Execute)**
    計畫完成！您現在可以點擊 **「全部複製」** 將完整內容貼到您的筆記軟體中，或點擊 **「匯出 TXT」** 下載一份純文字檔案。開始行動吧！

---

## 💡 應用場景 (Use Cases)

這個工具的應用範圍非常廣泛，幾乎適用於任何需要結構化規劃的場景：

*   **學習規劃**: 為學習一門新語言、新技術或新樂器制定詳細的學習路徑。
*   **專案管理**: 快速拆解工作項目，為團隊成員建立清晰的任務清單。
*   **內容創作**: 規劃部落格文章、YouTube 影片腳本或社交媒體貼文的內容大綱。
*   **旅行規劃**: 從零開始，安排行程、預訂住宿、打包行李，一步步完成您的夢幻之旅。
*   **活動策劃**: 規劃派對、會議或工作坊的每一個環節。
*   **個人成長**: 設定健身目標、理財計畫或培養新習慣的行動方案。

---

## 🛠️ 技術棧 (Tech Stack)

*   **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **AI**: [Google Gemini API](https://ai.google.dev/gemini-api) (`@google/genai`)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Markdown Rendering**: [Marked](https://marked.js.org/)

---

## 🌐 部署 (Deployment)

由於這是一個純前端的靜態網站，您可以輕鬆地將其免費部署到各種平台。

**部署步驟：**

1.  **Fork 或 Clone 此儲存庫 (Fork or Clone this repository)**。
2.  **選擇一個託管平台 (Choose a hosting platform)**，例如：
    *   [Vercel](https://vercel.com/)
    *   [Netlify](https://www.netlify.com/)
    *   [GitHub Pages](https://pages.github.com/)
    *   [Cloudflare Pages](https://pages.cloudflare.com/)
3.  **連接您的儲存庫 (Connect your repository)** 到您選擇的平台。
4.  **設定環境變數 (Set the Environment Variable)**:
    *   在平台的專案設定中，找到環境變數的設定區塊。
    *   新增一個名為 `API_KEY` 的環境變數。
    *   將您的 Google Gemini API 金鑰貼入其值中。
5.  **部署！** 平台將會自動建置並部署您的應用程式。

這樣，您就有了一個自己專屬的、隨時可用的 AI 任務分解助理！

---

## 👨‍💻 本地開發 (Local Development)

此專案是一個純前端應用，可以直接在瀏覽器中運行。

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd [repository-folder]
    ```
2.  **API Key:**
    這個專案需要一個 Google Gemini API 金鑰。請在您的部署環境中設定 `API_KEY` 環境變數。

3.  **Run the application:**
    由於專案使用 ES Modules，您需要透過一個本地伺服器來運行 `index.html` 以避免 CORS 問題。您可以使用任何支援此功能的工具，例如 VS Code 的 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 擴充功能。

    右鍵點擊 `index.html` 並選擇 "Open with Live Server"。
