# Mobile Profile Pages - Feature Parity with Website

## Current State Analysis

### Website Profile (`frontend/src/app/profile/page.tsx`)
- **Single page with 2 tabs:**
  1. **Edit Profile Tab**
     - Avatar upload/change
     - Full name, location, bio editing
     - Skills management (add/remove)
     - Resume upload/update/rename
     - Save changes button
  2. **Visibility & Stats Tab**
     - Trust/Profile strength score (calculated dynamically)
     - Progress bar showing profile completion
     - Trust score explanations

### Mobile Profile Structure
- **3 separate pages (in `mobile/app/profile/`):**
  1. `personal.tsx` - Personal Dossier (basic read-only info)
  2. `documents.tsx` - Resume & Files (partial functionality)
  3. `compliance.tsx` - Compliance & Trust (hardcoded status)

## Feature Gaps & Issues

### personal.tsx Issues
- ❌ **Read-only display only** - Shows user name/email from AuthContext
- ❌ **Missing profile data fetch** - Doesn't load full profile data from API
- ❌ **No editing** - Can't edit name, bio, location
- ❌ **No avatar** - Avatar display missing
- ❌ **No skills display** - Skills not shown
- ✅ Basic verification status banner exists

### documents.tsx Issues
- ✅ Shows resume filename and download button
- ❌ **No upload functionality** - Missing S3 presigned URL logic
- ❌ **No update functionality** - Can't change resume
- ❌ **No delete functionality** - No way to remove resume
- ❌ **No rename functionality** - Can't rename resume file
- ❌ Missing file size/type validation

### compliance.tsx Issues
- ❌ **Hardcoded status state** - Uses local state instead of API data
- ❌ **No trust score calculation** - Should calculate based on profile completion
- ❌ **Static UI** - Shows hardcoded status instead of fetching verification data
- ❌ **No dynamic requirements** - Trust requirements should update based on status

## Required Changes

### 1. Update personal.tsx
- Fetch full profile data on mount
- Display avatar
- Show all editable fields (name, location, bio)
- Show skills list
- Add save button to update profile
- Add avatar upload with S3 integration

### 2. Update documents.tsx  
- Add resume upload functionality
- Implement S3 presigned URL logic (mirror website)
- Add resume rename functionality
- Add resume delete functionality
- Implement file validation (PDF only, max 10MB)

### 3. Update compliance.tsx
- Fetch verification status from API
- Calculate trust score based on profile data
- Show dynamic trust requirements
- Update UI based on actual verification status

### 4. Add missing services
- Extend `profileService` with upload functions
- Add presigned URL endpoint call
- Mirror website's S3 upload logic

## Design Reference
- **Website is source of truth** for styling, layout, and functionality
- Mobile should mirror web functionality exactly
- Use same color scheme, typography, and component hierarchy
- Maintain consistent validation and error handling
