import classNames from 'classnames/bind';
import { useState, useEffect,memo } from 'react';
import axios from 'axios';
import Showvideo from 'components/VideoItem/Showvideo';
import Comment from 'components/Comment/Comment';
import Login from 'pages/login/Login';
import styles from './Home.module.scss';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
const cx = classNames.bind(styles);
function Home() {
    const [datapost, setDatapost] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const handleGetDataPost = async () => {
        await axios.post('http://localhost:8096/api/getPost').then((res) => {
            const result = res.data.post;
            setDatapost(result);
        });
    };
    const handleHideLogin = () => {
        setShowLogin(false);
    };
    const handleShowLogin = () => {
        setShowLogin(true);
    };
    useEffect(() => {
        handleGetDataPost();
    }, []);
    const handleShowComment = (post) => {
        const iduser = Cookies.get('iduser');
        if (iduser !== undefined) {
            setShowLogin(false);
            setSelectedPost(post);
            setShowComment(true);
        } else {
            setShowLogin(true);
        }
    };
    const totalcom = async (idpost) => {
        await axios
            .post('http://localhost:8096/api/getTotalcomment', {
                IDpost: idpost,
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleCloseComment = () => {
        setShowComment(false);
        setSelectedPost(null);
    };
    useEffect(() => {
        const socket = io('http://localhost:8096');

        socket.on('server_totalcomment', (newresult) => {
            setDatapost(prevDatapost => {
                const newDatapost = prevDatapost.map((data) => {
                    if (data.idpost === newresult.idpost) {
                        return { ...data, allcomment: newresult.totalComments };
                    }
                    return data;
                });
                return newDatapost;
            });
        });
        // Turnoff connect socket when component is unmount
        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <div className={cx('home')}>
            {datapost.length > 0 &&
                datapost.map((post, index) => (
                    <Showvideo
                        key={index}
                        prop={post}
                        onShowComment={() => handleShowComment(post)}
                        onShowLogin={handleShowLogin}
                    />
                ))}
            {!showLogin ? (
                showComment && (
                    <div className={cx('comment-overlay')} onClick={handleCloseComment}>
                        <Comment post={selectedPost} onClose={handleCloseComment} handleChoosetotalcom={totalcom} />
                    </div>
                )
            ) : (
                <Login onHideLogin={handleHideLogin} />
            )}
        </div>
    );
}

export default memo(Home);
