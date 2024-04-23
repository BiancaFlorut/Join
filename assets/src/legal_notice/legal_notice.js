
async function initLegalNotice() {
    if (isQueryParams()) {
        await init();
    } else {
    await includeHTML();
    hideUserMenu();
    }
}

function isQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasQueryParams = urlParams.toString().length > 0;
    return hasQueryParams;
}

function hideUserMenu() {
        const screenWidth = window.innerWidth;
        const navContainerDiv = document.getElementById('navContainer');
        const navBarDiv = document.getElementById('navBar');
        if (screenWidth <= 1130) {
            if (navBarDiv) {
                navBarDiv.classList.add('d_none');
                navContainerDiv.classList.remove('d_none');
                document.getElementById('legalNoticeDiv').style.height = 'calc(100vh - 140px)';
            }
        } else {
            if (navContainerDiv) {
                navContainerDiv.classList.add('d_none');
                navBarDiv.classList.remove('d_none');
            }
        }
    
}


window.addEventListener('resize', hideUserMenu);