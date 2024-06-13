import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Comment.module.scss';
import CommentItem from './CommentItem';
import { OffIcon } from 'components/Icons';
import Image from 'components/Image';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { AiOutlineLoading } from 'react-icons/ai';
const cx = classNames.bind(styles);
function Comment({ comments = [], post, onClose, handleChoosetotalcom }) {
    const [Inputcomment, setInputcomment] = useState('');
    const [commentList, setCommentList] = useState(comments);
    const [loading, setLoading] = useState(false);

    const handleAddcomment = (e) => {
        const result = e.target.value;
        setInputcomment(result);
    };
    const handleTotalcomment = () => {
        handleChoosetotalcom(post.idpost);
    };
    const handleDeletecomment = async (idcomment) => {
        await axios
            .post('http://localhost:8096/api/removecomment', {
                idcomment: idcomment,
            })
            .then((response) => {
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleSubmitComment = () => {
        if (Inputcomment.trim()) {
            createcommentapi();
        }
    };

    const createcommentapi = async () => {
        setLoading(true);
        setTimeout(async () => {
            await axios
                .post('http://localhost:8096/api/createcomment', {
                    idpost: post.idpost,
                    comment: Inputcomment.trim(),
                    iduser: Cookies.get('iduser'),
                })
                .then((response) => {
                    
                    //  callapi()
                    setInputcomment('');
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(setLoading(false));
        }, 1500);
    };
    const callapi = async () => {
        await axios
            .post('http://localhost:8096/api/getDetailcomment', {
                IDpost: post.idpost,
            })
            .then((response) => {
                setCommentList(response.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        callapi();
    }, []);
    useEffect(() => {
        const socket = io('http://localhost:8096');

        // listening event 'Server_send' from server
        socket.on('Server_send', (newComment) => {
            console.log('Nhận sự kiện newComment với dữ liệu:', newComment);
            setCommentList((prev) => [newComment, ...prev]);
        });

        // listening event deleteComment' from server
        socket.on('Server_send_deletecomment', (idcomment) => {
            console.log('Nhận sự kiện deleteComment với id:', idcomment);
            setCommentList((prev) => prev.filter((comment) => comment.id !== idcomment));
        });
        // Turnoff connect socket when component is unmount
        return () => {
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        handleTotalcomment();
    }, [commentList]);
    return (
        <div className={cx('wrapper')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('headerbox')}>
                <div className={cx('wrapperpost')}>
                    <div className={cx('container-avatar')}>
                        <Image
                            src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D"
                            alt="Nguyen Van A"
                            className={cx('user-avatar')}
                        />
                    </div>
                    <div className={cx('container-post')}>
                        <div className={cx('container-name')}>
                            {post.userinfo.fullName ? (
                                <span className={cx('span-text')}>{post.userinfo.fullName}</span>
                            ) : (
                                <span className={cx('span-text')}>{post.userinfo.email}</span>
                            )}
                        </div>
                        <div className={cx('container-contentpost')}>
                            <div className={cx('hashtab-wrapper')}>
                                <a href="@/ahihi">#xuhuong</a>
                                <a href="@/magar">#cosplay</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('container-off')} onClick={onClose}>
                    <OffIcon className={cx('Officon')} />
                </div>
            </div>
            <div className={cx('mainbox')}>
                {commentList.length > 0 &&
                    commentList.map((comment, index) => (
                        <CommentItem key={index} comment={comment} onDeleteComment={handleDeletecomment} />
                    ))}
            </div>
            <div className={cx('footerbox')}>
                <div className={cx('wrapperofcomment')}>
                    <input
                        className={cx('inputcomment')}
                        type="text"
                        placeholder="Thêm bình luận..."
                        onChange={handleAddcomment}
                    />
                    {loading && <AiOutlineLoading className={cx('loading')} />}
                </div>
                <h4 className={cx('btnpush', { changebtn: !!Inputcomment })} onClick={handleSubmitComment}>
                    Đăng
                </h4>
            </div>
        </div>
    );
}

export default Comment;
