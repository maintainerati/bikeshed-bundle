// tslint:disable:object-literal-sort-keys

export class NoteTaker {
    private notes: HTMLDivElement;
    private form: HTMLFormElement;
    private button: HTMLButtonElement;

    public constructor() {
        const notes = document.getElementById('notes') as HTMLDivElement;
        if (!notes) { throw Error('Could not find "note_form" form element'); }
        this.notes = notes;

        const form = document.querySelector('form[name="note_form"]') as HTMLFormElement;
        if (!form) { throw Error('Could not find "note_form" form element'); }
        this.form = form;

        const button = document.getElementById('note_form_post') as HTMLButtonElement;
        if (!button) { throw Error('Could not find "note_form_post" form element'); }
        this.button = button;
    }

    public addListener(): void {
        this.button.addEventListener('click', (event: MouseEvent) => {
            this.handleClick(event);
        });
    }

    private handleClick(event: MouseEvent): void {
        event.preventDefault();

        this.submitForm()
            .then((response: string | void) => {
                const parser = new DOMParser();
                const htmlDom = parser.parseFromString(String(response), 'text/html');
                this.updatePage(htmlDom);
            });
    }

    private async submitForm(): Promise<string | void> {
        return await fetch(this.form.action, {
            method: 'post',
            body: new FormData(this.form),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then((response: Response): Response => {
            if (response.redirected) { window.location.replace(response.url); }

            return response;
        })
        .then((response) => response.text())
        .catch((error) => console.error('Error:', error));
    }

    private updatePage(htmlDom: Document): void {
        const notes = htmlDom.getElementById('notes') as HTMLDivElement;
        if (!notes) { throw Error('Could not find "notes" element'); }
        this.notes.innerHTML = notes.innerHTML;

        const note = document.getElementById('note_form_note') as HTMLTextAreaElement;
        note.value = '';
    }
}
