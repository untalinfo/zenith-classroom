
import React, { useState, createContext, useContext, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import CoursesScreen from './components/CoursesScreen';
import ClassroomScreen from './components/ClassroomScreen';
import BottomNav from './components/BottomNav';
import { courseData } from './constants';
import type { Note, Bookmark, AppContextType } from './types';
import { NotesIcon, ProgressIcon } from './components/Icons';

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const NotesScreen: React.FC = () => {
    const { notes } = useAppContext();
    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">My Notes</h1>
            {notes.length === 0 ? (
                <p className="text-gray-400">You haven't taken any notes yet.</p>
            ) : (
                <div className="space-y-4">
                    {notes.map(note => (
                        <div key={note.contentId} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <p className="text-gray-300 mb-2 italic">Note for: <span className="font-semibold text-purple-400">{note.contentTitle}</span></p>
                            <p className="text-white">{note.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const BookmarksScreen: React.FC = () => {
    const { bookmarks, toggleBookmark } = useAppContext();
    const navigate = useNavigate();
    
    // Find the course and content for each bookmark
    const bookmarkDetails = bookmarks.map(bookmark => {
        const course = courseData.find(c => 
            c.modules.some(m => 
                m.content.some(content => content.id === bookmark.contentId)
            )
        );
        const module = course?.modules.find(m => 
            m.content.some(content => content.id === bookmark.contentId)
        );
        const content = module?.content.find(c => c.id === bookmark.contentId);
        
        return {
            bookmark,
            course,
            module,
            content
        };
    }).filter(item => item.course && item.module && item.content);

    const handleBookmarkClick = (courseId: string, contentId: string) => {
        // Navigate to the course and find the content index
        const course = courseData.find(c => c.id === courseId);
        if (course) {
            const flattenedContent = course.modules.flatMap(m => m.content);
            const contentIndex = flattenedContent.findIndex(c => c.id === contentId);
            if (contentIndex !== -1) {
                // Navigate to the course with the specific content index
                navigate(`/course/${courseId}?content=${contentIndex}`);
            }
        }
    };

    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Saved Content</h1>
            {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-lg">No saved content yet</p>
                    <p className="text-gray-500 text-sm mt-2">Bookmark content while learning to see it here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookmarkDetails.map(({ bookmark, course, module, content }) => (
                        <div key={bookmark.contentId} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors cursor-pointer group" 
                             onClick={() => handleBookmarkClick(course!.id, bookmark.contentId)}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-purple-400 font-medium">{course?.title}</span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-sm text-gray-400">{module?.title}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{content?.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            content?.type === 'text' ? 'bg-blue-900 text-blue-300' :
                                            content?.type === 'video' ? 'bg-red-900 text-red-300' :
                                            content?.type === 'pdf' ? 'bg-orange-900 text-orange-300' :
                                            content?.type === 'image' ? 'bg-green-900 text-green-300' :
                                            content?.type === 'quiz' ? 'bg-purple-900 text-purple-300' :
                                            'bg-gray-700 text-gray-300'
                                        }`}>
                                            {content?.type?.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors">Click to view →</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(bookmark);
                                    }}
                                    className="ml-4 p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                                    title="Remove bookmark"
                                >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProgressScreen: React.FC = () => {
    const { progress } = useAppContext();
    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">My Progress</h1>
            <div className="space-y-6">
                {courseData.map(course => {
                    const courseProgress = progress[course.id] || {};
                    // Fix: Cast `p` to the expected type to resolve TypeScript error.
                    // `Object.values` on `courseProgress` can result in `p` being of type `unknown`.
                    const completedModules = Object.values(courseProgress).filter(p => (p as { completed: boolean }).completed).length;
                    const totalModules = course.modules.flatMap(m => m.content).length;
                    const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

                    return (
                        <div key={course.id} className="bg-gray-800 p-5 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-white mb-3">{course.title}</h2>
                            <div className="w-full bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <p className="text-right text-purple-300 mt-2 font-medium">{percentage}% Complete ({completedModules} / {totalModules})</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [progress, setProgress] = useState<Record<string, Record<string, { completed: boolean }>>>({});
  const location = useLocation();

  const addNote = useCallback((note: Note) => {
    setNotes(prev => {
        const existingNoteIndex = prev.findIndex(n => n.contentId === note.contentId);
        if (existingNoteIndex > -1) {
            const newNotes = [...prev];
            newNotes[existingNoteIndex] = note;
            return newNotes;
        }
        return [...prev, note];
    });
  }, []);

  const toggleBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks(prev => {
        const isBookmarked = prev.some(b => b.contentId === bookmark.contentId);
        if (isBookmarked) {
            return prev.filter(b => b.contentId !== bookmark.contentId);
        }
        return [...prev, bookmark];
    });
  }, []);

  const updateProgress = useCallback((courseId: string, contentId: string) => {
    setProgress(prev => ({
        ...prev,
        [courseId]: {
            ...prev[courseId],
            [contentId]: { completed: true },
        },
    }));
  }, []);

  const isClassroom = location.pathname.includes('/course/');

  return (
    <AppContext.Provider value={{ notes, addNote, bookmarks, toggleBookmark, progress, updateProgress }}>
      <main className="bg-black min-h-screen text-gray-100">
        <Routes>
          <Route path="/" element={<CoursesScreen />} />
          <Route path="/course/:courseId" element={<ClassroomScreen />} />
          <Route path="/notes" element={<NotesScreen />} />
          <Route path="/bookmarks" element={<BookmarksScreen />} />
          <Route path="/progress" element={<ProgressScreen />} />
        </Routes>
      </main>
      {!isClassroom && <BottomNav />}
    </AppContext.Provider>
  );
};

export default App;
