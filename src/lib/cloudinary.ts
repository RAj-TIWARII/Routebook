const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export interface UploadProgressHandler {
  (percent: number): void;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  resource_type: 'image' | 'video';
  format: string;
}

/**
 * Uploads a single file directly from the browser to Cloudinary using an
 * unsigned upload preset, reporting progress via XHR (fetch has no reliable
 * upload-progress event). Used by the admin panel's drag & drop uploader.
 */
export function uploadToCloudinary(
  file: File,
  onProgress?: UploadProgressHandler,
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error(
        'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env',
      ),
    );
  }

  const resourceType = file.type.startsWith('video') ? 'video' : 'image';
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'routebook');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

/** Builds a responsive, auto-format/quality Cloudinary delivery URL. */
export function cldUrl(
  publicId: string,
  opts: { width?: number; height?: number; crop?: string } = {},
) {
  const { width, height, crop = 'fill' } = opts;
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicId}`;
}
