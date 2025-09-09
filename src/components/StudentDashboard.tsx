import { useState, useEffect } from 'react';
import { User, Course, storageUtils } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { CourseCard } from './CourseCard';
import { useToast } from '@/hooks/use-toast';
import { Star, BookOpen, Clock, Users, Search, LogOut } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export const StudentDashboard = ({ user, onLogout }: StudentDashboardProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('catalog');
  const { toast } = useToast();

  useEffect(() => {
    const allCourses = storageUtils.getCourses();
    setCourses(allCourses);
    
    const enrolled = allCourses.filter(course => 
      user.enrolledCourses.includes(course.id)
    );
    setEnrolledCourses(enrolled);
  }, [user.enrolledCourses]);

  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    const enrollment = {
      id: `enrollment_${Date.now()}`,
      studentId: user.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0
    };
    
    storageUtils.addEnrollment(enrollment);
    
    // Update local state
    const updatedUser = storageUtils.getCurrentUser();
    if (updatedUser) {
      const enrolled = courses.filter(course => 
        updatedUser.enrolledCourses.includes(course.id)
      );
      setEnrolledCourses(enrolled);
    }

    // Show success toast with redirect link
    toast({
      title: "Course Added Successfully!",
      description: (
        <div className="space-y-2">
          <p>{course?.title} has been added to your courses.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab('enrolled')}
            className="w-full"
          >
            View My Courses
          </Button>
        </div>
      ),
      duration: 5000,
    });
  };

  const handleUnenroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    
    storageUtils.removeEnrollment(user.id, courseId);
    
    // Update local state
    const updatedUser = storageUtils.getCurrentUser();
    if (updatedUser) {
      const enrolled = courses.filter(course => 
        updatedUser.enrolledCourses.includes(course.id)
      );
      setEnrolledCourses(enrolled);
    }

    toast({
      title: "Course Removed Successfully!",
      description: `${course?.title} has been removed from your courses.`,
      duration: 3000,
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory && !user.enrolledCourses.includes(course.id);
  });

  const categories = ['all', ...Array.from(new Set(courses.map(course => course.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduPlatform
            </h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
            <TabsTrigger value="enrolled" className="relative">
              My Courses
              {enrolledCourses.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {enrolledCourses.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Explore Courses</h2>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={false}
                  onEnroll={() => handleEnroll(course.id)}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No courses available at the moment'
                  }
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">My Courses</h2>
              <p className="text-muted-foreground">
                Continue your learning journey with your enrolled courses
              </p>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isEnrolled={true}
                    showProgress={true}
                    onUnenroll={() => handleUnenroll(course.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No enrolled courses</CardTitle>
                  <CardDescription className="mb-4">
                    Start your learning journey by enrolling in a course
                  </CardDescription>
                  <Button onClick={() => {
                    const catalogTab = document.querySelector('[value="catalog"]') as HTMLElement;
                    catalogTab?.click();
                  }}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};