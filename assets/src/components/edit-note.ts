// tslint:disable:object-literal-sort-keys

interface INoteFormData {
    id: string;
    date: string;
    space: string;
    note: string;
    save: string;
}
export class EditNote {
    public static addListeners(): void {
        window.addEventListener('load', this.onLoad);
    }

    public static async onLoad(): Promise<void> {
        const links = document.getElementsByClassName('note-edit-link');
        [...links].forEach((link) => {
            link.addEventListener('click', EditNote.onEditClick);
        });
    }

    private static onEditClick(event: Event): void {
        event.preventDefault();

        const anchor = event.target as HTMLAnchorElement;
        if (!anchor) { throw Error('Could not find self as event target.'); }

        fetch(anchor.href)
            .then((response: Response) => response.text())
            .then((html: string) => {
                EditNote.insertEditForm(html, anchor);
            })
            .catch((error) => { console.log('Error', error); })
        ;
    }

    private static onSaveClick(event: Event): void {
        event.preventDefault();

        const button = event.target as HTMLButtonElement;
        if (!button) { throw Error('Can not find button that was just clicked!'); }
        const formId = button.getAttribute('data-form-id') as string;
        const formName = button.getAttribute('data-form-name') as string;

        const formElement = document.getElementById(formId) as HTMLDivElement;
        const editElement = formElement.parentElement as HTMLDivElement;
        const displayElementId = editElement.getAttribute('data-display-id') as string;
        const displayElement = document.getElementById(displayElementId) as HTMLDivElement;

        const forms = document.forms;
        const form = forms[formName] as HTMLFormElement;
        if (!form) { throw Error(`Can not find button form "${formName}"`); }

        const submittedForm = new FormData(form);
        const request = new Request(form.action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: submittedForm,
        });
        fetch(request)
            .then((response: Response) => response.text())
            .then((html: string) => {
                displayElement.classList.remove('is-hidden');
                displayElement.innerHTML = html;
                editElement.classList.add('is-hidden');
                editElement.innerHTML = '';
            })
            .catch((error) => { console.log('Error', error); });
    }

    private static insertEditForm(html: string, anchor: HTMLAnchorElement): void {
        const displayId = anchor.getAttribute('data-display-id') as string;
        const editId = anchor.getAttribute('data-edit-id') as string;
        const displayElement = document.getElementById(displayId) as HTMLDivElement;
        const editElement = document.getElementById(editId) as HTMLDivElement;

        displayElement.classList.add('is-hidden');
        editElement.classList.remove('is-hidden');
        editElement.innerHTML = html;

        const buttons = editElement.getElementsByTagName('button') as HTMLCollectionOf<HTMLButtonElement>;
        for (const button of [...buttons]) {
            if (button.type === 'submit') {
                button.addEventListener('click', EditNote.onSaveClick);
            }
        }
    }
}
