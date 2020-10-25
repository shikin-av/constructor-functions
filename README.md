### Firebase Cloud Functions for Constructor

cd functions
npm start

#### deploy function
firebase deploy --only functions:FUNCTION_NAME

#### deploy .rules file
firebase deploy --only storage

#### default storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth!=null;
    }
  }
}