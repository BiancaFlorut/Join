/**
 * Initializes the legal notice and privacy policy functionality.
 *
 * @return {Promise<void>} A promise that resolves once the initialization is complete.
 */
async function initLegalNoticePrivacyPolicy() {
    if (isQueryParams()) {
        await init();
    } else {
    await includeHTML();
    hideUserMenu();
    }
}

/**
 * Checks if the current URL has query parameters.
 *
 * @return {boolean} Returns true if the URL has query parameters, false otherwise.
 */
function isQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasQueryParams = urlParams.toString().length > 0;
    return hasQueryParams;
}

/**
 * Hides the user menu based on the screen width.
 *
 * @return {void} No return value.
 */
function hideUserMenu() {
        const screenWidth = window.innerWidth;
        const navContainerDiv = document.getElementById('navContainer');
        const navBarDiv = document.getElementById('navBar');
        if (screenWidth <= 1130) {
            if (navBarDiv) {
                navBarNoUserMobile(navBarDiv, navContainerDiv);
            }
        } else {
            if (navContainerDiv) {
                navBarNoUserDesktop(navBarDiv, navContainerDiv);
            }
        }
}

window.addEventListener('resize', hideUserMenu);

/**
 * Function to handle the mobile view of the navigation bar for users without accounts.
 *
 * @param {HTMLElement} navBarDiv - The navigation bar element.
 * @param {HTMLElement} navContainerDiv - The navigation container element.
 * @return {void} This function does not return anything.
 */
function navBarNoUserMobile(navBarDiv, navContainerDiv) {
    navBarDiv.classList.add('d_none');
    navContainerDiv.classList.remove('d_none');
    function adjustHeightIfExists(elementId, newHeight) {
        let element = document.getElementById(elementId);
        if (element) {
            element.style.height = newHeight;
        }
    }
    adjustHeightIfExists('privacyPolicyDiv', 'calc(100vh - 140px)');
    adjustHeightIfExists('legalNoticeDiv', 'calc(100vh - 140px)');
}

/**
 * Toggles the visibility of navBar and navContainer on desktop view.
 *
 * @param {HTMLElement} navBarDiv - The navigation bar element to hide.
 * @param {HTMLElement} navContainerDiv - The navigation container element to show.
 * @return {void}
 */
function navBarNoUserDesktop(navBarDiv, navContainerDiv) {
    navContainerDiv.classList.add('d_none');
    navBarDiv.classList.remove('d_none');
}

