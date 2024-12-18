import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export async function uploadImage(file: File): Promise<string> {
    try {
        console.log('Starting image upload to Firebase')
        const storageRef = ref(storage, `profile-images/${Date.now()}-${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        console.log('Image uploaded successfully, getting download URL')
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log('Image upload complete, download URL:', downloadURL)
        return downloadURL
    } catch (error) {
        console.error('Error uploading image to Firebase:', error)
        throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

