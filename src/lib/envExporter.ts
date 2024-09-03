const FIREBASE = {
    FIREBASE_API : process.env.NEXT_PUBLIC_FIREBASE_API,
    FIREBASE_AUTH_DOMAIN : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET : process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID : process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID : process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID : process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const O_AUTH = {
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
}

const NEXTAUTH = {
    NEXTAUTH_SECRET : process.env.NEXTAUTH_SECRET
}

export { FIREBASE, O_AUTH, NEXTAUTH };