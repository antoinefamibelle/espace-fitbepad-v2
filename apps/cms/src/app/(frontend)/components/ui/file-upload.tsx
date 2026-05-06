'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@frontend/components/ui/button';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface FileUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`Le fichier est trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setIsLoading(true);
    try {
      const base64 = await convertToBase64(file);
      onChange(base64);
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      console.error('Error converting file to base64:', error);
      toast.error('Erreur lors du téléchargement du fichier');
    } finally {
      setIsLoading(false);
    }
  }, [convertToBase64, maxSize, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: disabled || isLoading,
  });

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  // Check if value is a base64 string
  const isBase64Image = value && value.startsWith('data:image');

  return (
    <div className={`space-y-4 ${className}`}>
      {value && isBase64Image ? (
        // Display uploaded image
        <div className="relative">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <Button
            type="button"
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : value && !isBase64Image ? (
        // Display URL image
        <div className="relative">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={value}
              alt="Current image"
              fill
              className="object-cover"
              sizes="128px"
              onError={() => {
                // If URL image fails to load, show placeholder
                handleRemove();
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        // Upload area
        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600">Téléchargement en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              {isDragActive ? (
                <>
                  <Upload className="h-8 w-8 text-primary" />
                  <p className="text-sm font-medium text-primary">
                    Déposez le fichier ici
                  </p>
                </>
              ) : (
                <>
                  <FileImage className="h-8 w-8 text-gray-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Cliquez pour télécharger ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG, WebP, GIF (max {Math.round(maxSize / 1024 / 1024)}MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}