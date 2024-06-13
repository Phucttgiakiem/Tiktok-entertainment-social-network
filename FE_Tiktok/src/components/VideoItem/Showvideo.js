import classNames from 'classnames/bind';
import { useState, useEffect,memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentDots, faMusic } from '@fortawesome/free-solid-svg-icons';
import Videos from './Videos';
import ButtonIcon from 'components/Button/ButtonIcon';
import styles from './Showvideo.module.scss';
import Image from 'components/Image';
import Button from 'components/Button';
import Cookies from 'js-cookie';
import axios from 'axios';
import io from 'socket.io-client';
//import { Musicnote } from 'components/Icons';
const cx = classNames.bind(styles);
function Showvideo({ prop, onShowComment, onShowLogin }) {
    const [likevideo, setLikevideo] = useState(false);
    const [iduser, setIdUser] = useState(Cookies.get('iduser'));
    const [likes, setLikes] = useState(prop.alllike);
    useEffect(() => {
        if (iduser) {
            fetchLikeStatus(iduser, prop.idpost);
        }
    }, [iduser]);

    const fetchLikeStatus = async (IDuser, postId) => {
        await axios
            .post('http://localhost:8096/api/checklikepost', {
                iduser: IDuser,
                idpost: postId,
            })
            .then((res) => {
                setLikevideo(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleLike = () => {
        const IDuser = Cookies.get('iduser');
        if (IDuser !== undefined) {
            setIdUser(IDuser);
            const newLikeStatus = !likevideo;
            AddLikepost(IDuser, newLikeStatus);
        } else {
            onShowLogin();
        }
    };

    const AddLikepost = async (IDuser, likeStatus) => {
        const url = likeStatus
            ? 'http://localhost:8096/api/createLikepost'
            : 'http://localhost:8096/api/removeLikepost';

        await axios
            .post(url, {
                iduser: IDuser,
                idpost: prop.idpost,
            })
            .then((res) => {
                console.log(res);
                if (res.data.errCode == 0) {
                    setLikevideo(likeStatus);
                } else {
                    setLikevideo(false);
                }
            })
            .catch((err) => {
                console.log(err);
        });
    };
    
    useEffect(() => {
        const socket = io('http://localhost:8096');

        socket.on('Server_send_like', (data) => {
            if (data.idpost === prop.idpost) {
                setLikes((prevLikes) => prevLikes + 1);
            }
        });

        socket.on('Server_send_deletelike', (data) => {
            if (data.idpost === prop.idpost) {
                setLikes((prevLikes) => prevLikes - 1);
            }
        });

        return () => {
            socket.off('Server_send_like');
            socket.off('Server_send_deletelike');
        };
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('AuthorContentWrapper')}>
                <div className={cx('Avatar-container')}>
                    <a href="@/ahihi" className={cx('AvatarLink')}>
                        <Image
                            src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D"
                            alt="Nguyen Van A"
                            className={cx('user-avatar')}
                        />
                    </a>
                </div>
                <div className={cx('postinfo-container')}>
                    <div className={cx('Main-ContentWrapper')}>
                        {prop.userinfo.fullName ? (
                            <span className={cx('span-text')}>{prop.userinfo.fullName}</span>
                        ) : (
                            <span className={cx('span-text')}>{prop.userinfo.email}</span>
                        )}
                        {/* <span className={cx('span-text')}>{Titlepost}</span> */}
                        <div className={cx('hashtab-wrapper')}>
                            <a href="@/ahihi">#xuhuong</a>
                            <a href="@/magar">#cosplay</a>
                        </div>
                    </div>
                    <div className={cx('Final-MainWrapper')}>
                        <FontAwesomeIcon icon={faMusic} className={cx('music-note')} />
                        <span className={cx('span-text-music')}>{prop.namemusicvideo}</span>
                    </div>
                </div>
                {/* <span className={cx('author-title')}>{Titleuser}</span> */}
                <div className={cx('follow-container')}>
                    <Button outline small>
                        Follow
                    </Button>
                </div>
            </div>

            <div className={cx('Actionvideowrapper')}>
                <div className={cx('video-container')}>
                    <Videos className={cx('video-itemone')} src={prop.mediaURL} />
                </div>
                <div className={cx('ActionContainer')}>
                    <div className={cx('likeaction')} onClick={handleLike}>
                        <ButtonIcon rounded className={cx('btnlike')}>
                            {<FontAwesomeIcon icon={faHeart} className={cx({ likevideo: likevideo })} />}
                        </ButtonIcon>
                        <h4 className={cx('alllike')}>{likes}</h4>
                    </div>
                    <div className={cx('commentaction')} onClick={onShowComment}>
                        <ButtonIcon rounded className={cx('btncomment')}>
                            {<FontAwesomeIcon icon={faCommentDots} />}
                        </ButtonIcon>
                        <h4 className={cx('allcomment')}>{prop.allcomment}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Showvideo);
