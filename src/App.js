import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import MainPage from './components/MainPage';
import MenuBar from './components/Menu';

const App = () => {
  const [view, setView] = useState('row');
  const [favorites, setFavorites] = useState('');
  const [db, setDb] = useState(null);

  const addPostToFavorites = (post) => {
    let tx = db.transaction(['favorite'], 'readwrite');
    let store = tx.objectStore('favorite');
    store.add(post);
    tx.oncomplete = () => {
      console.log('stored note!');
    };
    tx.onerror = (event) => {
      alert(`error storing note ${event.target.errorCode}`);
    };
  };

  const getAndDisplayFavorites = () => {
    let allPosts = [];
    if (db) {
      let tx = db.transaction(['favorite'], 'readonly');
      let store = tx.objectStore('favorite');
      let req = store.openCursor();
      req.onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor != null) {
          allPosts.push(cursor.value);
          cursor.continue();
        } else {
          setFavorites(allPosts);
        }
      };
      req.onerror = (event) => {
        alert(`error in cursor request ${event.target.errorCode}`);
      };
    }
    return allPosts;
  };

  useEffect(() => {
    const dbConnect = indexedDB.open('basket', 1);

    dbConnect.onupgradeneeded = (event) => {
      const DB = event.target.result;
      DB.createObjectStore('favorite', { autoIncrement: true });
    };

    dbConnect.onerror = function () {
      console.error('Error', dbConnect.error);
    };

    dbConnect.onsuccess = function (event) {
      setDb(event.target.result);
    };
  }, []);
  return (
    <>
      <MenuBar changeView={setView} />
      <MainPage
        view={view}
        savePostToLocalStorage={addPostToFavorites}
        getFavorites={getAndDisplayFavorites}
      />
    </>
  );
};

export default App;
