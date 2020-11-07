### Firebase Cloud Functions for Constructor

npm i -S firebase

firebase login

firebase use constructor-2de11

#### deploy function
firebase deploy --only functions:FUNCTION_NAME

#### deploy .rules file
firebase deploy --only storage

#### ------------------------------------------

#### default storage.rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth!=null;
    }
  }
}
```

#### PowerShell allow script execution (as Administrator)
Set-ExecutionPolicy Unrestricted