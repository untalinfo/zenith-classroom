import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { TextContent, VideoContent, PdfContent, ImageContent, QuizContent, QuizQuestion } from '../types';

// For TypeScript to recognize pdfjsLib from the CDN
declare const pdfjsLib: any;

export const TextContentCard: React.FC<{ content: TextContent }> = ({ content }) => {
    return (
        <div className="bg-gray-900 p-8 rounded-xl max-w-3xl mx-auto text-left">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{content.title}</h2>
            <div className="space-y-4 text-lg text-gray-300">
                {content.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
        </div>
    );
};

export const VideoContentCard: React.FC<{ content: VideoContent }> = ({ content }) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">{content.title}</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl bg-black">
                <video controls src={content.url} className="w-full h-full object-contain" />
            </div>
        </div>
    );
};

export const ImageContentCard: React.FC<{ content: ImageContent }> = ({ content }) => {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <div className="max-h-[60vh] flex justify-center mb-4">
                <img src={content.url} alt={content.title} className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">{content.description}</p>
        </div>
    );
};

export const PdfContentCard: React.FC<{ content: PdfContent }> = ({ content }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pdf, setPdf] = useState<any>(null);
    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [scale, setScale] = useState(1.5);
    const [showControls, setShowControls] = useState(true);

    const renderPage = useCallback((pdfDoc: any, pageNumber: number, scaleValue: number = scale) => {
        pdfDoc.getPage(pageNumber).then((page: any) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const viewport = page.getViewport({ scale: scaleValue });
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    }, [scale]);

    useEffect(() => {
        // pdf.js setup
        const pdfjsWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs`;
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
        
        setLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(content.url);
        loadingTask.promise.then((pdfDoc: any) => {
            setPdf(pdfDoc);
            setNumPages(pdfDoc.numPages);
            setLoading(false);
        }).catch((err: Error) => {
            console.error("Error loading PDF:", err);
            setError("Failed to load PDF. Please check the URL and CORS policy.");
            setLoading(false);
        });
    }, [content.url]);

    useEffect(() => {
        if (pdf) {
            renderPage(pdf, pageNum, scale);
        }
    }, [pdf, pageNum, renderPage, scale]);

    const goToPrevPage = () => setPageNum(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNum(prev => Math.min(prev + 1, numPages));

    const handleDownload = async () => {
        try {
            const response = await fetch(content.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = content.title + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading PDF:', err);
        }
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current?.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`w-full flex flex-col items-center ${isFullscreen ? 'fixed inset-0 z-50 bg-black overflow-auto' : ''}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={`flex items-center justify-between w-full mb-4 ${isFullscreen ? 'sticky top-0 bg-black/90 backdrop-blur-sm z-10 p-4' : ''}`}>
                <h2 className="text-2xl font-bold">{content.title}</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
                        title="Download PDF"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isFullscreen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {loading && <p className="text-purple-400">Loading PDF...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className={`relative bg-white rounded-md shadow-lg ${isFullscreen ? 'max-w-6xl w-full flex justify-center' : 'overflow-hidden'}`}>
                <div 
                    className={`relative ${isFullscreen ? 'flex justify-center' : ''}`}
                    style={{
                        userSelect: 'text',
                        WebkitUserSelect: 'text',
                        MozUserSelect: 'text',
                        msUserSelect: 'text'
                    }}
                >
                    <canvas 
                        ref={canvasRef} 
                        style={{ 
                            userSelect: 'text',
                            WebkitUserSelect: 'text',
                            MozUserSelect: 'text',
                            msUserSelect: 'text',
                            cursor: 'text',
                            display: 'block',
                            maxWidth: '100%',
                            height: 'auto'
                        }}
                    />
                </div>
                
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button
                        onClick={handleZoomIn}
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        title="Zoom In"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        title="Zoom Out"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {pdf && (
                <div className={`flex items-center justify-between w-full mt-4 bg-gray-800 p-4 rounded-lg ${isFullscreen ? 'sticky bottom-0 z-10' : ''}`}>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={goToPrevPage} 
                            disabled={pageNum <= 1} 
                            className="px-4 py-2 rounded-lg disabled:opacity-50 bg-purple-600 hover:bg-purple-700 transition"
                        >
                            Prev
                        </button>
                        <span className="text-white">Page {pageNum} of {numPages}</span>
                        <button 
                            onClick={goToNextPage} 
                            disabled={pageNum >= numPages} 
                            className="px-4 py-2 rounded-lg disabled:opacity-50 bg-purple-600 hover:bg-purple-700 transition"
                        >
                            Next
                        </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Zoom: {Math.round(scale * 100)}%</span>
                        <button
                            onClick={() => setScale(1.5)}
                            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
            
            {isFullscreen && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <p className="text-sm text-gray-400 bg-black/50 px-3 py-1 rounded">Press ESC to exit fullscreen</p>
                </div>
            )}
        </div>
    );
};


const QuizQuestionComponent: React.FC<{ question: QuizQuestion; onAnswer: (isCorrect: boolean) => void; }> = ({ question, onAnswer }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = () => {
        if(selected === null) return;
        setSubmitted(true);
        onAnswer(selected === question.correctAnswer);
    };

    const getOptionClass = (option: string) => {
        if (!submitted) {
            return selected === option ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600';
        }
        if (option === question.correctAnswer) {
            return 'bg-green-600';
        }
        if (option === selected) {
            return 'bg-red-600';
        }
        return 'bg-gray-700 opacity-60';
    };

    return (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
            <h4 className="text-xl font-semibold mb-4">{question.question}</h4>
            <div className="space-y-3">
                {question.options.map(option => (
                    <button
                        key={option}
                        onClick={() => !submitted && setSelected(option)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${getOptionClass(option)}`}
                        disabled={submitted}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {!submitted && (
                <button onClick={handleSubmit} disabled={selected === null} className="mt-4 px-6 py-2 bg-pink-600 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    Submit
                </button>
            )}
        </div>
    )
}

export const QuizContentCard: React.FC<{ content: QuizContent; onQuizStateChange: (isComplete: boolean) => void; onSuccess: () => void; }> = ({ content, onQuizStateChange, onSuccess }) => {
    const [results, setResults] = useState<Record<number, boolean>>({});
    const [attempt, setAttempt] = useState(0);
    const totalQuestions = content.questions.length;
    const answeredQuestions = Object.keys(results).length;
    const isFinished = answeredQuestions === totalQuestions;
    
    const correctAnswers = Object.values(results).filter(Boolean).length;
    const allCorrect = isFinished && correctAnswers === totalQuestions;

    useEffect(() => {
        // A quiz is "complete" for navigation purposes only when all answers are correct.
        onQuizStateChange(allCorrect);

        // If all answers are correct, trigger the success callback after a short delay
        if (allCorrect) {
            const timer = setTimeout(() => {
                onSuccess();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [allCorrect, onQuizStateChange, onSuccess]);
    
    const handleAnswer = (questionIndex: number, isCorrect: boolean) => {
        setResults(prev => ({...prev, [questionIndex]: isCorrect}));
    }

    const handleRetry = () => {
        setResults({});
        setAttempt(prev => prev + 1);
        onQuizStateChange(false); // Ensure navigation is disabled immediately on retry
    }

    return (
        <div className="bg-gray-900 p-8 rounded-xl max-w-3xl mx-auto text-left">
            <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
            {isFinished && (
                <div className="mb-6 p-4 rounded-lg bg-purple-900/50 text-center">
                    <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
                    <p className="text-lg text-purple-300">You scored {correctAnswers} out of {totalQuestions}</p>
                    {!allCorrect && (
                         <button 
                            onClick={handleRetry} 
                            className="mt-4 px-6 py-2 bg-pink-600 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                        >
                            Retry Quiz
                        </button>
                    )}
                </div>
            )}
            {content.questions.map((q, i) => (
                <QuizQuestionComponent 
                    key={`${i}-${attempt}`} 
                    question={q} 
                    onAnswer={(isCorrect) => handleAnswer(i, isCorrect)} 
                />
            ))}
        </div>
    );
};