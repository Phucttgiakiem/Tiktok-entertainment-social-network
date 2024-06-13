import classNames from 'classnames/bind';
import styles from './login.module.scss';
import { useState } from 'react';
import FooterRegister from './Footer/FooterRegister';
import FooterLogin from './Footer/FooterLogin';
import ContentRegister from './Content/ContentRegister';
import ContentLogin from './Content/ContentLogin';
const cx = classNames.bind(styles);

function Login({onHideLogin}) {
    const [clickRegister, setClickregister] = useState(true);
    const handleClick = () => {
        setClickregister((prevState) => !prevState);
    };
    const handleHide = () => {
        onHideLogin(); // Gọi hàm để ẩn component Login khi cần
    };
    return (
        <div className={cx('background-login')}>
            <div className={cx('dialog_login')}>
                <div className={cx('wrapper')}>{clickRegister ? <ContentRegister onHideLogin={handleHide}/> : <ContentLogin onHideLogin={handleHide}/>}</div>
                <div className={cx('group_function')}>
                    {clickRegister ? (
                        <FooterLogin handleClick={handleClick} />
                    ) : (
                        <FooterRegister handleClick={handleClick} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
