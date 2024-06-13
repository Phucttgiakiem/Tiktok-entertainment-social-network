function FooterRegister({ handleClick }) {
    return (
        <div>
            <span>Bạn không có tài khoản?</span>
            <a href="#" onClick={handleClick}>
                Đăng ký
            </a>
        </div>
    );
}

export default FooterRegister;
