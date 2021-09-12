import React, { useState } from 'react';
import 'antd/dist/antd.css';
import MainPage from './components/MainPage';
import MenuBar from './components/Menu';

const App = () => {
  const [view, setView] = useState('row');
  return (
    <>
      <MenuBar changeView={setView} />
      <MainPage view={view} />
    </>
  );
};

export default App;
