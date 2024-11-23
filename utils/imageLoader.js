import { getPresignedUrl, getPresignedUrls } from '../lib/s3';

export async function loadProductImages(products) {
  try {
    const updatedProducts = await Promise.all(products.map(async (product) => {
      if (product.image?.modelBasePath) {
        try {
          // Sanitize the model base path - replace spaces with hyphens or handle as needed
          const sanitizedBasePath = product.image.modelBasePath.trim();
          let imageUrl = '/assets/plant-placeholder.jpg';

          // Try to get the main image
          try {
            // First try with the exact name as PNG
            imageUrl = await getPresignedUrl(`${sanitizedBasePath}/${sanitizedBasePath}.png`);
          } catch (pngError) {
            try {
              // If PNG fails, try JPG
              imageUrl = await getPresignedUrl(`${sanitizedBasePath}/${sanitizedBasePath}.jpg`);
            } catch (jpgError) {
              console.log(`No main image found for ${product.name} in either PNG or JPG format`);
            }
          }

          // Generate pre-signed URLs for gallery images
          let galaryUrls = [];
          if (product.image.galary && product.image.galary.length > 0) {
            try {
              // Generate pre-signed URLs for gallery images
              const galleryPromises = product.image.galary.map(async (imageName) => {
                try {
                  const galleryImagePath = `${sanitizedBasePath}/galary/${imageName}`;
                  const url = await getPresignedUrl(galleryImagePath);
                  return url;
                } catch (error) {
                  console.error(`Error generating pre-signed URL for gallery image ${imageName}:`, error);
                  return null;
                }
              });

              const results = await Promise.all(galleryPromises);

              // Filter out any null values and add main image if it exists
              galaryUrls = results.filter(url => url !== null);
              
              // Add main image to gallery if it exists and isn't the placeholder
              if (imageUrl !== '/assets/plant-placeholder.jpg') {
                galaryUrls.unshift(imageUrl); // Add main image at the beginning
              }

              console.log(`Generated gallery URLs for ${product.name}:`, galaryUrls);
            } catch (error) {
              console.error(`Error processing gallery images for ${product.name}:`, error);
            }
          } else if (imageUrl !== '/assets/plant-placeholder.jpg') {
            // If no gallery images but main image exists, use it as the only gallery image
            galaryUrls = [imageUrl];
          }

          // Log the paths being tried for debugging
          console.log('Product:', product.name);
          console.log('Base Path:', sanitizedBasePath);
          console.log('Main Image URL:', imageUrl);
          console.log('Gallery URLs:', galaryUrls);

          return {
            ...product,
            imageUrl,
            galaryUrls
          };
        } catch (error) {
          console.error(`Error loading images for product ${product._id}:`, error);
          return {
            ...product,
            imageUrl: '/assets/plant-placeholder.jpg',
            galaryUrls: []
          };
        }
      }

      return {
        ...product,
        imageUrl: '/assets/plant-placeholder.jpg',
        galaryUrls: []
      };
    }));

    return updatedProducts;
  } catch (error) {
    console.error('Error in loadProductImages:', error);
    throw error;
  }
}