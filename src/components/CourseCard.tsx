import { Course } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, Users, BookOpen, Play } from 'lucide-react';
import programmingImage from '@/assets/programming-course.jpg';
import dataScienceImage from '@/assets/data-science-course.jpg';
import webDevImage from '@/assets/web-dev-course.jpg';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll?: () => void;
  onUnenroll?: () => void;
  showProgress?: boolean;
}

export const CourseCard = ({ course, isEnrolled, onEnroll, onUnenroll, showProgress = false }: CourseCardProps) => {
  const getImageSrc = (imagePath: string) => {
    if (imagePath.includes('programming-course')) return programmingImage;
    if (imagePath.includes('data-science-course')) return dataScienceImage;
    if (imagePath.includes('web-dev-course')) return webDevImage;
    return programmingImage; // fallback
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success text-success-foreground';
      case 'Intermediate': return 'bg-accent text-accent-foreground';
      case 'Advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Course Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={getImageSrc(course.image)}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            ${course.price}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              by {course.instructor}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            <span>{course.modules.length} Modules</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {course.modules.slice(0, 2).join(' • ')}
            {course.modules.length > 2 && ` • +${course.modules.length - 2} more`}
          </div>
        </div>

        {/* Progress for enrolled courses */}
        {showProgress && isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">15%</span>
            </div>
            <Progress value={15} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {isEnrolled ? (
            <div className="space-y-2">
              <Button className="w-full gap-2" variant="default">
                <Play className="h-4 w-4" />
                Continue Learning
              </Button>
              <Button 
                className="w-full gap-2 text-destructive hover:text-destructive" 
                onClick={onUnenroll}
                variant="outline"
              >
                Remove Course
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full gap-2" 
              onClick={onEnroll}
              variant="outline"
            >
              <BookOpen className="h-4 w-4" />
              Enroll Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};