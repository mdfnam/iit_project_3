import { useState, useEffect } from 'react';
import { User, Course, storageUtils } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from './CourseCard';
import { Plus, BookOpen, Users, TrendingUp, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCourses(storageUtils.getCourses());
    setEnrollments(storageUtils.getEnrollments());
  }, []);

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingCourse(true);

    const formData = new FormData(e.currentTarget);
    const modules = (formData.get('modules') as string).split('\n').filter(m => m.trim());

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      instructor: formData.get('instructor') as string,
      duration: formData.get('duration') as string,
      level: formData.get('level') as 'Beginner' | 'Intermediate' | 'Advanced',
      image: '/src/assets/programming-course.jpg', // Default image
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      modules,
      rating: 4.5,
      students: 0
    };

    try {
      storageUtils.addCourse(newCourse);
      setCourses(storageUtils.getCourses());
      setIsDialogOpen(false);
      
      toast({
        title: "Course added successfully",
        description: `${newCourse.title} has been added to the platform.`,
      });

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingCourse(false);
    }
  };

  const getTotalStudents = () => {
    return courses.reduce((total, course) => total + course.students, 0);
  };

  const getRecentEnrollments = () => {
    return enrollments.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduPlatform Admin
            </h1>
            <p className="text-sm text-muted-foreground">Course Management Dashboard</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Dashboard Overview</h2>
              <p className="text-muted-foreground">
                Monitor your platform performance and manage courses
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getTotalStudents().toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled across all courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getRecentEnrollments()}</div>
                  <p className="text-xs text-muted-foreground">
                    Current enrollments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Courses */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Recent Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 3).map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isEnrolled={false}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">Course Management</h2>
                <p className="text-muted-foreground">
                  Create and manage your course catalog
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogDescription>
                      Create a new course for your platform
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter course title"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input
                          id="instructor"
                          name="instructor"
                          placeholder="Instructor name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Course description"
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 8 weeks"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Select name="level" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="299"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="e.g., Programming, Data Science"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modules">Course Modules (one per line)</Label>
                      <Textarea
                        id="modules"
                        name="modules"
                        placeholder="Introduction to Programming&#10;Variables and Data Types&#10;Control Structures"
                        required
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isAddingCourse}>
                      {isAddingCourse ? "Adding Course..." : "Add Course"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={false}
                />
              ))}
            </div>

            {courses.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No courses yet</CardTitle>
                  <CardDescription className="mb-4">
                    Create your first course to get started
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Analytics</h2>
              <p className="text-muted-foreground">
                Track platform performance and student engagement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium truncate">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.students} students
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {course.rating} ★
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Analytics data will appear here as students interact with your courses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};