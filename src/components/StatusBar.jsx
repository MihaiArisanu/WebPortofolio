export default function StatusBar({ selectedFile, index, total }) {
    const barStyle = {
        backgroundColor: '#98971a',
        color: '#282828',
        padding: '2px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '13px',
        borderTop: '1px solid #79740e'
    };

    const getPermissions = (type) => {
        switch (type) {
            case 'dir': return 'drwxr-xr-x';
            case 'exec': return '-rwxr-xr-x';
            default: return '-rw-r--r--';
        }
    };

    return (
        <div style={barStyle}>
            <span>
                {selectedFile
                    ? `${getPermissions(selectedFile.type)} 1 mihaiarisanu wheel ${selectedFile.size} ${selectedFile.date} ${selectedFile.name}`
                    : 'Loading metadata...'}
            </span>
            <span>
                {total > 0 ? `${index + 1}/${total}` : '0/0'} | Ma Os v1.0
            </span>
        </div>
    );
}