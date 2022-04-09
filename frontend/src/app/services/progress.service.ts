import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*

    THIS SERVICE STORES A QUEUE OF LOADING TASKS, THUS MONITORING IF THERE IS A
    LOADING TASK. IT CAN BE USED FOR VISUALISATIONS OF LOADING, SUCH AS A
    PROGRESS BAR AT THE TOP OF THE PAGE, OR A PROGRESS SPINNER IN THE MIDDLE OF
    THE PAGE

*/

@Injectable()
export class ProgressService {

    private tasksQueue: boolean[] = [];
    private progressSubject = new BehaviorSubject<boolean[]>([]);

    /* ADD TASK TO PROGRESS QUEUE */
    public load () {
        this.tasksQueue.push(true);
        this.progressSubject.next(this.tasksQueue);
    }

    /* REMOVE TASK FROM PROGRESS QUEUE */
    public complete () {
        this.tasksQueue.shift();
        this.progressSubject.next(this.tasksQueue);
    }

    /* CLEAR PROGRESS QUEUE */
    public clear () {
        this.tasksQueue = [];
        this.progressSubject.next(this.tasksQueue);
    }

    /* GET OBSERVABLE FROM PROGRESS QUEUE */
    public getStatus () {
        return this.progressSubject.asObservable();
    }

}
