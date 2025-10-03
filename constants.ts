
import type { Course } from './types';
import { ContentType } from './types';

export const courseData: Course[] = [
  {
    id: 'react-mastery',
    title: 'React Mastery 2024',
    description: 'From fundamentals to advanced concepts, become a React expert.',
    imageUrl: 'https://picsum.photos/seed/react/600/400',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to React',
        content: [
          {
            id: 'c1',
            type: ContentType.TEXT,
            title: 'What is React?',
            content: [
              "React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.",
              "React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js. Because React is only concerned with the user interface and rendering components to the DOM, React applications often rely on libraries for routing and other client-side functionality."
            ],
          },
          {
            id: 'c2',
            type: ContentType.VIDEO,
            title: 'Your First React Component',
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Advanced State Management',
        content: [
          {
            id: 'c3',
            type: ContentType.PDF,
            title: 'Don\'t Forget React',
            url: '/assets/dont-forget-react.pdf',
          },
           {
            id: 'c4',
            type: ContentType.QUIZ,
            title: 'Module 1 Quiz',
            questions: [
                {
                    question: 'What company maintains React?',
                    options: ['Google', 'Microsoft', 'Meta', 'Apple'],
                    correctAnswer: 'Meta',
                    type: 'multiple-choice',
                },
                {
                    question: 'React is a backend framework.',
                    options: ['True', 'False'],
                    correctAnswer: 'False',
                    type: 'true-false',
                }
            ]
           }
        ],
      },
    ],
  },
  {
    id: 'design-principles',
    title: 'UI/UX Design Principles',
    description: 'Learn the core principles of creating beautiful and intuitive user interfaces.',
    imageUrl: 'https://picsum.photos/seed/design/600/400',
    modules: [
      {
        id: 'm3',
        title: 'Core Concepts',
        content: [
          {
            id: 'c5',
            type: ContentType.IMAGE,
            title: 'The Color Wheel',
            url: 'https://picsum.photos/seed/colors/1200/800',
            description: 'Understanding color theory is fundamental to good design. The color wheel helps visualize relationships between different colors.'
          },
          {
            id: 'c6',
            type: ContentType.TEXT,
            title: 'Typography and Hierarchy',
            content: [
                "Typography is the art of arranging type to make written language legible, readable and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning).",
                "Visual hierarchy is one of the most important principles behind good user interface design. It's the order in which a user processes information on a page. Its role is to allow users to understand the information easily. By assigning different visual characteristics to sections of information (e.g. font sizes, colors, placement on the page), a designer can influence what users will perceive as most important."
            ]
          },
          {
            id: 'c8',
            type: ContentType.PDF,
            title: 'UX Design Principles and Guidelines',
            url: '/assets/UX Design Principles and Guidelines.pdf',
          },
          {
            id: 'c9',
            type: ContentType.QUIZ,
            title: 'UX Design Principles Quiz',
            questions: [
                {
                    question: 'What is the primary goal of user experience (UX) design?',
                    options: ['To make interfaces look beautiful', 'To create products that are useful, usable, and desirable', 'To use the latest design trends', 'To minimize development costs'],
                    correctAnswer: 'To create products that are useful, usable, and desirable',
                    type: 'multiple-choice',
                },
                {
                    question: 'Which principle states that users should be able to easily understand and use a product without prior experience?',
                    options: ['Accessibility', 'Usability', 'Affordance', 'Consistency'],
                    correctAnswer: 'Usability',
                    type: 'multiple-choice',
                },
                {
                    question: 'Visual hierarchy helps users understand the importance of different elements on a page.',
                    options: ['True', 'False'],
                    correctAnswer: 'True',
                    type: 'true-false',
                }
            ]
          }
        ]
      },
      {
        id: 'm5',
        title: 'Advanced Design Techniques',
        content: [
          {
            id: 'c10',
            type: ContentType.TEXT,
            title: 'User Research and Testing',
            content: [
              "User research is the systematic study of target users and their requirements, to add realistic contexts and insights to design processes. It involves understanding user behaviors, needs, and motivations through observation techniques, task analysis, and other feedback methodologies.",
              "Usability testing is a technique used in user-centered interaction design to evaluate a product by testing it on users. This can be seen as an irreplaceable usability practice, since it gives direct input on how real users use the system.",
              "A/B testing, also known as split testing, is a method of comparing two versions of a webpage or app against each other to determine which one performs better. It's an essential tool for data-driven design decisions."
            ]
          },
          {
            id: 'c11',
            type: ContentType.IMAGE,
            title: 'Design System Components',
            url: 'https://picsum.photos/seed/design-system/1200/800',
            description: 'Design systems are collections of reusable components, guided by clear standards, that can be assembled together to build any number of applications. They help maintain consistency and speed up the design process.'
          },
          {
            id: 'c12',
            type: ContentType.VIDEO,
            title: 'Prototyping Best Practices',
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          },
          {
            id: 'c13',
            type: ContentType.QUIZ,
            title: 'Advanced Design Quiz',
            questions: [
                {
                    question: 'What is the main purpose of user research in the design process?',
                    options: ['To make designs look more attractive', 'To understand user behaviors, needs, and motivations', 'To reduce development time', 'To increase design complexity'],
                    correctAnswer: 'To understand user behaviors, needs, and motivations',
                    type: 'multiple-choice',
                },
                {
                    question: 'A/B testing helps designers make data-driven decisions.',
                    options: ['True', 'False'],
                    correctAnswer: 'True',
                    type: 'true-false',
                },
                {
                    question: 'What is a design system?',
                    options: ['A collection of design tools', 'A set of reusable components with clear standards', 'A single design template', 'A color palette'],
                    correctAnswer: 'A set of reusable components with clear standards',
                    type: 'multiple-choice',
                }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Fundamentals',
    description: 'A complete guide to marketing in the digital age, from SEO to social media.',
    imageUrl: 'https://picsum.photos/seed/marketing/600/400',
    modules: [
      {
        id: 'm4',
        title: 'Search Engine Optimization (SEO)',
        content: [
           {
            id: 'c7',
            type: ContentType.VIDEO,
            title: 'How SEO Works',
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
           }
        ]
      }
    ]
  }
];
