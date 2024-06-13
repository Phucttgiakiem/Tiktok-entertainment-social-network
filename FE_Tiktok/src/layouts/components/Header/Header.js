import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import config from '~/config';
import styles from './Header.module.scss';
import images from 'assets/images';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    faEllipsisVertical,
    faEarthAsia,
    faCircleQuestion,
    faKeyboard,
    faSignOut,
} from '@fortawesome/free-solid-svg-icons';

import Menu from '~/components/Popper/Menu';
// import { faKeybase } from '@fortawesome/free-brands-svg-icons';

import { faUser, faCoins, faGear } from '@fortawesome/free-solid-svg-icons';
import { InboxIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '~/pages/Search';
import Login from 'pages/login/Login';
import Cookies from 'js-cookie';
const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];

function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState(false);
    const [idUser, setIdUser] = useState('');
    const [Avatar, setAvatar] = useState('');
    const handleLogoutAccount = () => {
        Cookies.remove('iduser');
        Cookies.remove('email');
        Cookies.remove('avatar');
        setCurrentUser(false);
        setIdUser('');          
        setAvatar('');
        window.location.reload();
    };
    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.to) {
            case '/logout':
                handleLogoutAccount();
                break;
            default:
        }
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
            to: '/@hoaa',
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'Get coins',
            to: '/coin',
        },
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Setting',
            to: '/settings',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/logout',
            separate: true,
        },
    ];
    const handleLogin = () => {
        setShowLogin((prev) => !prev);
    };
    const handleHideLogin = () => {
        setShowLogin(false);
    };
    
    useEffect(() => {
        const cookieValue = Cookies.get('iduser');
        const cookieValueavatar = Cookies.get('avatar');
        if (cookieValue !== undefined) {
            setIdUser(cookieValue);
            setCurrentUser(true);
        }
        if (cookieValueavatar !== undefined) {
            setAvatar(cookieValueavatar);
        }
    }, []);
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="tiktok" />
                </Link>

                <Search />
                <div className={cx('actions')}>
                    {currentUser ? (
                        <>
                            <Tippy delay={[0, 50]} content="Upload video" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <UploadIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <MessageIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <InboxIcon />
                                    <span className={cx('badge')}>12</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button text>Upload</Button>
                            <Button primary onClick={handleLogin}>
                                Log in
                            </Button>
                        </>
                    )}
                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {currentUser ? (
                            <Image
                                src={
                                    Avatar ||
                                    'https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D'
                                }
                                className={cx('user-avatar')}
                                alt="Nguyen Van A"
                                // fallback="https://files.fullstack.edu.vn/f8-prod/user_photos/390191/65dbf5490804b.jpg"
                            />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
            {showLogin && <Login onHideLogin={handleHideLogin} />}
        </header>
    );
}

export default Header;
