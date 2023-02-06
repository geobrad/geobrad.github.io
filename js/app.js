const e = React.createElement;

const revalidateContactForm = (dispatch) => {
    const fields = document.getElementById('contact-form').elements;
    if (true
        && fields['name'].value.trim().length > 0
        && fields['email-or-phone'].value.trim().length > 0
        && fields['message'].value.trim().length > 0
        && grecaptcha.getResponse().length > 0
    ) {
        dispatch({type: 'contact-enable'});
    } else {
        dispatch({type: 'contact-disable'});
    }
};

export const App = ({ state, dispatch }) => {
    const navigate = (pageId) => {
        window.scrollTo(0, 0);
        document.querySelector('nav.dropdown').classList.remove('active');
        dispatch({ type: 'navigate', pageId: pageId });
    };

    window.onGRecaptchaChange = () => revalidateContactForm(dispatch);

    return e('div', {id: 'app', className: `${state.pageId == null ? 'cover' : ''} ${state.modalId != null || state.loading ? 'masked' : ''}`},
        state.loading ? e(Loader) : null,
        e(Header),
        // state.pageId == null ? e('main', {},
        //     e('div', {className: 'title'}, e('h2', {}, 'etc...')),
        // ) : null,
        // state.pageId == 'about' ? e('main', {},
        //     e('h2', {}, 'About me'),
        // ) : null,
        // state.pageId == 'skills' ? e('main', {},
        //     e('h2', {}, 'Skills'),
        // ) : null,
        e('main', {},
            e(TitleSection),
            e(BlurbSection),
            e(ContactSection, {
                isEnabled: state.contactFormEnabled,
                submitHandler: (ev) => {
                    ev.preventDefault();
                    dispatch({type: 'contact-submit', form: ev.target})
                },
                changeHandler: (ev) => revalidateContactForm(dispatch),
            }),
        ),
        e(Footer),
        // state.modalId == 'contact-form' ? e(ContactForm, {
        //     submit: (ev) => {
        //         ev.preventDefault();
        //         dispatch({ type: 'contact-submit', form: ev.target })
        //     },
        //     cancel: () => dispatch({ type: 'contact-cancel' }),
        // }) : null,
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

const NavMenu = ({ dropdown, activePageId, navigate }) => e('nav', {className: dropdown ? 'dropdown' : 'inline'},
    e('ul', {},
        e(NavMenuItem, { id: 'about', label: 'About', activePageId, navigate }),
        e(NavMenuItem, { id: 'skills', label: 'Skills', activePageId, navigate }),
        e(NavMenuItem, { id: 'experience', label: 'Experience', activePageId, navigate }),
        e(NavMenuItem, { id: 'projects', label: 'Projects', activePageId, navigate }),
        e(NavMenuItem, { id: 'interests', label: 'Interests', activePageId, navigate }),
    ),
);

const NavMenuItem = ({ id, label, activePageId, navigate }) => e('li', null,
    e('a', {
            className: activePageId == id ? 'active' : '',
            href: `#${id}`,
            onClick: () => navigate(id)
        }, label),
);

const NavMenuIcon = () => e('input', {
    id: 'nav-menu-icon',
    type: 'image',
    src: '/images/hamburger_icon_eee.svg',
    alt: 'Menu',
    onClick: () => document.querySelector('nav.dropdown').classList.toggle('active'),
});

const ContactSuccess = ({ dispatch }) => e(MessageBox, { dispatch },
    e('h2', null, 'Message sent'),
    e('p', null,
            'Thank you for getting in touch. ',
            'I will endeavour to get back to you as quickly as I can.'
        ),
);

const ContactError = ({ dispatch }) => e(MessageBox, { dispatch },
    e('h2', null, 'Oops!'),
    e('p', null, 'Something broke. Please try again later.'),
);

const MessageBox = ({ dispatch, children }) => e('div', {className: 'mask'},
    e('div', {className: 'dialog'},
        children,
        e('button', {onClick: () => dispatch({ type: 'close-dialog' })}, 'Okay'),
    ),
);

const Header = () => e('header', null,
    // e('div', {id: 'header-background'}),
    e('div', {id: 'header-content'},
        e('div', {className: 'left', style: {display: 'flex'}},
            // e(NavMenuIcon),
            e('h1', {},
                e('a', { href: '#top' },
                    e('img', {src: "/images/logo-white.svg", alt: "George Bradley - Home"})
                ),
            ),
        ),
        e('div', {className: 'right'},
            e('a', { href: '#contact', className: 'buttonlike highlight' }, 'Get in touch'),
            // e(NavMenu, {dropdown: false, activePageId: state.pageId, navigate}),
            // e('button', {className: 'highlight', onClick: () => dispatch({type: 'show-contact'})}, 'Get in touch'),
        )
    ),
    // e(NavMenu, {dropdown: true, activePageId: state.pageId, navigate}),
);

const TitleSection = () => e('section', { id: 'title-section', className: 'cover' },
    e('div', null, // cover content
        'Delivering real-world value through technology.', e('br'),
        // 'Delivery.', e('br'),
    ),
);

const BlurbSection = () => e('section', {className: 'narrow'},
    e('p', {}, '\
        I am a seasoned software development manager with 10 years\' experience managing software development teams and products. \
        A veteran in running agile software development processes, \
        my broad technical background encompasses enterprise SaaS applications, \
        industrial machinery automation systems, advanced mathematical optimisation engines and more. \
    '),
    e('p', {}, '\
        My professional passion is in building and leading teams to create outsized business value through well-designed software technology. \
        In my spare time I enjoy skiing, running, cycling, spending time with my family and experimenting with machine learning algorithms.\
    '),
);

const ContactSection = ({ isEnabled, submitHandler, changeHandler }) => e('section', {className: 'narrow'},
    e(SectionHeading, { name: 'contact', text: 'Get in touch' }),
    e('p', {}, '\
        If you\'d like to reach out, please provide your details and let me know how I can help in the form below.\
    '),
    e('form', { id: 'contact-form', onSubmit: submitHandler, onChange: changeHandler },
        e(TextInput, { name: 'name', label: 'Name*' }),
        e(TextInput, { name: 'email-or-phone', label: 'Email/phone*' }),
        e(TextAreaInput, { name: 'message', label: 'What can I do for you?*' }),
        e('div', {
            className: 'g-recaptcha',
            'data-sitekey': '6LfQyRojAAAAAAW4q7PYkfBmgNMPetdYNx6VS5iU',
            'data-theme': 'dark',
            'data-callback': 'onGRecaptchaChange',
            'data-expired-callback': 'onGRecaptchaChange',
         }),
        e('div', { className: 'buttons' },
            e('button', { className: 'highlight', ...(!isEnabled && { disabled: true, title: 'Please complete all fields marked with an asterisk and confirm you are not a robot.' }) }, 'Send'),
        ),
    ),
);

const Footer = () => e('footer', null,
    "© 2023 George Bradley"
);

const SectionHeading = ({ name, text }) => e('h2', {}, e('a', { name }, text));

const TextInput = ({ name, label, placeholder }) => e('div', null,
    e('label', { htmlFor: name }, label),
    e('input', { name, placeholder }),
);

const TextAreaInput = ({ name, label, placeholder }) => e('div', null,
    e('label', { htmlFor: name }, label),
    e('textarea', { name, placeholder }),
);
