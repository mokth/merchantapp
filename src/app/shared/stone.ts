import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const currentPage$ = new BehaviorSubject<number>(0);