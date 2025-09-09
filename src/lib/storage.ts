export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  price: number;
  category: string;
  modules: string[];
  rating: number;
  students: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  enrolledCourses: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
}

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'courseSystem_users',
  COURSES: 'courseSystem_courses',
  ENROLLMENTS: 'courseSystem_enrollments',
  CURRENT_USER: 'courseSystem_currentUser'
};

// Initialize demo data
export const initializeDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    const demoCourses: Course[] = [
      {
        id: '1',
        title: 'Introduction to Programming',
        description: 'Learn the fundamentals of programming with Python. Perfect for beginners who want to start their coding journey.',
        instructor: 'Dr. Sarah Johnson',
        duration: '8 weeks',
        level: 'Beginner',
        image: '/src/assets/programming-course.jpg',
        price: 199,
        category: 'Programming',
        modules: [
          'Introduction to Programming Concepts',
          'Variables and Data Types',
          'Control Structures',
          'Functions and Methods',
          'Object-Oriented Programming',
          'File Operations',
          'Error Handling',
          'Final Project'
        ],
        rating: 4.8,
        students: 2847
      },
      {
        id: '2',
        title: 'Data Science & Machine Learning',
        description: 'Master data analysis, visualization, and machine learning algorithms using Python, pandas, and scikit-learn.',
        instructor: 'Prof. Michael Chen',
        duration: '12 weeks',
        level: 'Intermediate',
        image: '/src/assets/data-science-course.jpg',
        price: 299,
        category: 'Data Science',
        modules: [
          'Data Analysis with Pandas',
          'Data Visualization',
          'Statistical Analysis',
          'Machine Learning Fundamentals',
          'Supervised Learning',
          'Unsupervised Learning',
          'Deep Learning Basics',
          'Real-world Projects'
        ],
        rating: 4.9,
        students: 1923
      },
      {
        id: '3',
        title: 'Full-Stack Web Development',
        description: 'Build modern web applications using React, Node.js, and MongoDB. From frontend to backend development.',
        instructor: 'Alex Rodriguez',
        duration: '16 weeks',
        level: 'Advanced',
        image: '/src/assets/web-dev-course.jpg',
        price: 399,
        category: 'Web Development',
        modules: [
          'HTML, CSS & JavaScript Fundamentals',
          'React.js Development',
          'State Management',
          'Backend with Node.js',
          'Database Design with MongoDB',
          'API Development',
          'Authentication & Security',
          'Deployment & DevOps'
        ],
        rating: 4.7,
        students: 3156
      }
    ];

    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(demoCourses));
  }

  // Create demo users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUsers: User[] = [
      {
        id: 'admin1',
        email: 'admin@courseplatform.com',
        name: 'Admin User',
        role: 'admin',
        enrolledCourses: []
      },
      {
        id: 'student1',
        email: 'student@demo.com',
        name: 'Demo Student',
        role: 'student',
        enrolledCourses: []
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
  }
};

// Storage utility functions
export const storageUtils = {
  getCourses: (): Course[] => {
    const courses = localStorage.getItem(STORAGE_KEYS.COURSES);
    return courses ? JSON.parse(courses) : [];
  },

  setCourses: (courses: Course[]) => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  addCourse: (course: Course) => {
    const courses = storageUtils.getCourses();
    courses.push(course);
    storageUtils.setCourses(courses);
  },

  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  addUser: (user: User) => {
    const users = storageUtils.getUsers();
    users.push(user);
    storageUtils.setUsers(users);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getEnrollments: (): Enrollment[] => {
    const enrollments = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
    return enrollments ? JSON.parse(enrollments) : [];
  },

  setEnrollments: (enrollments: Enrollment[]) => {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  },

  addEnrollment: (enrollment: Enrollment) => {
    const enrollments = storageUtils.getEnrollments();
    enrollments.push(enrollment);
    storageUtils.setEnrollments(enrollments);
    
    // Update user's enrolled courses
    const users = storageUtils.getUsers();
    const userIndex = users.findIndex(u => u.id === enrollment.studentId);
    if (userIndex !== -1) {
      users[userIndex].enrolledCourses.push(enrollment.courseId);
      storageUtils.setUsers(users);
      
      // Update current user if it's the same
      const currentUser = storageUtils.getCurrentUser();
      if (currentUser && currentUser.id === enrollment.studentId) {
        storageUtils.setCurrentUser(users[userIndex]);
      }
    }
  },

  removeEnrollment: (studentId: string, courseId: string) => {
    // Remove enrollment record
    const enrollments = storageUtils.getEnrollments();
    const updatedEnrollments = enrollments.filter(
      e => !(e.studentId === studentId && e.courseId === courseId)
    );
    storageUtils.setEnrollments(updatedEnrollments);
    
    // Update user's enrolled courses
    const users = storageUtils.getUsers();
    const userIndex = users.findIndex(u => u.id === studentId);
    if (userIndex !== -1) {
      users[userIndex].enrolledCourses = users[userIndex].enrolledCourses.filter(
        id => id !== courseId
      );
      storageUtils.setUsers(users);
      
      // Update current user if it's the same
      const currentUser = storageUtils.getCurrentUser();
      if (currentUser && currentUser.id === studentId) {
        storageUtils.setCurrentUser(users[userIndex]);
      }
    }
  },

  login: (email: string, password: string): User | null => {
    const users = storageUtils.getUsers();
    const user = users.find(u => u.email === email);
    
    // For demo purposes, accept any password
    if (user) {
      storageUtils.setCurrentUser(user);
      return user;
    }
    return null;
  },

  logout: () => {
    storageUtils.setCurrentUser(null);
  }
};