# Kudos Restriction Implementation

## Overview
This implementation ensures that each user can only give one kudo per trick, preventing spam and maintaining fair engagement metrics.

## Changes Made

### 1. Database Schema
- **New Table**: `TrickShare-Kudos`
  - Primary Key: `userEmail` (HASH) + `trickId` (RANGE)
  - Tracks which users have given kudos to which tricks
  - Includes `createdAt` timestamp

### 2. API Changes
- **Updated**: `/api/tricks/[id]/kudos.ts`
  - Now requires `userEmail` in request body
  - Checks existing kudos before allowing new ones
  - Returns 409 error if user already gave kudos
  
- **New**: `/api/user/kudos.ts`
  - Returns list of trick IDs user has given kudos to
  - Used for frontend state management

### 3. Frontend Changes
- **Main Page** (`pages/index.tsx`):
  - Tracks user's kudos state
  - Disables kudos button for already-kudoed tricks
  - Shows appropriate error messages
  
- **Trick Detail Page** (`pages/trick/[id].tsx`):
  - Checks if user already gave kudos on load
  - Updates button text and state accordingly
  - Prevents duplicate kudos attempts

- **API Client** (`lib/api.ts`):
  - Updated `giveKudos()` to include user email
  - Added `getUserKudos()` method

### 4. Styling
- Added disabled state styles for kudos buttons
- Visual feedback for already-kudoed tricks

## Setup Instructions

1. **Create the kudos tracking table**:
   ```bash
   npm run setup-kudos
   ```

2. **The system will automatically**:
   - Check user authentication before allowing kudos
   - Track kudos relationships in the database
   - Prevent duplicate kudos from the same user
   - Show appropriate UI states

## API Usage

### Give Kudos
```javascript
POST /api/tricks/{trickId}/kudos
Content-Type: application/json

{
  "userEmail": "user@example.com"
}
```

**Responses**:
- `200`: Kudos given successfully
- `409`: User already gave kudos to this trick
- `400`: Missing user email
- `404`: Trick not found

### Get User Kudos
```javascript
GET /api/user/kudos?userEmail=user@example.com
```

**Response**:
```json
{
  "kudoedTricks": ["trick-id-1", "trick-id-2", ...]
}
```

## Database Structure

### TrickShare-Kudos Table
```javascript
{
  userEmail: "user@example.com",    // HASH key
  trickId: "trick-123",             // RANGE key  
  createdAt: "2024-01-01T00:00:00Z" // Timestamp
}
```

## Error Handling
- Frontend shows toast messages for duplicate kudos attempts
- API returns appropriate HTTP status codes
- Graceful fallback if kudos table doesn't exist yet
- User authentication is required for all kudos operations

## Testing
Run the test script to verify functionality:
```bash
# Start the development server first
npm run dev

# In another terminal, run the test
node scripts/test-kudos.js --run
```
