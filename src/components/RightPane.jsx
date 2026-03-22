export default function RightPane({ selectedFile }) {
    const paneStyle = {
        width: '65%',
        padding: '20px',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        color: '#a89984',
        overflowY: 'auto'
    };

    if (!selectedFile) {
        return (
            <div style={{ ...paneStyle, alignItems: 'center', justifyContent: 'center' }}>
                No file selected or directory is empty.
            </div>
        );
    }

    const renderContent = () => {
        switch (selectedFile.type) {
            case 'dir':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <h2 style={{ color: '#83a598' }}>{selectedFile.name}/</h2>
                        <p style={{ marginTop: '10px' }}>[ Press ENTER to choose the directory ]</p>
                    </div>
                );

            case 'txt':
                return (
                    <div>
                        <div style={{ borderBottom: '1px solid #444', marginBottom: '15px', paddingBottom: '5px', color: '#b8bb26' }}>
                            --- File viewer: {selectedFile.name} ---
                        </div>
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '15px', color: '#ebdbb2' }}>
                            {selectedFile.content}
                        </pre>
                    </div>
                );

            case 'img':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        <div style={{ borderBottom: '1px solid #444', marginBottom: '15px', paddingBottom: '5px', width: '100%', color: '#b8bb26' }}>
                            --- Image viewer: {selectedFile.name} ---
                        </div>
                        <div style={{ border: '2px solid #555', padding: '5px', backgroundColor: '#000' }}>
                            <img
                                src={selectedFile.content}
                                alt={selectedFile.name}
                                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                );

            case 'exec':
                const isLink = selectedFile.content && selectedFile.content.startsWith('url:');
                const url = isLink ? selectedFile.content.slice(4) : null;
                return (
                    <div>
                        <div style={{ borderBottom: '1px solid #444', marginBottom: '15px', paddingBottom: '5px', color: '#fb4934' }}>
                            --- Executable file: {selectedFile.name} ---
                        </div>
                        <pre style={{ color: '#fabd2f' }}>
                            {isLink
                                ? `#!/bin/bash\n# Open link in browser\nxdg-open "${url}"`
                                : `#!/bin/bash\n# ${selectedFile.content}\n\necho "Ready to execute..."`}
                        </pre>
                        <p style={{ marginTop: '20px', color: '#83a598' }}>
                            {isLink
                                ? '[ Press ENTER to open in browser ]'
                                : '[ Press ENTER to run the script ]'}
                        </p>
                    </div>
                );

            default:
                return <div>Unknown file type.</div>;
        }
    };

    return (
        <div style={paneStyle}>
            {renderContent()}
        </div>
    );
}