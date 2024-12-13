import React , { useState, useEffect } from 'react';
import axios from 'axios';
const ImageUpLoader = () => {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    useEffect(() => {
        fetchImages();
    }, []);
    const fetchImages = async() => {
        const response =await axios.get('http://localhost:5000/images');
        setImages(response.data);
    };
    const handleFilechange = (e) =>{
        setFile(e.target.files[0]);
    };
    const handleupload = async () => {
        const formData = new FormData();
        const response = await axios.post ('http://localhost:5000/upload' , formData);
        console.log(response.data);
        fetchImages();
        setFile(null);
    };
    return (
        <div>
            <h1>Image Annotation Platform</h1>
            <input type="file"onchange={handleFilechange} />
<button onclick={handleupload}>upload Image</button>
<div >
    {images.map (image => (
        <div 
    key ={image.id}>
        <h3>{image.filename}</h3>
        <img src={'http://localhost:5000/uploads/${image.filename}'}
        alt={image.filename}
        width="200" />
<pre> {JSON.stringify(JSON.parse(image.annotations), null, 2)}</pre>
    </div>
))}
</div>
        </div>
    );

    };
    export default ImageUpLoader;