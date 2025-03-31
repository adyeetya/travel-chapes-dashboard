import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ServerUrl } from '@/app/config';
import axios from 'axios';
import { 
  FiUpload, 
  FiX, 
  FiImage,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'; // Feather Icons (part of React Icons)

const Banners = ({ tripPlan, setTripPlan }) => {
    const [uploading, setUploading] = useState({
        phone: false,
        web: false
    });
    const [uploadStatus, setUploadStatus] = useState({
        phone: null,
        web: null
    });

    const onDrop = (field) => (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setUploadStatus({...uploadStatus, [field]: 'invalid'});
            return;
        }

        setTripPlan({
            ...tripPlan,
            banners: {
                ...tripPlan.banners,
                [field]: file,
            },
        });
        setUploadStatus({...uploadStatus, [field]: 'ready'});
    };

    // Dropzone configurations for each field
    const phoneDropzone = useDropzone({
        accept: {'image/*': []},
        onDrop: onDrop('phone'),
        maxFiles: 1
    });

    const webDropzone = useDropzone({
        accept: {'image/*': []},
        onDrop: onDrop('web'),
        maxFiles: 1
    });

    const uploadBanner = async (field) => {
        if (!tripPlan.banners[field] || !tripPlan.slug) {
            setUploadStatus({...uploadStatus, [field]: 'error'});
            return;
        };

        try {
            setUploading({ ...uploading, [field]: true });
            setUploadStatus({...uploadStatus, [field]: 'uploading'});
            
            const formData = new FormData();
            formData.append('image', tripPlan.banners[field]);
            formData.append('keyId', tripPlan.slug);

            const response = await axios.post(`${ServerUrl}/admin/uploadFileOnS3`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imageUrl = response.data.result.url;
            
            setTripPlan({
                ...tripPlan,
                banners: {
                    ...tripPlan.banners,
                    [field]: imageUrl,
                },
            });
            
            setUploadStatus({...uploadStatus, [field]: 'success'});
        } catch (error) {
            console.error('Error uploading banner:', error);
            setUploadStatus({...uploadStatus, [field]: 'error'});
        } finally {
            setUploading({ ...uploading, [field]: false });
        }
    };

    const removeImage = (field) => {
        setTripPlan({
            ...tripPlan,
            banners: {
                ...tripPlan.banners,
                [field]: '',
            },
        });
        setUploadStatus({...uploadStatus, [field]: null});
    };

    const renderDropzone = (field, dropzone) => {
        const file = tripPlan.banners?.[field];
        const isUploaded = typeof file === 'string' && file !== '';
        const isFile = file instanceof File;

        const statusIcons = {
            ready: <FiUpload className="text-blue-500" />,
            uploading: <FiLoader className="animate-spin text-yellow-500" />,
            success: <FiCheckCircle className="text-green-500" />,
            error: <FiAlertCircle className="text-red-500" />,
            invalid: <FiAlertCircle className="text-red-500" />
        };

        return (
            <div className="space-y-3">
                <div 
                    {...dropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                        dropzone.isDragActive ? 'border-blue-400 bg-blue-50' : 
                        isFile ? 'border-blue-300 bg-blue-50' : 
                        isUploaded ? 'border-green-300 bg-green-50' : 
                        'border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <input {...dropzone.getInputProps()} />
                    
                    <div className="flex flex-col items-center justify-center space-y-2">
                        {isFile ? (
                            <>
                                <FiImage className="w-10 h-10 text-blue-500" />
                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1].toUpperCase()}
                                </p>
                            </>
                        ) : isUploaded ? (
                            <>
                                <div className="relative">
                                    <img 
                                        src={file} 
                                        alt="Uploaded banner" 
                                        className="h-20 object-contain rounded border border-gray-200"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                        <FiCheckCircle size={14} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 truncate max-w-full">
                                    {file.split('/').pop()}
                                </p>
                            </>
                        ) : (
                            <>
                                <FiUpload className="w-10 h-10 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                    Drag & drop image or click to browse
                                </p>
                                <p className="text-xs text-gray-400">
                                    Supports: JPG, PNG, WEBP (Max 5MB)
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {(isFile) && (
                        <button
                            onClick={() => removeImage(field)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex-1"
                        >
                            <FiX /> Remove
                        </button>
                    )}

                    {isFile && (
                        <button
                            onClick={() => uploadBanner(field)}
                            disabled={uploading[field]}
                            className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors flex-1 ${
                                uploading[field] ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {statusIcons[uploadStatus[field]] || <FiUpload />}
                            {uploading[field] ? 'Uploading...' : 'Upload'}
                        </button>
                    )}
                </div>

                {uploadStatus[field] === 'invalid' && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <FiAlertCircle /> Please select a valid image file
                    </p>
                )}
                {uploadStatus[field] === 'error' && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <FiAlertCircle /> Upload failed. Please try again.
                    </p>
                )}
            </div>
        );
    };

    return (
        <section className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiImage className="text-blue-500" />
                Banner Images
            </h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Banner (Recommended: 800×1200)
                    </label>
                    {renderDropzone('phone', phoneDropzone)}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Desktop Banner (Recommended: 1920×1080)
                    </label>
                    {renderDropzone('web', webDropzone)}
                </div>
            </div>
        </section>
    );
};

export default Banners;