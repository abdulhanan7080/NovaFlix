# Security Specification

## Data Invariants
1. Users can only modify their own profiles (`users/{userId}`), but they cannot change their role.
2. Watchlist (`users/{userId}/watchlist/{tmdbId}`) can only be added and deleted by the owner.
3. History (`users/{userId}/history/{tmdbId}`) can only be updated by the owner.
4. Media links (`media/{tmdbId}`) can only be updated by admins.
5. All time fields (`createdAt`, `updatedAt`, `addedAt`) must match `request.time`.

## Dirty Dozen Payloads
1. Attempting to create a user profile for a different UID.
2. Attempting to self-assign the "admin" role during user creation.
3. Attempting to update `role` to "admin" on an existing profile.
4. Attempting to spoof `userId` in watchlist create.
5. Attempting to update history with a payload containing 1.5MB junk string in `tmdbId` field.
6. Attempting to create Media as a normal user.
7. Attempting to update Media with an unauthorized string type in `downloads`.
8. Attempting an unauthenticated read on a user's watchlist.
9. Attempting a read on someone else's history.
10. Attempting an update bypassing standard strict fields.
11. Attempting to write an invalid media type string to MediaLink.
12. Attempting an orphaned write of Watchlist without the User document existing.
