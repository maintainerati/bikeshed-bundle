export class Menu {
    public static addListener(): void {
        const burger = document.querySelector('.burger') as HTMLButtonElement;
        if (!burger) { throw Error('Could not find "burger" element'); }
        const nav = document.querySelector(`#${burger.dataset.target}`);
        if (!nav) { throw Error('Could not find "nav" element'); }

        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            nav.classList.toggle('is-active');
        });
    }
}
