import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const inputSearch     = document.getElementById('search') as HTMLInputElement;
const divContent      = document.getElementById('result') as HTMLDivElement;
const changeSequence$ = fromEvent(document, 'keyup');

function request() {
    return fetch('https://api.github.com/search/repositories?q=' + inputSearch.value)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }
            return null;
        });
}

const requestSequence$ = changeSequence$.pipe(
    switchMap(
        (_keyup) => request()
    )
);

type r = {
    html_url: string
};

setTimeout(() => {
    requestSequence$.subscribe((res) => {
        // tslint:disable-next-line
        console.log(res);
        if (null !== res) {
            const data = res.items;
            // tslint:disable-next-line
            console.log(data);
            divContent.innerHTML = '';
            data.forEach((repo: r) => {
                const p = document.createElement('p');
                p.textContent = `${repo.html_url}`;
                divContent.appendChild(p);
            });
        } else {
            divContent.innerHTML = '';
        }
    });
}, 3000);
