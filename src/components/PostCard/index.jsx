import React from 'react';
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import './index.scss';

export default function PostCard({
  author, description, media, ups, mediaType,
}) {
  return (
    <div className="post-card-wrapper">
      <div className="post-card-upvote-quantity">
        <ArrowUpwardTwoToneIcon />
        {ups}
      </div>
      <div className="post-card-description">
        <div className="post-card-description-created-by">
          <span>{`Опубликовано пользователем ${author}`}</span>
        </div>
        <div className="post-card-description-title">
          <h3>{description}</h3>
        </div>
        <div className="post-card-description-content">
          {mediaType === 'video'
            ? (
              <video
                preload="auto"
                src={media}
                autoPlay
                loop
              />
            ) : (
              <img
                alt="cats"
                src={media}
              />
            )}
        </div>
      </div>
    </div>
  );
}
