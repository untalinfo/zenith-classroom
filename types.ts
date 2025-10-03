
export enum ContentType {
    TEXT = 'text',
    VIDEO = 'video',
    PDF = 'pdf',
    IMAGE = 'image',
    QUIZ = 'quiz',
}

export interface BaseContent {
    id: string;
    title: string;
}

export interface TextContent extends BaseContent {
    type: ContentType.TEXT;
    content: string[]; // Array of paragraphs
}

export interface VideoContent extends BaseContent {
    type: ContentType.VIDEO;
    url: string;
}

export interface PdfContent extends BaseContent {
    type: ContentType.PDF;
    url: string;
}

export interface ImageContent extends BaseContent {
    type: ContentType.IMAGE;
    url: string;
    description: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
}

export interface QuizContent extends BaseContent {
    type: ContentType.QUIZ;
    questions: QuizQuestion[];
}

export type ContentItem = TextContent | VideoContent | PdfContent | ImageContent | QuizContent;

export interface Module {
    id: string;
    title: string;
    content: ContentItem[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    modules: Module[];
}

export interface Note {
    contentId: string;
    contentTitle: string;
    text: string;
}

export interface Bookmark {
    contentId: string;
    contentTitle: string;
}

export interface AppContextType {
    notes: Note[];
    addNote: (note: Note) => void;
    bookmarks: Bookmark[];
    toggleBookmark: (bookmark: Bookmark) => void;
    progress: Record<string, Record<string, { completed: boolean }>>;
    updateProgress: (courseId: string, contentId: string) => void;
}
