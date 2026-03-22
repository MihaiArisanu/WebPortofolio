import { useState, useEffect, useRef } from 'react';

export function useEngine() {
    const [engineLoaded, setEngineLoaded] = useState(false);
    const [engineStatus, setEngineStatus] = useState("Booting kernel...");
    const [files, setFiles] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [currentPath, setCurrentPath] = useState("/home/mihaiarisanu");
    const [searchQuery, setSearchQueryRaw] = useState('');

    const setSearchQuery = (q) => {
        setSearchQueryRaw(q);
        setSelectedIndex(0);
    };

    const isInProjects = currentPath.endsWith('/projects');

    const displayFiles = (isInProjects && searchQuery)
        ? files.filter(f => f.id === '__exit__' || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : files;

    const displayFilesRef = useRef(displayFiles);
    displayFilesRef.current = displayFiles;

    const wasmModule = useRef(null);
    const isInitializing = useRef(false);
    const filesRef = useRef(files);
    const selectedIndexRef = useRef(selectedIndex);

    filesRef.current = files;
    selectedIndexRef.current = selectedIndex;

    const syncStateWithEngine = () => {
        if (!wasmModule.current) return;
        const mod = wasmModule.current;

        const newIndex = mod.ccall('getSelectedIndex', 'number', [], []);
        setSelectedIndex(newIndex);

        const dirId = mod.ccall('getCurrentDirId', 'number', [], []);
        if (dirId === 0) {
            setCurrentPath("~/home/mihaiarisanu");
        } else {
            const dirName = mod.ccall('getNodeName', 'string', ['number'], [dirId]);
            setCurrentPath(`~/home/mihaiarisanu/${dirName}`);
        }

        const fileCount = mod.ccall('getCurrentDirFileCount', 'number', [], []);
        const loadedFiles = [];

        for (let i = 0; i < fileCount; i++) {
            const fileId = mod.ccall('getFileIdAtIndex', 'number', ['number'], [i]);
            if (fileId === -1) continue;

            loadedFiles.push({
                id: fileId,
                name: mod.ccall('getNodeName', 'string', ['number'], [fileId]),
                type: mod.ccall('getNodeType', 'string', ['number'], [fileId]),
                size: mod.ccall('getNodeSize', 'string', ['number'], [fileId]),
                date: mod.ccall('getNodeDate', 'string', ['number'], [fileId]),
                content: mod.ccall('getNodeContent', 'string', ['number'], [fileId])
            });
        }

        if (dirId !== 0) {
            loadedFiles.push({
                id: '__exit__',
                name: 'exit_folder.sh',
                type: 'exec',
                size: '64 B',
                date: '2026-03-20',
                content: 'cd .. — Navigate back to parent directory'
            });
        }

        setFiles(loadedFiles);
    };

    useEffect(() => {
        if (engineLoaded || isInitializing.current) return;

        const initEngine = async () => {
            try {
                if (typeof window.createMaOsEngine !== 'function') {
                    setTimeout(initEngine, 200);
                    return;
                }

                if (isInitializing.current) return;
                isInitializing.current = true;

                wasmModule.current = await window.createMaOsEngine();

                const statusMsg = wasmModule.current.ccall('getEngineStatus', 'string', [], []);
                setEngineStatus(statusMsg);

                syncStateWithEngine();
                setEngineLoaded(true);
            } catch (error) {
                console.error("Kernel panic:", error);
                setEngineStatus("Kernel panic: Failed to load C++ engine.");
            }
        };

        initEngine();
    }, []);

    const syncWasmIndex = (targetIndex) => {
        const mod = wasmModule.current;
        if (!mod) return;
        let wasmIdx = mod.ccall('getSelectedIndex', 'number', [], []);
        while (wasmIdx < targetIndex) {
            mod.ccall('moveDown', null, [], []);
            wasmIdx++;
        }
        while (wasmIdx > targetIndex) {
            mod.ccall('moveUp', null, [], []);
            wasmIdx--;
        }
    };

    const moveUp = () => {
        if (!wasmModule.current) return;
        const idx = selectedIndexRef.current;
        const fileList = displayFilesRef.current;
        if (idx > 0) {
            setSelectedIndex(idx - 1);
            if (!searchQuery) {
                wasmModule.current.ccall('moveUp', null, [], []);
            }
        }
    };

    const moveDown = () => {
        if (!wasmModule.current) return;
        const idx = selectedIndexRef.current;
        const fileList = displayFilesRef.current;
        if (idx < fileList.length - 1) {
            setSelectedIndex(idx + 1);
            if (!searchQuery && fileList[idx + 1]?.id !== '__exit__') {
                wasmModule.current.ccall('moveDown', null, [], []);
            }
        }
    };

    const enterFolder = () => {
        if (!wasmModule.current) return;

        const selectedFile = displayFilesRef.current[selectedIndexRef.current];
        if (!selectedFile) return;

        if (selectedFile.id === '__exit__') {
            goBack();
            return;
        }

        if (selectedFile.type === 'exec') {
            if (selectedFile.content.startsWith('http')) {
                window.open(selectedFile.content, '_blank', 'noopener,noreferrer');
                return;
            }

            if (selectedFile.name === 'download_cv.exe') {
                const link = document.createElement('a');
                link.href = '/cv.pdf';
                link.download = 'Mihai_Arisanu_CV.pdf';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                return;
            }
        }

        if (selectedFile.type === 'dir') {
            const originalIndex = filesRef.current.findIndex(f => f.id === selectedFile.id);
            if (originalIndex !== -1) {
                syncWasmIndex(originalIndex);
                wasmModule.current.ccall('enterCurrentSelection', null, [], []);
            }
            syncStateWithEngine();
            setSearchQuery('');
            return;
        }

        const originalIndex = filesRef.current.findIndex(f => f.id === selectedFile.id);
        if (originalIndex !== -1) {
            syncWasmIndex(originalIndex);
        }
    };

    const goBack = () => {
        if (!wasmModule.current) return;
        wasmModule.current.ccall('goBack', null, [], []);
        syncStateWithEngine();
        setSearchQuery('');
    };

    return {
        engineLoaded,
        engineStatus,
        files: displayFiles,
        selectedIndex,
        currentPath,
        searchQuery,
        setSearchQuery,
        isInProjects,
        moveUp,
        moveDown,
        enterFolder,
        goBack
    };
}