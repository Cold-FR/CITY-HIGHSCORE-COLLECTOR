/**
 * @file This file contains the popup script.
 * @author Cold-FR
 * @last-modified 2025-02-08
 * @version 1.1
 * @github https://github.com/Cold-FR/CITY-QUEST-COLLECTOR
 */

/**
 * @type {HTMLDivElement} - The players list.
 * @default document.getElementById('players-list')
 * @readonly
 */
const playersList = document.getElementById('players-list');

/**
 * @type {HTMLFormElement} - The select ranking form.
 * @default document.getElementById('select-ranking')
 * @readonly
 */
const form = document.getElementById('select-ranking');

/**
 * The form submit event.
 * @function
 * @param {Event} e - The event.
 * @returns {void}
 * @listens submit
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(e.submitter.classList.contains('clicked')) return;

    document.getElementById('select-ranking-btn').classList.add('clicked');

    return sendListenMessage();
});

/**
 * The document ready event.
 * @function
 * @returns {void}
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    displayPlayersList();

    chrome.storage.local.get('darkMode', (data) => {
        if(data.darkMode) document.documentElement.classList.add('black');
    });
});

/**
 * The color mode button click event.
 * @function
 * @returns {void}
 * @listens click
 */
document.getElementById('colorMode').addEventListener('click', () => {
    toggleColorMode();
});

/**
 * Toggles the color mode.
 * @function
 * @returns {void}
 */
function toggleColorMode() {
    if(document.documentElement.classList.contains('black')) {
        chrome.storage.local.set({darkMode: false}).then(r => document.documentElement.classList.remove('black'));
    } else {
        chrome.storage.local.set({darkMode: true}).then(r => document.documentElement.classList.add('black'));
    }
}

/**
 * Displays the ignored values list.
 * @function
 * @returns {void}
 */
function displayPlayersList() {
    playersList.innerHTML = '';

    chrome.storage.local.get('players', (data) => {
        playersList.innerHTML = '';

        if (data.players && data.players.length > 0) {
            const textArea = document.createElement('textarea');
            textArea.readOnly = true;
            textArea.value = data.players.join(',');
            playersList.appendChild(textArea);

            const copyButton = document.createElement('button');
            copyButton.innerText = "Copier";
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(textArea.value).then(r => {
                    copyButton.innerText = "Copié !";
                    setTimeout(() => copyButton.innerText = "Copier", 1000);
                });
            });
            playersList.appendChild(copyButton);
        } else {
            const p = document.createElement('p');
            p.classList.add('empty');
            p.innerText = `Aucun joueur dans ce classement.`;
            playersList.appendChild(p);
        }
    });
}

/**
 * Sends a message to the content script to listen to click event on rankings.
 * @function
 * @returns {void}
 */
function sendListenMessage() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab.url.match('habbocity.me')) return;

        chrome.tabs.sendMessage(activeTab.id, 'listenClick');
    });
}
