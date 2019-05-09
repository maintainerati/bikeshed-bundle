// tslint:disable:object-literal-sort-keys

export class FocusPicker {
    private form: HTMLFormElement;
    private eventElement: HTMLSelectElement;
    private sessionElement: HTMLSelectElement;
    private spaceElement: HTMLSelectElement;
    private joinElement: HTMLButtonElement;
    private tokenElement: HTMLInputElement;

    public constructor() {
        const form = document.querySelector('form[name="focus_form"]') as HTMLFormElement;
        if (!form) { throw Error('Could not find "focus_form" form element'); }
        this.form = form;
        const nodeList = form.elements as HTMLFormControlsCollection;
        this.eventElement = nodeList['focus_form[eventId]'];
        this.sessionElement = nodeList['focus_form[sessionId]'];
        this.spaceElement = nodeList['focus_form[spaceId]'];
        this.joinElement = nodeList['focus_form[join]'];
        this.tokenElement = nodeList['focus_form[_token]'];

    }

    public addListener(): void {
        // Event
        const eventId = document.getElementById('focus_form_eventId');
        if (!eventId) { throw Error('Could not find "focus_form_eventId" element'); }
        eventId.addEventListener('change', (event: Event) => {
            this.handleChange(event);
        });
        eventId.classList.remove('is-hidden');

        // Session
        const sessionId = document.getElementById('focus_form_sessionId');
        if (!sessionId) { throw Error('Could not find "focus_form_sessionId" element'); }
        sessionId.addEventListener('change', (event: Event) => {
            this.handleChange(event);
        });

        // Space
        const spaceId = document.getElementById('focus_form_spaceId');
        if (!spaceId) { throw Error('Could not find "focus_form_spaceId" element'); }
        spaceId.addEventListener('change', (event: Event) => {
            this.handleChange(event);
        });

        // Show/hide
        this.setVisibility();
    }

    public setVisibility(): void {
        const eventParent = FocusPicker.getFormControl(this.eventElement);
        const sessionParent = FocusPicker.getFormControl(this.sessionElement);
        const spaceParent = FocusPicker.getFormControl(this.spaceElement);

        eventParent.classList.remove('is-hidden');
        if (this.eventElement.selectedIndex > 0) {
            sessionParent.classList.remove('is-hidden');
        } else {
            sessionParent.classList.add('is-hidden');
            spaceParent.classList.add('is-hidden');
            this.joinElement.classList.add('is-hidden');
        }
        if (this.sessionElement.selectedIndex > 0) {
            spaceParent.classList.remove('is-hidden');
        } else {
            spaceParent.classList.add('is-hidden');
            this.joinElement.classList.add('is-hidden');
        }
        if (this.spaceElement.selectedIndex > 0) {
            this.joinElement.classList.remove('is-hidden');
        }
    }

    public static getFormControl(element: HTMLElement): HTMLDivElement {
        const select = element.parentElement as HTMLDivElement;
        if (!select) { throw Error('Cant find element select parent'); }
        const control = select.parentElement as HTMLDivElement;
        if (!control) { throw Error('Cant find element control parent'); }

        return control;
    }

    private handleChange(event: Event): void {
        this.submitForm()
            .then((response: string | void) => {
                const parser = new DOMParser();
                const htmlDom = parser.parseFromString(String(response), 'text/html');
                this.updateForm(htmlDom);
            })
            .catch((error) => { throw error; });
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
        .catch((error) => { throw error; });
    }

    private updateForm(htmlDom: Document): void {
        const form = htmlDom.querySelector('form[name="focus_form"]') as HTMLFormElement;
        if (!form) { throw Error('Could not find "focus_form" form element'); }
        [...form.querySelectorAll('select')]
            .forEach((node: HTMLSelectElement) => {
                const id = node.id;
                const element = document.getElementById(id) as HTMLElement;
                element.innerHTML = node.innerHTML;
            });
        this.setVisibility();
    }
}
