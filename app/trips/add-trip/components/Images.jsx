import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { ServerUrl } from '@/app/config';
import { 
  FiUpload, 
  FiX, 
  FiImage,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const Images = ({ tripPlan, setTripPlan }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {'image/*': []},
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...acceptedFiles]);
                setUploadStatus('ready');
            }
        },
        multiple: true
    });

    const uploadImages = async () => {
        if (!selectedFiles.length || !tripPlan.slug) {
            setUploadStatus('error');
            return;
        };

        try {
            setUploading(true);
            setUploadStatus('uploading');
            
            // Upload all files sequentially
            const uploadedUrls = [];
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('keyId', tripPlan.slug);

                const response = await axios.post(`${ServerUrl}/admin/uploadFileOnS3`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                uploadedUrls.push(response.data.result.url);
            }
            
            // Update tripPlan with new URLs
            setTripPlan({
                ...tripPlan,
                images: [...tripPlan.images, ...uploadedUrls]
            });
            
            setUploadStatus('success');
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error uploading images:', error);
            setUploadStatus('error');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeUploadedImage = (index) => {
        setTripPlan({
            ...tripPlan,
            images: tripPlan.images.filter((_, i) => i !== index)
        });
    };

    const statusIcons = {
        ready: <FiUpload className="text-blue-500" />,
        uploading: <FiLoader className="animate-spin text-yellow-500" />,
        success: <FiCheckCircle className="text-green-500" />,
        error: <FiAlertCircle className="text-red-500" />,
    };

    return (
        <section className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiImage className="text-blue-500" />
                Gallery Images
            </h2>

            {/* Dropzone area */}
            <div 
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all mb-4 ${
                    isDragActive ? 'border-blue-400 bg-blue-50' : 
                    selectedFiles.length ? 'border-blue-300 bg-blue-50' : 
                    'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                    <FiUpload className="w-10 h-10 text-gray-400" />
                    <p className="text-sm text-gray-600">
                        Drag & drop images here, or click to select
                    </p>
                    <p className="text-xs text-gray-400">
                        Supports: JPG, PNG, WEBP (Max 5MB each)
                    </p>
                </div>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Files ({selectedFiles.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX size={14} />
                                </button>
                                <div className="text-xs text-gray-500 truncate mt-1">
                                    {file.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Uploaded images preview */}
            {tripPlan.images.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Uploaded Images ({tripPlan.images.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {tripPlan.images.map((url, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                        src={url} 
                                        alt={`Uploaded ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => removeUploadedImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
                {selectedFiles.length > 0 && (
                    <>
                        <button
                            onClick={() => setSelectedFiles([])}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <FiX /> Clear All
                        </button>
                        <button
                            onClick={uploadImages}
                            disabled={uploading}
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {statusIcons[uploadStatus] || <FiUpload />}
                            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
                        </button>
                    </>
                )}
            </div>

            {/* Status messages */}
            {uploadStatus === 'error' && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <FiAlertCircle /> Upload failed. Please try again.
                </p>
            )}
            {uploadStatus === 'success' && (
                <p className="text-green-500 text-sm flex items-center gap-1 mt-2">
                    <FiCheckCircle /> Images uploaded successfully!
                </p>
            )}
        </section>
    );
};

export default Images;