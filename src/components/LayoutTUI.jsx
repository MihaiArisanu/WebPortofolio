import { useState, useEffect, useCallback, useRef } from 'react';
import LeftPane from './LeftPane';
import RightPane from './RightPane';
import StatusBar from './StatusBar';

export default function LayoutTUI({
    files,
    selectedIndex,
    currentPath,
    searchQuery,
    setSearchQuery,
    isInProjects,
    onMoveUp,
    onMoveDown,
    onEnter,
    onBack
}) {
    const inputRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (isInProjects && document.activeElement === inputRef.current) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                onMoveDown();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                onMoveUp();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onEnter();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setSearchQuery('');
                onBack();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            onMoveDown();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onMoveUp();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
        } else if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            onBack();
        }
    }, [onMoveDown, onMoveUp, onEnter, onBack, isInProjects, setSearchQuery]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isInProjects && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInProjects]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        fontFamily: 'monospace',
        fontSize: '14px'
    };

    if (!files || files.length === 0) {
        return <div style={containerStyle}>[Ma Os] Waiting for VFS data from C++...</div>;
    }

    const selectedFile = files[selectedIndex];

    return (
        <div style={containerStyle}>
            <div style={{ backgroundColor: '#005f87', color: 'white', padding: '2px 10px', display: 'flex', alignItems: 'center' }}>
                <span>root@ma-os:{currentPath} $&nbsp;</span>
                {isInProjects && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="search projects..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#fabd2f',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            flex: 1,
                            caretColor: '#fabd2f'
                        }}
                    />
                )}
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <LeftPane files={files} selectedIndex={selectedIndex} />
                <RightPane selectedFile={selectedFile} />
            </div>

            <StatusBar selectedFile={selectedFile} index={selectedIndex} total={files.length} />
        </div>
    );
}