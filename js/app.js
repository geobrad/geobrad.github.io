const e = React.createElement;

export const App = ({ state, dispatch }) => {
    return e('div', {id: 'app', className: `${state.pageId == null ? 'cover ' : ' '} scroll-top`},
        state.loading ? e(Loader) : null,
        e('header', null,
            e('div', {},
                e('h1', {},
                    e('a', {href: '#', onClick: () => dispatch({type: 'navigate', pageId: null})},
                        e('img', {src: "/images/logo-white.svg", alt: "George Bradley"})
                    )
                ),
                e(NavMenu, {activeId: state.pageId, navigate: (pageId) => {
                    window.scrollTo(0, 0);
                    dispatch({ type: 'navigate', pageId: pageId });
                }}),
                e('button', {className: 'highlight', onClick: () => dispatch({type: 'show-contact'})}, 'Get in touch'),
            ),
        ),
        e('main', null,
            state.pageId == null ? e('section', {},
                e('h2', {}, 'etc...'),
            ) : null,
            state.pageId == 'about' ? e('section', {},
                e('h2', {}, 'About me'),
            ) : null,
            state.pageId == 'skills' ? e('section', {},
                e('h2', {}, 'Skills'),
            ) : null,
        ),
        e('footer', null,
            "© 2022 George Bradley"
        ),
        state.modalId == 'contact-form' ? e(ContactForm, {
            submit: (ev) => {
                ev.preventDefault();
                dispatch({type: 'contact-submit', form: ev.target})
            },
            cancel: () => dispatch({type: 'contact-cancel'}),
        }) : null,
        state.modalId == 'contact-success' ? e(ContactSuccess, { dispatch }) : null,
        state.modalId == 'contact-error' ? e(ContactError, { dispatch }) : null,
    );
};

const Loader = () => e('div', {className: 'mask', id: 'loading'},
    e('div', null,
        [...Array(10).keys()].map(
            (i) => e('div', {className: 'spinner', style: {animationDelay: `${100 * i}ms`}, key: i})
        )
    ),
);

const NavMenu = ({ activeId, navigate }) => e('nav', null,
    e('ul', null,
        e(NavMenuItem, { id: 'about', label: 'About', activeId, navigate }),
        e(NavMenuItem, { id: 'skills', label: 'Skills', activeId, navigate }),
        e(NavMenuItem, { id: 'experience', label: 'Experience', activeId, navigate }),
        e(NavMenuItem, { id: 'projects', label: 'Projects', activeId, navigate }),
        e(NavMenuItem, { id: 'interests', label: 'Interests', activeId, navigate }),
    ),
);

const NavMenuItem = ({ id, label, activeId, navigate }) => e('li', null,
    e('a', {
            className: activeId == id ? 'active' : '',
            href: `#${id}`,
            onClick: () => navigate(id)
        }, label),
);

const ContactForm = ({ submit, cancel }) => e('div', {className: 'mask', onScroll: (ev) => {ev.stopPropagation();}},
    e('form', {className: 'dialog', id: 'contact-form', onSubmit: submit},
        e('h2', {}, 'Send me a note'),
        e('label', {htmlFor: 'name'}, 'Name*'),
        e('input', {name: 'name', placeholder: 'How would you like me to address you?'}),
        e('label', {htmlFor: 'email-or-phone'}, 'Email/Phone*'),
        e('input', {name: 'email-or-phone', placeholder: 'How shall I get back in touch with you?'}),
        e('label', {htmlFor: 'message'}, 'Note*'),
        e('textarea', {name: 'message', placeholder: 'What can I do for you?'}),
        e('div', {className: 'g-recaptcha', 'data-theme': 'dark', 'data-sitekey': '6LfQyRojAAAAAAW4q7PYkfBmgNMPetdYNx6VS5iU'}),
        e('div', {className: 'buttons'},
            e('button', {type: 'button', onClick: cancel}, 'Cancel'),
            e('button', {className: 'highlight'}, 'Send'),
        ),
    ),
);

const ContactSuccess = ({ dispatch }) => e(MessageBox, { dispatch },
    e('h2', null, 'Note sent'),
    e('p', null, 'Thank you for getting in thouch.'),
);

const ContactError = ({ dispatch }) => e(MessageBox, { dispatch },
    e('h2', null, 'Something broke'),
    e('p', null, 'Please try again later.'),
);

const MessageBox = ({ dispatch, children }) => e('div', {className: 'mask'},
    e('div', {className: 'dialog'},
        children,
        e('button', {onClick: () => dispatch({ type: 'close-dialog' })}, 'Okay'),
    ),
);
