import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { courseData } from '../constants';
import type { ContentItem, Note } from '../types';
import { TextContentCard, VideoContentCard, PdfContentCard, ImageContentCard, QuizContentCard } from './ContentCards';
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon, NotesIcon, CloseIcon } from './Icons';
import { useAppContext } from '../App';

// For TypeScript to recognize Swiper from the CDN
declare const Swiper: any;

const ClassroomScreen: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { bookmarks, toggleBookmark, notes, addNote, updateProgress } = useAppContext();

    const [swiper, setSwiper] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isNotesDrawerOpen, setNotesDrawerOpen] = useState(false);
    const [currentNoteText, setCurrentNoteText] = useState('');
    const [isQuizComplete, setQuizComplete] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

    const course = courseData.find(c => c.id === courseId);
    const flattenedContent: ContentItem[] = course ? course.modules.flatMap(m => m.content) : [];
    const currentContent = flattenedContent[activeIndex];
    
    const swiperRef = useRef(null);

    // Initialize activeIndex based on URL parameter
    useEffect(() => {
        const contentParam = searchParams.get('content');
        if (contentParam) {
            const contentIndex = parseInt(contentParam, 10);
            if (!isNaN(contentIndex) && contentIndex >= 0 && contentIndex < flattenedContent.length) {
                setActiveIndex(contentIndex);
            }
        }
    }, [searchParams, flattenedContent.length]);

    useEffect(() => {
        if (swiperRef.current) {
            const swiperInstance = new Swiper(swiperRef.current, {
                direction: 'vertical',
                slidesPerView: 1,
                allowTouchMove: false,
                initialSlide: activeIndex,
                on: {
                    slideChange: (s: any) => {
                        setActiveIndex(s.activeIndex);
                        const currentContent = flattenedContent[s.activeIndex];
                        if (courseId && currentContent) {
                            updateProgress(courseId, currentContent.id);
                        }
                        setQuizComplete(false); // Reset quiz completion status on slide change
                    },
                },
            });
            setSwiper(swiperInstance);

            return () => {
                swiperInstance.destroy(true, true);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId, activeIndex]);

    // Mark current content as completed when component mounts or activeIndex changes
    useEffect(() => {
        if (courseId && currentContent) {
            updateProgress(courseId, currentContent.id);
        }
    }, [courseId, currentContent, updateProgress]);

    const handleQuizStateChange = useCallback((isComplete: boolean) => {
        setQuizComplete(isComplete);
    }, []);

    const handleQuizSuccess = useCallback(() => {
        // Ensure progress is marked for the quiz itself
        if (courseId && currentContent) {
            updateProgress(courseId, currentContent.id);
        }
        
        // Check if this is the last content in the course
        if (activeIndex === flattenedContent.length - 1) {
            // This is the last content, redirect to home after a short delay
            setTimeout(() => {
                navigate('/', { state: { courseCompleted: true } });
            }, 2000);
        }
    }, [courseId, currentContent, updateProgress, activeIndex, flattenedContent.length, navigate]);

    const isBookmarked = currentContent ? bookmarks.some(b => b.contentId === currentContent.id) : false;
    const isNavigationDisabled = currentContent?.type === 'quiz' && !isQuizComplete;

    useEffect(() => {
        if (isNotesDrawerOpen && currentContent) {
            const existingNote = notes.find(n => n.contentId === currentContent.id);
            setCurrentNoteText(existingNote?.text || '');
        }
    }, [isNotesDrawerOpen, currentContent, notes]);

    if (!course) {
        return <div className="flex items-center justify-center h-screen text-white">Course not found.</div>;
    }
    
    const handleNavigationAttempt = (navigationAction: () => void) => {
        if (isNavigationDisabled) {
            setPendingNavigation(() => navigationAction);
            setShowExitConfirm(true);
        } else {
            navigationAction();
        }
    };

    const handleSaveNote = () => {
        if (currentContent) {
            const note: Note = {
                contentId: currentContent.id,
                contentTitle: currentContent.title,
                text: currentNoteText
            };
            addNote(note);
            setNotesDrawerOpen(false);
        }
    };
    
    const progressPercentage = flattenedContent.length > 0 ? ((activeIndex + 1) / flattenedContent.length) * 100 : 0;
    
    return (
        <div className="h-screen w-screen bg-black overflow-hidden relative text-white">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
                <div className="flex items-center justify-between">
                     <button 
                        onClick={() => handleNavigationAttempt(() => navigate('/'))} 
                        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                     >
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold truncate">{course.title}</h1>
                        <p className="text-sm text-gray-400">{currentContent?.title}</p>
                    </div>
                     <div className="w-10"></div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            {/* Swiper Container */}
            <div className="swiper h-full" ref={swiperRef}>
                <div className="swiper-wrapper">
                    {flattenedContent.map((item) => (
                        <div key={item.id} className="swiper-slide flex items-center justify-center p-4 pt-24 pb-24">
                            <div className="w-full max-w-4xl h-full overflow-y-auto">
                                {item.type === 'text' && <TextContentCard content={item} />}
                                {item.type === 'video' && <VideoContentCard content={item} />}
                                {item.type === 'pdf' && <PdfContentCard content={item} />}
                                {item.type === 'image' && <ImageContentCard content={item} />}
                                {item.type === 'quiz' && <QuizContentCard content={item} onQuizStateChange={handleQuizStateChange} onSuccess={handleQuizSuccess} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Controls */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-4">
                 <button 
                    onClick={() => currentContent && toggleBookmark({ contentId: currentContent.id, contentTitle: currentContent.title })}
                    className={`p-3 rounded-full transition-colors ${isBookmarked ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-purple-500'}`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                >
                    <BookmarkIcon className="w-6 h-6" isBookmarked={isBookmarked} />
                </button>
                <button
                    onClick={() => setNotesDrawerOpen(true)}
                    className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white transition-colors"
                    title="Take a Note"
                >
                    <NotesIcon className="w-6 h-6" />
                </button>
            </div>
            
            {/* Navigation FABs */}
            <div className="absolute bottom-6 right-6 z-10 flex items-end space-x-4">
                {activeIndex > 0 && (
                     <button 
                        onClick={() => handleNavigationAttempt(() => swiper?.slidePrev())} 
                        className="bg-gray-700 text-white p-3 rounded-lg shadow-lg hover:bg-gray-600 transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                )}
                {activeIndex < flattenedContent.length - 1 && (
                    <button 
                        onClick={() => handleNavigationAttempt(() => swiper?.slideNext())} 
                        disabled={isNavigationDisabled}
                        className={`flex items-center group font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ${
                            isNavigationDisabled 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                        }`}
                    >
                        Next
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            {/* Notes Drawer */}
            <div className={`fixed inset-0 z-20 bg-black/60 transition-opacity duration-300 ${isNotesDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setNotesDrawerOpen(false)}></div>
            <div className={`fixed bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl p-6 shadow-2xl transform transition-transform duration-300 ${isNotesDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <h2 className="text-2xl font-bold mb-4">Note for: <span className="text-purple-400">{currentContent?.title}</span></h2>
                <textarea 
                    className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Write your notes here..."
                    value={currentNoteText}
                    onChange={(e) => setCurrentNoteText(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-4 space-x-3">
                    <button onClick={() => setNotesDrawerOpen(false)} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">Cancel</button>
                    <button onClick={handleSaveNote} className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-semibold">Save Note</button>
                </div>
            </div>

            {/* Exit Confirmation Dialog */}
            {showExitConfirm && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)}></div>
                    <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
                        <h3 className="mb-4 text-xl font-bold text-white">
                            Exit Quiz?
                        </h3>
                        <p className="mb-6 text-gray-300">
                            Are you sure you want to exit the quiz? Your progress will be lost.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowExitConfirm(false);
                                    setPendingNavigation(null);
                                }}
                                className="rounded-lg bg-gray-700 px-6 py-2 font-semibold transition-colors hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (pendingNavigation) {
                                        pendingNavigation();
                                    }
                                    setShowExitConfirm(false);
                                    setPendingNavigation(null);
                                }}
                                className="rounded-lg bg-purple-600 px-6 py-2 font-semibold transition-colors hover:bg-purple-700"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClassroomScreen;