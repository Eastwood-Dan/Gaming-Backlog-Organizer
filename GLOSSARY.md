# Gaming Organizer

A personal app for organizing everything the owner plays, will play, or has played, across platforms and stores.

## Language

**Library**:
All Games the owner tracks in the app, whatever their Status.
_Avoid_: Collection, wishlist

**Game**:
A single title the owner tracks, independent of where it is owned. One Game is one entry in the Library, even if it is owned on several platforms.
_Avoid_: Entry, item, title

**Copy**:
One way the owner holds a Game: a specific platform and store (e.g. Hades on Steam, Hades on Switch). A Game has one or more Copies.
_Avoid_: Edition, version, ownership, instance

**Status**:
Where a Game currently stands for the owner: `Unplayed`, `Paused`, `Playing`, `Finished`, or `Dropped`. Every Game has exactly one Status.

**Backlog**:
The Games the owner still intends to play but is not playing right now: Status `Unplayed` or `Paused`. A subset of the Library.
_Avoid_: Library, queue

**Current**:
The Games the owner is playing right now: Status `Playing`. A subset of the Library.
_Avoid_: Active, in progress

**Played**:
The Games the owner is done with, either finished or dropped for good: Status `Finished` or `Dropped`. A subset of the Library; these Games are out of the Backlog.
_Avoid_: Archive, history, completed
