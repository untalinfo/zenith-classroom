import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { courseData } from '../constants';
import type { Course } from '../types';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    const moduleCount = course.modules.length;
    return (
        <Link to={`/course/${course.id}`} className="block group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="relative">
                <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={course.imageUrl} alt={course.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">{moduleCount} {moduleCount > 1 ? 'Modules' : 'Module'}</span>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                <p className="text-gray-400 text-sm">{course.description}</p>
            </div>
        </Link>
    );
}

const CoursesScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (location.state?.quizCompleted) {
            setToastMessage('Congratulations! You passed the quiz.');
            
            // Use React Router's navigate function to programmatically update the URL 
            // and clear the state, preventing the toast from reappearing on refresh.
            // This is safer than using window.history.replaceState directly and fixes the black screen issue.
            navigate(location.pathname, { replace: true });

            const timer = setTimeout(() => {
                setToastMessage('');
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [location, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900/50 via-black to-black p-4 sm:p-6 md:p-8">
        {/* Toast Notification */}
        <div
            aria-live="polite"
            className={`fixed top-8 right-8 z-50 transition-all duration-500 ease-in-out ${toastMessage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}
        >
            {toastMessage && (
                <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center space-x-3">
                    <span>🎉</span>
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">Welcome to</h1>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Zenith Classroom
          </h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesScreen;