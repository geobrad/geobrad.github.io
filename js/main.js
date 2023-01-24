import * as Store from './store.js';
import { App } from './app.js';


function contactFormSubmitHandler(ev) {
    ev.preventDefault();
    const contact = document.getElementById('contact');
    const loader = document.getElementById('loading');
    const success = document.getElementById('contact-success');
    const failure = document.getElementById('contact-error');
    loader.classList.add('active');
    const formEntries = getFormEntries(ev.target);
    console.log(formEntries);
    fetch(CONTACT_FORM_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formEntries),
    }).then((resp) => {
        if (!resp.ok) return Promise.reject(resp);
        success.classList.add('active');
    }).catch(() => {
        failure.classList.add('active');
    }).finally(() => {
        contact.classList.remove('active');
        loader.classList.remove('active');
    });
}

function headingScrollHandler(ev) {
    if (window.scrollY < 10) {
        document.getElementById('app').classList.remove('scrolled');
    } else {
        document.getElementById('app').classList.add('scrolled');
    }
}

function renderApp() {
    console.log('Rendering', Store.state)
    root.render(React.createElement(App, {state: Store.state, dispatch: Store.dispatch}));
}

function init() {
    Store.dispatch({ type: 'init' });
}


window.addEventListener('load', init);
window.addEventListener('scroll', headingScrollHandler);
Store.addListener(renderApp);

const domContainer = document.getElementById('app-container');
const root = ReactDOM.createRoot(domContainer);
renderApp();