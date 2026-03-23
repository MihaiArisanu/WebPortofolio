import { useState } from 'react';
import { useEngine } from './hooks/useEngine';
import BootScreen from './components/BootScreen';
import LayoutTUI from './components/LayoutTUI';

export default function App() {
  const {
    files,
    selectedIndex,
    currentPath,
    searchQuery,
    setSearchQuery,
    isInProjects,
    moveUp,
    moveDown,
    enterFolder,
    goBack
  } = useEngine();

  const [bootFinished, setBootFinished] = useState(false);

  const appStyle = {
    backgroundColor: '#111',
    color: '#00ff00',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: 'monospace',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  };

  return (
    <div style={appStyle} className="crt-container">
      {!bootFinished ? (
        <BootScreen onComplete={() => setBootFinished(true)} />
      ) : (
        <LayoutTUI
          files={files}
          selectedIndex={selectedIndex}
          currentPath={currentPath}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isInProjects={isInProjects}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onEnter={enterFolder}
          onBack={goBack}
        />
      )}
    </div>
  );
}