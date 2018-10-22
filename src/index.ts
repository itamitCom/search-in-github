import { fromEvent, Observable }              from 'rxjs';
import { switchMap, map, filter }             from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';

const inputSearch     = document.getElementById('search') as HTMLInputElement;
const divContent      = document.getElementById('result') as HTMLDivElement;
const changeSequence$ = fromEvent(inputSearch, 'keyup');

type r = {
    html_url: string
};

function search(source$: Observable<Event>): any {
    return source$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((event: Event) => (event.target as HTMLInputElement).value),
        filter((value: string) => (value.length > 2 && value !== '')),
        switchMap((query: string) => fetch(`https://api.github.com/search/repositories?q=${query}`)
            .then((res) => res.json())
        )
    );
}

search(changeSequence$)
    .subscribe((res: any) => {
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
