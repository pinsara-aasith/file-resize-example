import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);

                Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
                    (uri) => {
                        console.log('Resized Image:', uri);
                    },
                    'base64',
                    300,
                    300
                );
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        const formData = new FormData();

        Resizer.imageFileResizer(selectedFile, 300, 300, 'PNG', 100, 0,
            (resizedFile) => {
                console.log(resizedFile)
                formData.append('file', resizedFile);
                const uploadEndpoint = 'http://localhost:5000/uploads';

                axios.post(uploadEndpoint, formData)
                    .then(response => {
                        alert('File uploaded successfully')
                        console.log('File uploaded successfully:', response.data);

                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);

                    });
            },
            'file',
            300,
            300
        );
    };

    return (
        <div>
            {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
            <hr />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <h1>File Upload Example</h1>
            <FileUpload />
        </div>
    );
}

export default App;