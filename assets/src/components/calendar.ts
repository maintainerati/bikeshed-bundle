// tslint:disable:object-literal-sort-keys
import bulmaCalendar from 'bulma-calendar';

export class Calendar {
    public static addListener(): void {
        const options = {
            type: 'date',
            dateFormat: 'YYYY-MM-DD',
        };
        const calendars = bulmaCalendar.attach('[type="date"]', options);
        calendars.forEach((calendar) => {
            calendar.on('date:selected', (date) => {
                console.log('date dump', date);
            });
        });
    }
}
