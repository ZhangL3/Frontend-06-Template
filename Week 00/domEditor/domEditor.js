const childView = document.querySelector('#child-view');
console.log(childView);
const iframeWindow = childView.contentWindow;
const childViewBody = childView.contentWindow.document.querySelector('body');




function refreshIframeWindow() {
    iframeWindow.location.reload();
}

function addChildNode(parentElement, newElementTag, text) {
    const newE = document.createElement(newElementTag);
    newE.innerText = text;
    console.log('newE: ', newE);
    console.log('parentElement:', parentElement);
    
    parentElement.appendChild(newE);
    console.log(childView);

    refreshIframeWindow();
}

addChildNode(childViewBody, 'p', 'hahaha')

const cdiv = childViewBody.childNodes;
console.log(cdiv);

