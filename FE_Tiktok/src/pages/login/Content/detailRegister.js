import classNames from 'classnames/bind';
import styles from './ContentRegister.module.scss';
import { CheckIcon, WarningIcon } from '~/components/Icons';
import { useState, useEffect } from 'react';
import usePassToggle from './usePassToggle';
import EmailValid from '../EmailValid';
import axios from 'axios';
import Button from 'components/Button';
const cx = classNames.bind(styles);
function DetailRegister() {
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [inputEmail, setInputEmail] = useState('');
    const [hasEmailChanged, setHasEmailChanged] = useState(false);
    const [inputPass, setPassword] = useState('');
    const [isPassValid, setIsPassValid] = useState(false);
    const [isPassValidLength, setIsPassValidLength] = useState(false);
    const [isPassConform, setIsPassConform] = useState(false);
    const [passwordInputType, ToggleIcon] = usePassToggle();
    const [isFocuspass, setIsFocuspass] = useState(false);
    const [codeValid, setCodeValid] = useState('');
    const [resulttypecode, setTypecode] = useState('');
    const [iscodeValid, setIscodeValid] = useState(false);
    const [dateofbirth, setDateofbirth] = useState('');
    // create content button push code animation
    const [remainingTime, setRemainingTime] = useState(0);
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [isdupliEmail, setIsdupliEmail] = useState(false);
    const validateEmail = () => {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            String(inputEmail),
        );
    };
    const validateChecknotcharspecial = () => {
        setIsPassValid(/[^\u0000-\u00ff]|[\[\]\(\),.~`!<>+=:;"'" "|\\?]/u.test(inputPass));
    };
    const validatepasswordLength = () => {
        setIsPassValidLength(/[\d|\D|^\u0000-\u00ff]{8,}/.test(inputPass));
    };
    const validateconformpass = () => {
        setIsPassConform(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*]).+$/g.test(
                inputPass,
            ),
        );
    };
    const changePassword = (e) => {
        setPassword(String(e.target.value));
    };
    const checkallcasepass = () => {
        validateChecknotcharspecial();
        validatepasswordLength();
        validateconformpass();
    };
    const handleChangeEmail = (e) => {
        const result = e.target.value;
        if (!result.startsWith(' ')) {
            setInputEmail(result);
        }
    };
    // const handleFocusInputEmail = () => {
    //     setHasEmailChanged(false);
    // };

    // const handleBlurInputEmail = () => {
    //     if (hasEmailChanged) {
    //         setIsEmailValid(validateEmail(inputEmail)?.length > 0);
    //     }
    // };
    const generateRandomNumber = () => {
        // Sinh số ngẫu nhiên trong khoảng từ 100000 đến 999999
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        return randomNumber;
    };
    const handleValidEmail = () => {
        const numbergenerate = generateRandomNumber();
        setCodeValid(numbergenerate.toString());
    };
    const handleCheckcode = (e) => {
        setTypecode(e.target.value);
    };
    const handleChooseDate = (e) => {
        const result = e.target.value;
        setDateofbirth(result);
    };
    const pushdateuser = async () => {
        await axios
            .post('http://localhost:8096/api/register', {
                email: inputEmail,
                password: inputPass,
                dateofbirth: dateofbirth,
            })
            .then((response) => {
                if (response.data.errCode === 1) {
                    setIsdupliEmail(true);
                } else{ 
                    setIsdupliEmail(false);
                    alert("Đã tạo tài khoản thành công giờ đây bạn hãy vào đăng nhập với tài khoản mới");
                }
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        setIsEmailValid(validateEmail());
    }, [inputEmail]);
    useEffect(() => {
        if (codeValid !== '') {
            EmailValid(codeValid);
            setIsButtonEnabled(false);
            setRemainingTime(30);
        }
    }, [codeValid]);
    useEffect(() => {
        if (resulttypecode.trim() === codeValid.trim()) setIscodeValid((prev) => (prev = true));
        else setIscodeValid((prev) => (prev = false));
    }, [resulttypecode]);
    useEffect(() => {
        checkallcasepass();
    }, [inputPass]);
    useEffect(() => {
        let timer;
        if (!isButtonEnabled && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (remainingTime === 0) {
            setIsButtonEnabled(true); // Khi thời gian còn lại đếm ngược đạt đến 0, cho phép nút bấm được kích hoạt lại
        }
        return () => clearInterval(timer);
    }, [isButtonEnabled, remainingTime]);
    return (
        <div className={cx('content-bodyRegis')}>
            <h2 className={cx('login-title')}>Đăng ký</h2>
            <div className={cx('content-one')}>
                <div className={cx('title-dateofbirth')}>
                    <h3>Ngày sinh của bạn là ngày nào?</h3>
                </div>
                <div className={cx('detail-dateofbirth')}>
                    <input type="date" onChange={handleChooseDate} />
                </div>
            </div>
            <div className={cx('date-guide')}>
                <p>Ngày sinh của bạn sẽ không được hiển thị công khai</p>
            </div>
            <div className={cx('content-email')}>
                <input
                    onChange={handleChangeEmail}
                    type="email"
                    placeholder="Địa chỉ email"
                    className={cx({ 'invalid-email': !isEmailValid && !!inputEmail })}
                />
                {!isEmailValid && !!inputEmail && (
                    <>
                        <WarningIcon className={cx('warning-icon')} />
                        <p>Email không đúng định dạng</p>
                    </>
                )}
                {isdupliEmail && <p>Email đã tồn tại trên hệ thống</p>}
            </div>
            <div className={cx('content-pass')}>
                <input
                    type={passwordInputType}
                    placeholder="Mật khẩu"
                    onChange={changePassword}
                    className={cx({ 'invalid-pass': isPassValid && !!inputPass })}
                />
                {!!inputPass && isPassValid && <WarningIcon className={cx('warning-icon')} />}
                <span className={cx('password-toggle-icon')}>{ToggleIcon}</span>
            </div>
            {!!inputPass && (
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
            <div className={cx('content-code')}>
                <input
                    type="text"
                    placeholder="Nhập mã gồm sáu chữ số"
                    onChange={handleCheckcode}
                    className={cx({ 'invalid-code': !iscodeValid && !!resulttypecode })}
                />
                {!iscodeValid && !!resulttypecode && <WarningIcon className={cx('warning-icon')} />}
                {isEmailValid ? (
                    <button type="button" disabled={!isButtonEnabled} onClick={handleValidEmail}>
                        {remainingTime > 0 ? `Đợi ${remainingTime} giây` : 'Gửi mã'}
                    </button>
                ) : (
                    <button type="button" disabled>
                        Gửi mã
                    </button>
                )}
            </div>
            {!iscodeValid && !!resulttypecode && (
                <div className={cx('content-error-code')}>
                    <p>Mã code không khớp</p>
                </div>
            )}
            <div className={cx('content-accuracy')}>
                <label className={cx('custom-checkbox')}>
                    <input type="checkbox" />
                    <span className={cx('checkbox-icon')}></span>
                </label>
                <p>
                    Nhận nội dung thịnh hành, bản tin, khuyến mại, đề xuất và thông tin cập nhật tài khoản được gửi đến
                    email của bạn
                </p>
            </div>
            <div className={cx('content-submitRegis')}>
                {dateofbirth !== '' &&
                inputEmail !== '' &&
                isEmailValid &&
                inputPass !== '' &&
                isPassConform &&
                isPassValidLength &&
                !isPassValid &&
                !!resulttypecode &&
                iscodeValid ? (
                    <Button primary className={cx('btn-submit')} onClick={pushdateuser}>
                        {'Tiếp'}
                    </Button>
                ) : (
                    <Button basic disabled className={cx('btn-submit')}>
                        {'Tiếp'}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default DetailRegister;
