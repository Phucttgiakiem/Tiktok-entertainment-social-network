// import { jwtDecode as jwt_decode } from 'jwt-decode';
import { useGoogleLogin } from '@react-oauth/google';
import Button from 'components/Button';
import { GoogleIcon } from 'components/Icons';
import classNames from 'classnames/bind';
import styles from './Logingoogle.module.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
const cx = classNames.bind(styles);
function Logingoogle({children,onHideLogin}) {
    const hideLogin = () => {
        onHideLogin();
    }
    const Handlelogin = async (sub,email,name,picture)=>{
        await axios.post("http://localhost:8096/api/logingoogle",{
            sub:sub,
            email:email,
            name:name,
            picture:picture
        }).then((res) => {
            console.log(res.data.user);
            Cookies.set('iduser', res.data.user.sub);
            Cookies.set('email', res.data.user.email);
            Cookies.set('avatar',res.data.user.avatar);
            hideLogin();
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    }
    const login = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                    },
                });
                let sub = res.data.sub;
                let name = res.data.name;
                let email = res.data.email;
                let picture = res.data.picture;
                Handlelogin(sub,email,name,picture);
            } catch (err) {
                console.log(err);
            }
        },
    });
    return (
        <div className={cx('content-one')}>
            <Button className={cx('btn-login')} onClick={() => login()} leftIcon={<GoogleIcon />}>
                {children}
            </Button>
        </div>
    );
}

export default Logingoogle;
