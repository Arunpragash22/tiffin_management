import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import api from '../api/axios';
import Loader from './Loader';

const AuthenticatedImage = ({ src, alt = 'Image', maxWidth = 300, maxHeight = 400 }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl;
    const fetchImage = async () => {
      try {
        const response = await api.get(src, { responseType: 'blob' });
        objectUrl = URL.createObjectURL(response.data);
        setImageUrl(objectUrl);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (src) fetchImage();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [src]);

  if (loading) return <Loader />;
  if (error || !imageUrl) return <Typography color="text.secondary">Image not available</Typography>;

  return (
    <Box>
      <img src={imageUrl} alt={alt} style={{ maxWidth, maxHeight, borderRadius: 8 }} />
    </Box>
  );
};

export default AuthenticatedImage;
