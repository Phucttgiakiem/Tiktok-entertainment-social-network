function FooterLogin({ handleClick }) {
    return (
        <div>
            <span>Bạn đã có tài khoản?</span>
            <a href="#" onClick={handleClick}>
                Đăng nhập
            </a>
        </div>
    );
}

export default FooterLogin;
