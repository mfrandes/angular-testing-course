import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';
import { TestBed } from '@angular/core/testing';



describe('CalculatorService', () => {

  let calculator: CalculatorService,
    loggerSpy: any;

  beforeEach(() => {
    console.log('before each');

    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    calculator = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    console.log('add');

    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    console.log('substract');

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected substract result ');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
