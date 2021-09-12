import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Spin, Space,
} from 'antd';
import Pagination from '@material-ui/lab/Pagination';
import PostCard from '../PostCard';
import './index.scss';

const getQueryParams = (queryParams) => {
  try {
    let query = [];
    if (queryParams) {
      const queryKeys = Object.keys(queryParams).filter((key) => key !== '');
      for (let i = 0; i < queryKeys.length; i += 1) {
        const queryKey = queryKeys[i];
        const queryParam = queryParams[queryKey];
        if (typeof queryParam === 'object' && queryParam != null) {
          query = query.concat(queryParam.map((soloObjectParam) => (
            `${encodeURIComponent(queryKey)}=${encodeURIComponent(soloObjectParam)}`
          )));
        } else if (queryParam != null) {
          query.push(`${encodeURIComponent(queryKey)}=${encodeURIComponent(queryParam)}`);
        }
      }
    }
    return query.join('&');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('QueryParamsError', err);
    return '';
  }
};

export default function MainPage({ view }) {
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [postType, setPostType] = useState('top');
  const [page, setPage] = useState(1);
  const [fetchDirection, setFetchDirection] = useState({
    after: null,
  });

  const fetchSubredditCatsList = async (pageNumber, isForward) => {
    setIsLoading(true);
    setPostType('top');
    const queryParam = {
      limit: 10,
      raw_json: 1,
      after: isForward ? fetchDirection.after : null,
      before: isForward ? null : fetchDirection.after,
    };
    const fetchURL = `https://www.reddit.com/r/cats/${postType}.json?&${getQueryParams(queryParam)}`;
    const response = await axios(
      fetchURL,
    ) ?? [];
    setIsLoading(false);
    const postWithMediaContent = response?.data?.data?.children.filter(({ data }) => 'preview' in data);
    setFetchDirection({
      after: response?.data?.data?.after,
    });
    setPosts(postWithMediaContent ?? []);
  };
  const handlePageChange = (event, pageNumber) => {
    if (page > pageNumber) {
      fetchSubredditCatsList(pageNumber, false);
    }
    if (pageNumber > page) {
      fetchSubredditCatsList(pageNumber, true);
    }
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchSubredditCatsList(1);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loader-wrapper">
          <Space size="middle">
            <Spin size="large" />
          </Space>
        </div>
      ) : (
        <div className="mainPage-wrapper">
          <div className="mainPage" style={{ flexDirection: view }}>
            {
          posts?.map(({ data }) => (
            <PostCard
              key={data?.id ?? ''}
              author={data.author}
              description={data.title}
              media={data?.media ? data.media?.reddit_video?.fallback_url : data.preview?.images[0].resolutions[1].url}
              ups={data?.ups}
              mediaType={data?.media ? 'video' : 'image'}
            />

          ))
          }
          </div>
          <Pagination
            count={100}
            showLastButton={false}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
