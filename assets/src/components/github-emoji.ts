const githubApiUrl = 'https://api.github.com/emojis';

export class GitHubEmoji {
    public static async addListeners(): Promise<void> {
        window.addEventListener('load', GitHubEmoji.handleOnLoad);
    }

    public static async handleOnLoad(event: Event): Promise<void> {
        const emojiDiv = document.getElementById('emoji') as HTMLDivElement;
        if (!emojiDiv) { throw Error('Emoji div not found'); }
        const data = emojiDiv.getAttribute('data-emoji');
        if (!data)  { throw Error('Emoji div data not found'); }
        const emojis = JSON.parse(data.valueOf());
        const notes = document.getElementsByClassName('note-content') as HTMLCollectionOf<HTMLDivElement>;

        [...notes].forEach((note: HTMLDivElement) => {
            GitHubEmoji.parse(note, emojis)
                .catch((error) => console.log('error', error));
            note.addEventListener('change', GitHubEmoji.handleOnChange);
        });
    }

    public static async handleOnChange(event: Event): Promise<void> {
        console.log('change event!');
    }

    private static async parse(field: HTMLDivElement, emojis: object): Promise<void> {
        let html = field.innerHTML;
        const regex = /(:[a-zA-Z_]{3,}:)|(\/play [a-zA-Z_]{4,})/gm;
        const found = html.match(regex);
        if (!found) { return; }
        found.forEach((item) => {
            const name = item.replace(new RegExp(':', 'g'), '');
            const url = emojis[name];
            if (url) {
                html = html.replace(
                    new RegExp(item, 'g'),
                    `<img src="${url}" class="image is-24x24 is-inline"/>`)
                ;
            }
        });
        field.innerHTML = html;
    }
}
