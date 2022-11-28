const listeners = [];

const CONTACT_FORM_URL = 'https://tibe4cjvlaa6n3uiigneprp35q0tdyhc.lambda-url.ap-southeast-2.on.aws/';

export let state = {
    pageId: window.location.hash || null,
    modalId: null,
    loading: true,
}

function apply(state, action) {
    console.log(action);
    switch (action.type) {
        case 'init':
            return {
                ...state,
                loading: false,
            }
        case 'navigate':
            return {
                ...state,
                pageId: action.pageId,
            };
        case 'show-contact':
            return {
                ...state,
                modalId: 'contact-form',
            };
        case 'contact-submit':
            submitForm(action.form)
                .then(() => dispatch({type: 'contact-success'}))
                .catch(() => dispatch({ type: 'contact-error' }));
            return {
                ...state,
                loading: true,
            };
        case 'contact-success':
            return {
                ...state,
                loading: false,
                modalId: 'contact-success',
            };
        case 'contact-error':
            return {
                ...state,
                loading: false,
                modalId: 'contact-error',
            };
        case 'contact-cancel':
            return {
                ...state,
                modalId: null,
            };
        case 'close-dialog':
            return {
                ...state,
                modalId: null,
            };
        default:
            throw new Error(`Unrecognized action type: ${action.type}`);
    }
}

function getFormEntries(form) {
    const entries = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => { entries[key] = value });
    return entries;
}

function submitForm(form) {
    return fetch(CONTACT_FORM_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getFormEntries(form)),
    }).then((resp) => resp.ok ? Promise.resolve() : Promise.reject())
}

export function dispatch(action) {
    state = apply(state, action);
    listeners.forEach(f => f(state));
}

export function addListener(callback) {
    listeners.push(callback);
}
