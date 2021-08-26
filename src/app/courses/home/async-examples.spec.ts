import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Async Test Example', () => {
  it('Asyncronous test example with Jasmine donne()', (donne: DoneFn) => {
    let test = false;
    setTimeout(() => {
      test = true;

      expect(test).toBeTruthy();
      donne();
    }, 500);
  });

  it('Asynchromous test example - setTimeout()', fakeAsync(() => {
    let test = false;
    setTimeout(() => { });
    setTimeout(() => {
      test = true;
    }, 1000);

    flush();

    expect(test).toBeTruthy();
  }));

  it('Asynchromous test example - plain promise()', fakeAsync(() => {

    let test = false;

    console.log('create promise');

    Promise.resolve().then(() => {
      console.log('Promise evaluate');

      return Promise.resolve();
    })
      .then(() => {
        console.log('Promise evaluate second');

        test = true;

      });

    flushMicrotasks();

    console.log('Runing test assertions');

    expect(test).toBeTruthy();

  }));

  it('Asynchromous test example - Promise + setTimeout()', fakeAsync(() => {

    let counter = 0;
    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

    expect(counter).toBe(0);

    flushMicrotasks();
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(11);


  }));

  it('Asynchromous test example - Observables ', fakeAsync(() => {
    let test = false;
    console.log('Creating Observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {

      test = true;
    });

    tick(1000);
    console.log('run assertions');
    expect(test).toBe(true);

  }));
});
