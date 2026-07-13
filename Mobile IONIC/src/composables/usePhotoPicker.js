import { actionSheetController } from '@ionic/vue'
import { cameraOutline, imageOutline } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export function usePhotoPicker() {
  const pickPhoto = async (fallbackCameraId, fallbackGalleryId) => {
    return new Promise((resolve) => {
      const openCamera = async (source, fallbackId) => {
        try {
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source,
            quality: 90
          })
          if (photo.webPath) {
            resolve(photo.webPath)
          } else {
            resolve(null)
          }
        } catch (error) {
          if (error?.message && error.message.toLowerCase().includes('cancel')) {
            resolve(null)
            return
          }
          // Browser fallback
          const input = document.getElementById(fallbackId)
          if (input) {
            input.click()
          }
          resolve(null)
        }
      }

      actionSheetController.create({
        header: 'Add a Photo',
        buttons: [
          {
            text: 'Take Photo',
            icon: cameraOutline,
            handler: () => { 
              openCamera(CameraSource.Camera, fallbackCameraId)
              return true 
            }
          },
          {
            text: 'Choose from Gallery',
            icon: imageOutline,
            handler: () => { 
              openCamera(CameraSource.Photos, fallbackGalleryId)
              return true 
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { 
              resolve(null)
              return true 
            }
          }
        ]
      }).then(sheet => sheet.present())
    })
  }

  return { pickPhoto }
}
