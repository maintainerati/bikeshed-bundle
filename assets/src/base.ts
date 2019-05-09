import './components/font-awesome';
import './components/fonts';

import { EditNote } from './components/edit-note';
import { GitHubEmoji } from './components/github-emoji';
import { Menu } from './components/menu';

Menu.addListener();

GitHubEmoji.addListeners();
EditNote.addListeners();
