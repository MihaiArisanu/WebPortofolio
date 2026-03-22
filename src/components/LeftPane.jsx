export default function LeftPane({ files, selectedIndex }) {
    const paneStyle = {
        width: '35%',
        borderRight: '1px solid #444',
        overflowY: 'auto',
        padding: '5px 0'
    };

    const getIcon = (type) => {
        switch (type) {
            case 'dir': return '📁';
            case 'txt': return '📄';
            case 'img': return '🖼️';
            case 'exec': return '⚙️';
            default: return '📄';
        }
    };

    return (
        <div style={paneStyle}>
            {files.map((file, idx) => {
                const isSelected = idx === selectedIndex;
                const itemStyle = {
                    padding: '4px 15px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#3c3836' : 'transparent',
                    color: isSelected ? '#fabd2f' : '#a89984',
                    borderLeft: isSelected ? '3px solid #fabd2f' : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                };

                return (
                    <div key={file.id ?? idx} style={itemStyle}>
                        <span>{getIcon(file.type)}</span>
                        <span>{file.name}{file.type === 'dir' ? '/' : ''}</span>
                    </div>
                );
            })}
        </div>
    );
}