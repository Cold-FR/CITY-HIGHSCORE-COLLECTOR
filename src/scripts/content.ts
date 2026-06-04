/**
 * @file This file contains the content script for the extension.
 * @author Cold-FR
 * @last-modified 2025-02-09
 * @version 1.2.0
 * @github https://github.com/Cold-FR/CITY-QUEST-COLLECTOR
 */

const style = document.createElement('style');
style.innerHTML = `
    .highscore-hovered-extension:hover {
        cursor: pointer;
        border: 2px solid #38a4b8;
    }
`;
document.head.appendChild(style);

/**
 * The pseudos of the players.
 * @type {string[]}
 * @default []
 */
let pseudos: string[] = [];

/**
 * Listens for messages from the popup script.
 * @function
 * @param {Object} request - The request object.
 * @returns {void}
 * @listens chrome.runtime.onMessage
 */
chrome.runtime.onMessage.addListener((request) => {
  if (request !== 'listenClick') return;

  pseudos = [];
  initListeners();
});

/**
 * Initializes the listeners on the rankings.
 * @function
 * @returns {void}
 */
function initListeners(): void {
  const rankings = document.querySelectorAll('.nitro-widget-high-score.nitro-context-menu');
  rankings.forEach((ranking) => {
    ranking.addEventListener('click', rankingHandleClick);
    ranking.classList.add('highscore-hovered-extension');
  });
}

/**
 * Removes the listeners on the rankings.
 * @function
 * @returns {void}
 */
function removeListeners(): void {
  const rankings = document.querySelectorAll('.nitro-widget-high-score.nitro-context-menu');
  rankings.forEach((ranking) => {
    ranking.removeEventListener('click', rankingHandleClick);
    ranking.classList.remove('highscore-hovered-extension');
  });
}

/**
 * Handles the click event on the rankings. It retrieves the players' pseudos and stores them in the storage.
 * @function
 * @param {Event} e - The event.
 * @returns {void}
 */
function rankingHandleClick(e: Event): void {
  const target = e.target as HTMLElement;
  const ranking = target.closest('.nitro-widget-high-score.nitro-context-menu') as HTMLElement;

  const entries = ranking.querySelectorAll('.highscore-entry');
  entries.forEach((entry) => {
    const pseudoElement = entry.querySelector(
      '.d-inline.text-white.text-start.col-8'
    ) as HTMLElement;

    pseudos.push(`${pseudoElement.innerText}`);
  });

  removeListeners();
  chrome.storage.local.set({ players: pseudos });
}
