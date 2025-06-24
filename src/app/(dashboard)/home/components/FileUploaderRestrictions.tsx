// React Imports
import { useState } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// CSS Imports
import styles from './FileUploaderRestrictions.module.css'

type FileProp = {
  name: string
  type: string
  size: number
}

interface FileUploaderRestrictionsProps {
  onUpload?: (files: File[]) => Promise<void>
}

const FileUploaderRestrictions = ({ onUpload }: FileUploaderRestrictionsProps) => {
  // States
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState<boolean>(false)

  const handleFileDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
  }

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className={styles['file-details']}>
        <div className={styles['file-preview']}>{renderFilePreview(file)}</div>
        <div>
          <Typography className={styles['file-name']}>{file.name}</Typography>
          <Typography className={styles['file-size']} variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files)
      
      const validFiles = selectedFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image file.`)
          return false
        }
        if (file.size > 20000000) { // 20MB
          alert(`File ${file.name} is too large. Maximum size is 20 MB.`)
          return false
        }
        return true
      })
      
      handleFileDrop(validFiles)
    }
  }

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      alert("请选择要上传的文件")
      return
    }

    setUploading(true)
    if (onUpload) {
      try {
        await onUpload(files)
      } catch (error) {
        console.error("Error uploading files:", error)
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <>
      <div className={styles.dropzone} onClick={() => document.getElementById('file-input')?.click()}>
        <input 
          id="file-input"
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div className='flex items-center flex-col'>
          <Avatar variant='rounded' className={styles['bs-12'] + ' ' + styles['is-12'] + ' ' + styles['mbe-9']}>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h4' className={styles['mbe-2.5']}>
            Drag and Drop Your Images Here
          </Typography>
          <Typography className={styles['text-center']}>
            Supports all image types. For the best viewing experience, use images with a resolution of 640 x 800 pixels.
          </Typography>
        </div>
      </div>
      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className={styles.buttons}>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button 
              variant='contained' 
              onClick={handleUploadFiles}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Browse Images"}
            </Button>
          </div>
        </>
      ) : null}
    </>
  )
}

export default FileUploaderRestrictions 