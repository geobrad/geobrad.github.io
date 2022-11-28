const e = React.createElement;

export const App = ({ state, dispatch }) => {
    return e('div', {},
        state.loading ? e(Loader) : null,
        e('header', null,
            e('h1', {className: state.pageId ? '' : 'largeable large'},
                e('a', {href: '#', onClick: () => dispatch({type: 'navigate', pageId: null})},
                    e('img', {src: "/images/logo-white.svg", alt: "George Bradley"})
                )
            ),
            e(Menu, {navigate: (pageId) => dispatch({type: 'navigate', pageId: pageId})}),
            e('button', {className: 'highlight', onClick: () => dispatch({type: 'show-contact'})}, 'Get in touch'),
        ),
        e('main', null,
            state.pageId == 'about' ? e('section', {className: state.pageId == 'about' ? 'active' : ''},
                e('h2', {}, e('a', {name: 'about'}, 'About me')),
            ) : null,
            state.pageId == 'skills' ? e('section', {className: state.pageId == 'skills' ? 'active' : ''},
                e('h2', {}, e('a', {name: 'about'}, 'Skills')),
            ) : null,
            e('noscript', {}, 'This website requires JavaScript to function properly.'),
        ),
        e('footer', null,
            "&copy; 2022 George Bradley"
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
        e('div', {className: 'spinner', style: {animationDelay: '000ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '100ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '200ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '300ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '400ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '500ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '600ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '700ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '800ms'}}),
        e('div', {className: 'spinner', style: {animationDelay: '900ms'}}),
    ),
);

const Menu = ({ navigate }) => e('nav', null,
    e('ul', null,
        e('li', null, e('a', {href: '#about', onClick: () => navigate('about')}, 'About')),
        e('li', null, e('a', {href: '#skills', onClick: () => navigate('skills')}, 'Skills')),
        e('li', null, e('a', {href: '#experience', onClick: () => navigate('experience')}, 'Experience')),
        e('li', null, e('a', {href: '#projects', onClick: () => navigate('projects')}, 'Projects')),
        e('li', null, e('a', {href: '#interests', onClick: () => navigate('interests')}, 'Interests')),
    ),
);

const ContactForm = ({ submit, cancel }) => e('div', {className: 'mask'},
    e('form', {className: 'dialog', onSubmit: submit},
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
