import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const inputSearch     = document.getElementById('search') as HTMLInputElement;
const changeSequence$ = fromEvent(document, 'keyup');

function request() {
    return fetch('https://api.github.com/search/repositories?q=' + inputSearch.value)
        .then((res) => res.json());
}

const requestSequence$ = changeSequence$.pipe(
    switchMap(
        (_keyup) => request()
    )
);

setTimeout(() => {
    requestSequence$.subscribe((res) => {
        // tslint:disable-next-line
        console.log(res);
    });
}, 1000);
