import classNames from 'classnames/bind';
import { CheckIcon } from 'components/Icons';
import Button from 'components/Button';
import UsePassToggle from './usePassToggle';
import EmailValid from '../EmailValid';
import style from './ContentForgotPass.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
const cx = classNames.bind(style);
function ContentForgotPass() {
    const [passwordInputType, ToggleIcon] = UsePassToggle();
    const [inputEmail, setInputEmail] = useState('');
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [codecheck, setCodecheck] = useState('');
    const [inputcode, setInputcode] = useState('');
    const [verifycode, setVerifyCode] = useState(false);
    const [inputpass, setInputpass] = useState('');
    const [isPassValid, setIsPassValid] = useState(false);
    const [isPassValidLength, setIsPassValidLength] = useState(false);
    const [isPassConform, setIsPassConform] = useState(false);
    const [wrongemail, setWrongEmail] = useState(false);
    const [wrongpass, setWrongPass] = useState(false);
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
            /([a-z\|A-Z]+\d+[$#&@_%]+)|(\d+[a-z\|A-Z]+[$#&@_%]+)|([$#&@_%]+[a-z\|A-Z]+\d)+|(\d+[$#&@_%]+[a-z\|A-Z]+)/g.test(
                inputpass,
            ),
        );
    };
    const handleCheckEmail = (e) => {
        const result = e.target.value;
        if (!result.startsWith(' ')) {
            setInputEmail(result);
            setVerifyEmail(() => {
                return validateEmail(result);
            });
        }
    };
    const handleInputPass = (e) => {
        const result = e.target.value;
        setInputpass(result);
    };
    const generateRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        return randomNumber;
    };
    const handlegenerateRandomNumber = () => {
        const result = generateRandomNumber();
        setCodecheck(result.toString());
    };
    const handletypecode = (e) => {
        const result = e.target.value;
        setInputcode(result);
    };
    const handlegetPass = async () => {
        await axios
            .post('http://localhost:8096/api/choosepass', {
                email: inputEmail,
                newpass: inputpass,
            })
            .then((res) => {
                if (res.data.errCode === 2) setWrongEmail(true);
                else {
                    if (res.data.errCode === 1) setWrongPass(true);
                    else console.log(res.data);
                }
            });
    };
    useEffect(() => {
        if (codecheck !== '') setCodecheck('');
        if (wrongemail) setWrongEmail(false);
    }, [inputEmail]);
    useEffect(() => {
        if (codecheck !== '') {
            EmailValid(codecheck);
            setVerifyCode(false);
        }
    }, [codecheck]);
    useEffect(() => {
        if (inputcode === codecheck) {
            setVerifyCode(true);
        } else setVerifyCode(false);
    }, [inputcode]);
    useEffect(() => {
        validateChecknotcharspecial();
        validatepasswordLength();
        validateconformpass();
        if (wrongpass) setWrongPass(false);
    }, [inputpass]);
    return (
        <div className={cx('content-bodyLogin')}>
            <h2 className={cx('login-title')}>Đặt lại mật khẩu</h2>
            <div className={cx('title-content-email')}>
                <p>Nhập địa chỉ email</p>
            </div>
            <div className={cx('content-email')}>
                <input
                    type="email"
                    placeholder="Địa chỉ Email"
                    onChange={handleCheckEmail}
                    className={cx({ 'error-email': inputEmail !== '' && !verifyEmail })}
                />
                {inputEmail !== '' && !verifyEmail && <p>Email không đúng định dạng</p>}
                {wrongemail && <p>Email không tồn tại</p>}
            </div>
            <div className={cx('content-code')}>
                <input
                    type="text"
                    placeholder="Nhập mã gồm sáu chữ số"
                    className={cx({ 'invalid-code': inputcode !== '' && !verifycode })}
                    onChange={handletypecode}
                />
                {inputEmail !== '' && verifyEmail ? (
                    <button type="button" onClick={handlegenerateRandomNumber}>
                        Gửi mã
                    </button>
                ) : (
                    <button type="button" disabled>
                        Gửi mã
                    </button>
                )}
            </div>
            {inputcode !== '' && !verifycode && (
                <div className={cx('content-error-code')}>
                    <p>Mã code không khớp</p>
                </div>
            )}
            <div className={cx('content-pass')}>
                <div className={cx('paren-pass')}>
                    <input type={passwordInputType} placeholder="Password" onChange={handleInputPass} />
                    <span className={cx('password-toggle-icon')}>{ToggleIcon}</span>
                </div>
            </div>
            {inputpass !== '' && (
                <div className={cx('content-hidden')}>
                    {isPassValid && <p className={cx('error-pass')}>Mật khẩu chứa ký tự không hợp lệ</p>}
                    {wrongpass && <p className={cx('error-pass')}>Bạn đã sử dụng mật khẩu này</p>}
                    <p className={cx('inform-pass')}>Mật khẩu của bạn phải bao gồm:</p>
                    <div className={cx('hidden-one')}>
                        <CheckIcon className={cx({ 'config-icon': isPassValidLength })} />
                        <span className={cx({ 'invalid-pass': isPassValidLength })}>8 đến 20 ký tự</span>
                    </div>
                    <div className={cx('hidden-two')}>
                        <CheckIcon className={cx({ 'config-icon': isPassConform })} />
                        <span className={cx({ 'invalid-pass': isPassConform })}>Các chữ cái, số và ký tự đặc biệt</span>
                    </div>
                </div>
            )}
            <div className={cx('content-submit')}>
                {inputEmail !== '' &&
                verifyEmail &&
                inputpass !== '' &&
                isPassConform &&
                isPassValidLength &&
                !isPassValid &&
                inputcode !== '' &&
                verifycode ? (
                    <Button primary className={cx('btn-submit')} onClick={handlegetPass}>
                        {'Đăng nhập'}
                    </Button>
                ) : (
                    <Button basic disabled className={cx('btn-submit')}>
                        {'Đăng nhập'}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ContentForgotPass;
