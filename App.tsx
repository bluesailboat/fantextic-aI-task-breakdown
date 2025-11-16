import React, { useState, useCallback, useMemo, useRef } from 'react';
import { generateTaskSteps, generateContentForStep } from './services/geminiService';
import { Step } from './types';
import { StepCard } from './components/StepCard';
import { Loader } from './components/Loader';
import { CubeTransparentIcon, BoltIcon, TrashIcon, ClipboardDocumentIcon, ArrowDownTrayIcon } from './components/Icons';

type AppState = 'initial' | 'stepsGenerated' | 'contentGenerated' | 'loading';

const App: React.FC = () => {
  const [taskInput, setTaskInput] = useState<string>('');
  const [generatedSteps, setGeneratedSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('initial');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Refs for drag and drop functionality
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);


  const handleGenerateSteps = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskInput.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedSteps([]);
    setAppState('loading');

    try {
      const result = await generateTaskSteps(taskInput);
      if (result.length === 0) {
        setError("AI 無法生成有效的步驟，請嘗試更換關鍵字或更詳細地描述您的任務。");
        setAppState('initial');
      } else {
        setGeneratedSteps(result.map(step => ({ ...step, id: crypto.randomUUID(), generatedContent: '', isGeneratingContent: false })));
        setAppState('stepsGenerated');
      }
    } catch (err) {
      console.error(err);
      setError("生成步驟時發生錯誤，請檢查您的網路連線或 API 金鑰後再試。");
      setAppState('initial');
    } finally {
      setIsLoading(false);
    }
  }, [taskInput, isLoading]);

  const handleUpdateStep = useCallback((index: number, field: 'title' | 'description', value: string) => {
    setGeneratedSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        return newSteps;
    });
  }, []);

  const handleGenerateAllContent = useCallback(async () => {
    setIsGeneratingContent(true);
    setAppState('loading');

    const stepsCopy = [...generatedSteps];
    for (let i = 0; i < stepsCopy.length; i++) {
        setGeneratedSteps(prev => prev.map((s, idx) => idx === i ? { ...s, isGeneratingContent: true } : s));
        try {
            const content = await generateContentForStep(stepsCopy[i]);
            stepsCopy[i] = { ...stepsCopy[i], generatedContent: content, isGeneratingContent: false };
            setGeneratedSteps([...stepsCopy]);
        // FIX: Corrected the syntax for the catch block from `catch(err) => {` to `catch(err) {`.
        } catch (err) {
            console.error(`Error generating content for step ${i}:`, err);
            stepsCopy[i] = { ...stepsCopy[i], isGeneratingContent: false, generatedContent: "內容生成失敗，請稍後重試。" };
            setGeneratedSteps([...stepsCopy]);
        }
    }
    
    setIsGeneratingContent(false);
    setAppState('contentGenerated');
  }, [generatedSteps]);
  
  const handleStartOver = () => {
    setAppState('initial');
    setGeneratedSteps([]);
    setTaskInput('');
    setError(null);
  };
  
  const handleCopyAll = () => {
    const contentToCopy = generatedSteps.map((step, index) => {
        const title = `# 步驟 ${index + 1}: ${step.title}`;
        const content = step.generatedContent || '尚無內容';
        return `${title}\n\n${content}`;
    }).join('\n\n---\n\n');

    navigator.clipboard.writeText(contentToCopy).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleExportTxt = () => {
     const contentToExport = generatedSteps.map((step, index) => {
        const title = `步驟 ${index + 1}: ${step.title}`;
        const description = `原始描述: ${step.description}`;
        const content = step.generatedContent || '尚無內容';
        // Simple conversion from markdown to plain text for TXT file
        const plainContent = content
            .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
            .replace(/(\*|_)(.*?)\1/g, '$2')   // italic
            .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code
            .replace(/#+\s/g, '')              // headers
            .replace(/-\s/g, '  - ');          // list items
        
        return `${title}\n${description}\n\n${plainContent}`;
    }).join('\n\n================================\n\n');

    const blob = new Blob([contentToExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${taskInput.slice(0, 20) || '任務'}-分解步驟.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';

    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      setGeneratedSteps(prevSteps => {
        const newSteps = [...prevSteps];
        const draggedItemContent = newSteps.splice(dragItem.current!, 1)[0];
        newSteps.splice(dragOverItem.current!, 0, draggedItemContent);
        return newSteps;
      });
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };


  const isPrimaryButtonDisabled = useMemo(() => isLoading || !taskInput.trim(), [isLoading, taskInput]);
  const isGenerateAllButtonDisabled = useMemo(() => isGeneratingContent || generatedSteps.length === 0, [isGeneratingContent, generatedSteps]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CubeTransparentIcon className="w-9 h-9 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                凡凡分解步驟小幫手
              </span>
              <span className="block text-2xl sm:text-3xl text-neutral-400 font-medium mt-2">
                Fantextic AI Task Breakdown Assistant
              </span>
            </h1>
            <CubeTransparentIcon className="w-9 h-9 text-amber-400" />
          </div>

          <p className="text-neutral-400 text-lg">
            輸入複雜任務，AI 為您生成可編輯的執行步驟，再一鍵生成所有內容。
          </p>

        </header>

        <main className="w-full">
          {appState === 'initial' && (
             <form onSubmit={handleGenerateSteps} className="mb-8 transition-opacity duration-500">
             <div className="relative">
               <textarea
                 value={taskInput}
                 onChange={(e) => setTaskInput(e.target.value)}
                 placeholder="例如：學習一門新的程式語言、規劃一場為期一週的日本旅行..."
                 className="w-full h-28 sm:h-24 p-4 pr-36 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none shadow-lg shadow-black/20"
                 disabled={isLoading}
               />
               <button
                 type="submit"
                 disabled={isPrimaryButtonDisabled}
                 className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-amber-500"
               >
                 {isLoading ? ( <Loader className="h-5 w-5" /> ) : ( <BoltIcon className="w-5 h-5" /> )}
                 <span>{isLoading ? '生成中...' : '生成步驟'}</span>
               </button>
             </div>
           </form>
          )}

          <div className="transition-all duration-500">
            {appState === 'loading' && !isGeneratingContent &&(
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                <p className="mt-4 text-neutral-400 text-lg">AI 正在為您規劃步驟...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg text-center">
                <h3 className="font-bold text-lg mb-2 text-red-200">發生錯誤</h3>
                <p>{error}</p>
                 <button onClick={handleStartOver} className="mt-4 px-4 py-2 bg-red-800 text-red-200 font-semibold rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto">
                    <TrashIcon className="w-5 h-5" />
                    <span>全部重來</span>
                  </button>
              </div>
            )}
            
            {(appState === 'stepsGenerated' || appState === 'contentGenerated' || isGeneratingContent) && (
                <div className="flex flex-col gap-4">
                  {generatedSteps.map((step, index) => {
                    const isDraggable = appState === 'stepsGenerated';
                    return (
                      <div
                        key={step.id}
                        draggable={isDraggable}
                        onDragStart={(e) => isDraggable && handleDragStart(e, index)}
                        onDragEnter={(e) => isDraggable && handleDragEnter(e, index)}
                        onDragEnd={(e) => isDraggable && handleDragEnd(e)}
                        onDragOver={(e) => isDraggable && e.preventDefault()}
                        className={isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
                      >
                        <StepCard 
                          step={step}
                          stepNumber={index + 1}
                          onUpdateStep={(field, value) => handleUpdateStep(index, field, value)}
                          isEditable={isDraggable}
                        />
                      </div>
                    );
                  })}

                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={handleStartOver}
                      className="flex items-center gap-2 px-6 py-2 bg-neutral-800 text-neutral-300 font-semibold rounded-md hover:bg-neutral-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-neutral-500">
                      <TrashIcon className="w-5 h-5" />
                      <span>全部重來</span>
                    </button>
                  
                    {appState === 'stepsGenerated' && (
                        <button 
                            onClick={handleGenerateAllContent}
                            disabled={isGenerateAllButtonDisabled}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-amber-500"
                        >
                            {isGeneratingContent ? (
                                <>
                                  <Loader className="h-5 w-5" />
                                  <span>生成內容中...</span>
                                </>
                            ) : (
                                <>
                                  <BoltIcon className="w-5 h-5" />
                                  <span>為所有步驟生成內容</span>
                                </>
                            )}
                        </button>
                    )}
                    
                    {appState === 'contentGenerated' && (
                       <div className="flex flex-wrap justify-center gap-4">
                          <button 
                            onClick={handleCopyAll}
                            className={`flex items-center justify-center gap-2 px-6 py-2 font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-emerald-500 ${
                              copySuccess 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-emerald-700 text-emerald-100 hover:bg-emerald-600'
                            }`}
                          >
                            <ClipboardDocumentIcon className="w-5 h-5" />
                            <span>{copySuccess ? '已複製！' : '全部複製'}</span>
                          </button>
                          
                          <button 
                            onClick={handleExportTxt}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-sky-700 text-sky-100 font-semibold rounded-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-sky-500"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            <span>匯出 TXT</span>
                          </button>
                       </div>
                    )}

                  </div>
                </div>
            )}
            
            {appState === 'initial' && !isLoading && !error && (
                <div className="text-center text-neutral-500 py-12 px-4 border-2 border-dashed border-neutral-800 rounded-lg bg-neutral-900/50">
                    <h2 className="text-xl font-medium text-neutral-300">準備好開始了嗎？</h2>
                    <p className="mt-2 text-neutral-400">在上方輸入框中告訴我您想做什麼，我會幫您拆解成可編輯的小步驟。</p>
                </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;