import { CoursesService } from './courses.service';
import { TestBed, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';



describe('CoursesService', () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
        HttpClientTestingModule
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrive all courses', () => {

    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('No courses found');
        expect(courses.length).toBe(12, 'incorect number of courses');
        const course = courses.find(c => c.id === 12);
        expect(course.titles.description).toBe('Angular Testing Course');
      });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({ payload: Object.values(COURSES) });

  });

  it('should find course by id', () => {

    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy('Course not found');
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);

  });

  it('should modify data', () => {

    const changes: Partial<Course> = {
      titles: {
        description: 'testing Course'
      }
    };
    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course.id).toBe(12);

      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    req.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('should give a error if save fails', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'testing Course'
      }
    };

    coursesService.saveCourse(12, changes)
      .subscribe(() => fail('the save course operation should have failes'), (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      });
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');

    req.flush('Save course,failed', {
      status: 500,
      statusText: 'internal server error'
    });
  });



  it('should find sa list of lessons', () => {
    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

    const req = httpTestingController.expectOne(request => request.url === '/api/lessons');

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
