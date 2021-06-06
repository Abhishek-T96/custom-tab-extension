function renderContent() {
    const topVisited = document.querySelector('#topVisited');
    const bookmark = document.querySelector('#bookmark');
    topVisited.addEventListener('click',initTopVisited);
    bookmark.addEventListener('click',initBookMarks);

    const interval = setInterval(timerHandler,1000);

    chrome.tabs.onRemoved.addListener(() => {
        clearInterval(interval);
    })

    initTopVisited();
}

function timerHandler() {
    const timer = document.querySelector('#timer');
    const dateObj = new Date();
    const [hrs,mins,secs] = [dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()];
    timer.innerText = `${hrs} : ${mins} : ${secs}`;
} 

function initTopVisited() {
    const main = document.querySelector('#main');
    const list = document.createElement('ul');
    removeAllChildNodes(main);
    chrome.topSites.get(sites => {
        const listItems = sites.map(site => {
            const item = document.createElement('li');
            const linkTag = document.createElement('a');
            linkTag.href = site.url;
            linkTag.innerText = site.title;
            linkTag.target = "_blank";
            item.append(linkTag);
            return item;
        });
        list.append(...listItems);
        main.append(list);
    });
}

function initBookMarks() {
    const main = document.querySelector('#main');
    removeAllChildNodes(main);
    chrome.bookmarks.getChildren("0")
    .then( bookmarks => {
        createBooksMarkList(main, bookmarks);
    })
}

function getLinkTagElement(title,url) {
    const linkTag = document.createElement('a');
    linkTag.href = url;
    linkTag.innerText = title;
    linkTag.target = "_blank";
    return linkTag;
}

function getBookMarkButtonTag(title, id, elem) {
    const button = document.createElement('button');
    button.innerText = title;
    button.addEventListener('click',(e) => {
        chrome.bookmarks.getChildren(id)
        .then(bookmarks => {
            createBooksMarkList(elem, bookmarks);
            button.style.pointerEvents = "none";
        })
    });
    return button;
}

function createBooksMarkList(element, bookmarkArr) {

    const list = document.createElement('ul');
    const listItems = bookmarkArr.map(bm =>{
        const item = document.createElement('li');
        
        let actionTag;

        if(bm.url)
            actionTag = getLinkTagElement(bm.title,bm.url);
        else
            actionTag = getBookMarkButtonTag(bm.title,bm.id, item);
        
        item.append(actionTag);

        return item;
    })

    list.append(...listItems);

    element.append(list);
}

function removeAllChildNodes(element) {
    while(element.firstChild)
        element.firstChild.remove();
}

document.addEventListener("DOMContentLoaded", renderContent);