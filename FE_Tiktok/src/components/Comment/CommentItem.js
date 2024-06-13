import React, { useState,memo } from 'react';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import Image from 'components/Image';
import { DotIcon } from 'components/Icons';
import Tippy from '@tippyjs/react';
import Cookies from 'js-cookie';
import 'tippy.js/dist/tippy.css';

const cx = classNames.bind(styles);

function CommentItem({ comment,onDeleteComment }) {
    const [isHovered, setIsHovered] = useState(false);
    const [iduser, setidUser] = useState(Cookies.get('iduser'));
    const handleDeleteClick = () => {
        const iduser = comment.id || comment.sub
        onDeleteComment(iduser);
    };
    return (
        <div className={cx('wrapper')}>
            <Image
                src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/03b6c4d4e9a3beb2a73ed5da264d9e9a.jpeg?biz_tag=tiktok_user.user_cover&lk3s=30310797&x-expires=1709859600&x-signature=U%2FNJ0pxNN5Q4UgG68KMndvBDstg%3D"
                alt="Nguyen Van A"
                className={cx('user-avatar')}
            />
            <div className={cx('main-container')}>
                <h3 className={cx('user-title')}>{comment.user.email}</h3>
                <p className={cx('comment')}>{comment.Content}</p>
                <h3 className={cx('timecreate')}>{comment.updatedAt}</h3>
            </div>
            {iduser == comment.user.id || iduser == comment.user.sub && (
                <Tippy
                    interactive
                    delay={[0, 50]}
                    offset={[0, -40]}
                    placement="bottom"
                    content={
                        <button onClick={handleDeleteClick} className={cx('delete-button')}>
                            Delete
                        </button>
                    }
                    onShow={() => setIsHovered(true)}
                    onHide={() => setIsHovered(false)}
                >
                    <div className={cx('dot-container')}>
                        <DotIcon className={cx('dot-icon', { visible: isHovered })} />
                    </div>
                </Tippy>
            )}
        </div>
    );
}

export default memo(CommentItem);
