import classNames from 'classnames/bind';
import style from './ContentLogin.module.scss';
import Button from 'components/Button';
import ContentForgotPass from './ContentForgotPass';
import UsePassToggle from './usePassToggle';
import { CheckIcon } from 'components/Icons';
import { AiOutlineLoading } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
const cx = classNames.bind(style);
function DetailLogin({ onHideLogin }) {
    const [clickForgotPass, setIsclickforgotpass] = useState(false);
    const [passwordInputType, ToggleIcon] = UsePassToggle();
    const [inputEmail, setInputEmail] = useState('');
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [inputpass, setPassword] = useState('');
    const [isPassValid, setIsPassValid] = useState(false);
    const [isPassValidLength, setIsPassValidLength] = useState(false);
    const [isPassConform, setIsPassConform] = useState(false);
    const [isFocusPass, setIsForcusPass] = useState(false);
    const [wrongPass, setWrongPass] = useState(false);
    const [wrongEmail, setWrongEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleForgotpass = () => {
        setIsclickforgotpass(true);
    };
    const validateEmail = (email) => {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            String(email),
        );
    };
    const validateChecknotcharspecial = () => {
        setIsPassValid(/[^\u0000-\u00ff]|[\[\]\(\),.~`!<>+=:;"'" "|\\?]/u.test(inputpass));
    };
    const validatepasswordLength = () => {
        setIsPassValidLength(/[\d|\D|^\u0000-\u00ff]{8,}/.test(inputpass));
    };
    const validateconformpass = () => {
        setIsPassConform(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*]).+$/g.test(
                inputpass,
            ),
        );
    };
    const changePassword = (e) => {
        setPassword(String(e.target.value));
        if (e.target.value === '') setWrongPass(false);
    };
    const handleChangeEmail = (e) => {
        const result = e.target.value;

        if (!result.startsWith(' ')) {
            setInputEmail(result);
            setVerifyEmail(() => {
                return validateEmail(result);
            });
        }
        if (result === '') {
            setWrongEmail(false);
        }
    };
    const handleLogin = async () => {
        setLoading(true);
        setTimeout(async () => {
            await axios
                .post('http://localhost:8096/api/login', {
                    email: inputEmail,
                    password: inputpass,
                })
                .then((res) => {
                    if (res.data.errCode === 1) setWrongEmail(true);
                    else {
                        if (res.data.errCode === 3) setWrongPass(true);
                        else {
                            console.log(res.data);
                            Cookies.set('iduser', res.data.user.id);
                            Cookies.set('email', res.data.user.email);
                            if (res.data.user.fullName != null) {
                                Cookies.set('fullName', res.data.fullName);
                            }
                            if (res.data.user.avatar != null) {
                                Cookies.set('avatar', res.data.user.avatar);
                            }
                            onHideLogin();
                            window.location.reload();
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(setLoading(false));
        }, 1500);
    };

    useEffect(() => {
        validateChecknotcharspecial();
        validatepasswordLength();
        validateconformpass();
        if (wrongPass) setWrongPass(false);
    }, [inputpass]);

    return (
        <>
            {!clickForgotPass ? (
                <div className={cx('content-bodyLogin')}>
                    <h2 className={cx('login-title')}>Đăng nhập</h2>
                    <div className={cx('content-email')}>
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={handleChangeEmail}
                            className={cx({ 'invalid-email': (inputEmail !== '' && !verifyEmail) || wrongEmail })}
                        />
                        {inputEmail !== '' && !verifyEmail && <p>Email không đúng định dạng</p>}
                        {wrongEmail && <p>Email không tồn tại</p>}
                    </div>
                    <div className={cx('content-pass')}>
                        <div className={cx('paren-pass')}>
                            <input
                                type={passwordInputType}
                                placeholder="Password"
                                onFocus={() => setIsForcusPass(true)}
                                onBlur={() => setIsForcusPass(false)}
                                onChange={changePassword}
                                className={cx({ 'warning-pass': (inputpass !== '' && isPassValid) || wrongPass })}
                            />
                            <span className={cx('password-toggle-icon')}>{ToggleIcon}</span>
                        </div>
                        {wrongPass && inputpass !== '' && <p>Password không đúng kiểm tra lại</p>}
                    </div>
                    {inputpass !== '' && isFocusPass && (
                        <div className={cx('content-hidden')}>
                            {isPassValid && <p className={cx('error-pass')}>Mật khẩu chứa ký tự không hợp lệ</p>}
                            <p className={cx('inform-pass')}>Mật khẩu của bạn phải bao gồm:</p>
                            <div className={cx('hidden-one')}>
                                <CheckIcon className={cx({ 'config-icon': isPassValidLength })} />
                                <span className={cx({ 'invalid-pass': isPassValidLength })}>8 đến 20 ký tự</span>
                            </div>
                            <div className={cx('hidden-two')}>
                                <CheckIcon className={cx({ 'config-icon': isPassConform })} />
                                <span className={cx({ 'invalid-pass': isPassConform })}>
                                    Các chữ cái, số và ký tự đặc biệt
                                </span>
                            </div>
                        </div>
                    )}
                    <div className={cx('forgot-pass')}>
                        <p onClick={handleForgotpass}>Quên mật khẩu</p>
                    </div>
                    <div className={cx('content-submit')}>
                        {inputEmail !== '' &&
                        verifyEmail &&
                        inputpass !== '' &&
                        isPassConform &&
                        isPassValidLength &&
                        !isPassValid ? (
                            loading ? (
                                <Button primary className={cx('btn-submit')} disabled>
                                    <AiOutlineLoading className={cx('loading')} />
                                </Button>
                            ) : (
                                <Button primary className={cx('btn-submit')} onClick={handleLogin}>
                                    Đăng nhập
                                </Button>
                            )
                        ) : (
                            <Button basic disabled className={cx('btn-submit')}>
                                {'Đăng nhập'}
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <ContentForgotPass />
            )}
        </>
    );
}

export default DetailLogin;
