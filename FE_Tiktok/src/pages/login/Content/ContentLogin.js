import classNames from 'classnames/bind';
import styles from '../login.module.scss';
import DetailLogin from './detailLogin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserIcon, GoogleIcon } from '~/components/Icons';
import { useState } from 'react';
import Button from 'components/Button';
import Logingoogle from './Logingoogle';
const cx = classNames.bind(styles);
function ContentLogin({ onHideLogin }) {
    const [typeLogin, setTypeLogin] = useState('');
    const handleChooseLogin = (type) => {
        setTypeLogin(type);
    };
    return (
        <div>
            {typeLogin === '' ? (
                <>
                    <h2 className={cx('login-title')}>Đăng nhập vào TikTok</h2>
                    <div className={cx('content-one')}>
                        <Button
                            className={cx('box-type-one')}
                            leftIcon={<UserIcon />}
                            onClick={() => handleChooseLogin('login-email')}
                        >
                            Email / TikTok ID
                        </Button>

                        <GoogleOAuthProvider clientId="445542901448-nvktmplrsb13av9d2i24845v1mpr8qu5.apps.googleusercontent.com">
                            <Logingoogle onHideLogin={onHideLogin}>Tiếp tục với Google</Logingoogle>
                        </GoogleOAuthProvider>
                    </div>
                    <div className={cx('content-two')}>
                        <h2 className={cx('choose-title')}>
                            <span>Hoặc</span>
                        </h2>
                    </div>
                    <div className={cx('content-three')}>
                        <Button className={cx('box-type-three')} primary onClick={onHideLogin}>
                            Tiếp tục với tư cách là khách
                        </Button>
                    </div>
                </>
            ) : (
                <DetailLogin onHideLogin={onHideLogin}/>
            )}
        </div>
    );
}

export default ContentLogin;
