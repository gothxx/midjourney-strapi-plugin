import { Main, TextInput, Textarea, Button, Box, Breadcrumbs, CrumbLink } from '@strapi/design-system';
import { useEffect, useState} from 'react';
import { Loader } from '@strapi/icons';

import { getTranslation } from '../utils/getTranslation';
import { Typography } from '@strapi/design-system';

const HomePage = () => {
  const [prefix, setPrefix] = useState('');
  const [prompt, setPrompt] = useState('');

  const [message, setMessage] = useState('');
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);

  useEffect(() => {
    if (urls.length > 0) {
      handleUpload();
    }
  }, [urls]);
  

  const uploadToStrapi = async (url: string) => {
    try {

      // Get browser info from client
      const referer = 'https://admin.pantensis.net';
      const userAgent = window.navigator.userAgent;

      const headers = {
        'User-Agent': userAgent,
        'Origin': referer
      };
  
      const response = await fetch(url, { referrerPolicy:"no-referrer", headers });
      const blob = await response.blob();
      // Split URL into parts and get the last two segments for filename
      const urlParts = url.split('/');
      const lastTwoParts = urlParts.slice(-2).join('-');
      const fileName = `${prefix}-${lastTwoParts}`;
      // Create FormData and append the image
      const formData = new FormData();
      formData.append('files', blob, fileName);

      // Upload to Strapi media library
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadResult = await uploadResponse.json();
      return uploadResult;

    } catch (error) {
      console.error('Error uploading to Strapi:', error);
      throw error;
    }
  };
  const handleUpload = async () => {
    try {
      const uploadPromises = urls.map(url => uploadToStrapi(url));
      const results = await Promise.all(uploadPromises);
      setMessage('All images uploaded successfully');
      console.log(results);

      // Extract URLs from upload results and set for preview
      const previewUrls = results.map(result => result[0][0].url);
      console.log(previewUrls);
      setPreview(previewUrls);
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage('Error uploading images');
    }
    setIsLoading(false);
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/midjourney-strapi-plugin/midjourney', { 
        method:"POST", 
        body:JSON.stringify({prefix:prefix, prompt:prompt})
      });
      // const response = await fetch('/api/midjourney-strapi-plugin/');
      const data = await response.json();
      console.log(data);
      setMessage(data.data.message);
      setUrls(data.data.urls);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data');
    }
  };

  return (
    <Main>
      <Box margin={4}  padding={4}>
      <Box>
        <Breadcrumbs>
          <CrumbLink href="/admin/plugins/midjourney-strapi-plugin">Midjourney Api Integration</CrumbLink>
        </Breadcrumbs>
      </Box>
      <Box padding={8} background="neutral0" hasRadius shadow="tableShadow">
        <TextInput
          placeholder="Enter Image Prefix, do not contains space."
          label="Image Prefix"
          name="prefix" 
          value={prefix}
          size="L"
          onChange={e => setPrefix(e.target.value)}
        />
      </Box>
      <Box padding={8} background="neutral0" hasRadius shadow="tableShadow">
        <Textarea
          placeholder="Enter your prompt"
          label="Image Prompt"
          name="prompt"
          value={prompt}
          size="L"
          onChange={e => setPrompt(e.target.value)}
        />
      </Box>
        <Box padding={8}>
          <Button size="L" onClick={handleSubmit} disabled={isLoading} >
            Generate Image
            {isLoading?<Loader />:null}
          </Button>

          <Box padding={4}>
            <Typography>{message ? message : null}</Typography>
          </Box>
          {urls.length > 0 ? urls.map(url => (
            <Box key={url}>
             <Typography>{url}</Typography>
            </Box>
          )) : null}
          {preview.length > 0 ? preview.map(p => {
            <Box>
              <Typography>{p}</Typography>
              <img src={p} />
            </Box>
          }):null}
        </Box>
      </Box>
    </Main>
  );
};

export { HomePage };
