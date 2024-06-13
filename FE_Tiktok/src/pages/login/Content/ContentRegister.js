import classNames from 'classnames/bind';
import styles from '../login.module.scss';
import { UserIcon } from '~/components/Icons';
import Button from 'components/Button';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Logingoogle from './Logingoogle';
import DetailRegister from './detailRegister';
const cx = classNames.bind(styles);
function ContentRegister({ onHideLogin }) {
    const [typeRegister, setTypeRegister] = useState(''); // của contentRegister
    
    const ChooseTypeRegister = (Type) => {
        setTypeRegister(Type);
    };
    return (
        <div>
            {typeRegister === '' ? (
                <>
                    <h2 className={cx('login-title')}>Đăng ký TikTok</h2>
                    <div className={cx('content-one')}>
                        <Button
                            className={cx('box-type-one')}
                            leftIcon={<UserIcon />}
                            onClick={() => ChooseTypeRegister('register_email')}
                        >
                            Sử dụng email
                        </Button>
                    </div>
                    <GoogleOAuthProvider clientId="445542901448-nvktmplrsb13av9d2i24845v1mpr8qu5.apps.googleusercontent.com">
                        <Logingoogle onHideLogin={onHideLogin}>{'Sử dụng tài khoản Google'}</Logingoogle>
                    </GoogleOAuthProvider>
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
                <DetailRegister/>
            )}
        </div>
    );
}

export default ContentRegister;
