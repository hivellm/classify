# Support Ticket #CS-2025-1842

**Customer**: Acme Corporation  
**Reported by**: Alice Brown (alice.brown@acme.com)  
**Priority**: High  
**Status**: In Progress  
**Created**: January 26, 2025 10:30 AM

## Issue Description
Customer reports that file synchronization is failing for files larger than 100MB. Upload gets stuck at 67% progress and eventually times out after 5 minutes.

## Steps to Reproduce
1. Attempt to upload a 150MB video file
2. Monitor upload progress
3. Observe failure at ~67% completion

## Impact
- Affects 15 users in the Design team
- Blocking project delivery deadline
- Customer requested escalation

## Investigation Notes

**10:45 AM** - Initial investigation by Support Agent Tom Wilson
- Verified issue occurs consistently
- Checked server logs - no errors on backend
- Timeout appears to be client-side

**11:30 AM** - Escalated to Engineering (Ticket #ENG-5521)
- Engineering team investigating network timeout settings
- Suspect issue with chunked upload configuration

**2:15 PM** - Update from Engineering
- Root cause: Upload chunk size too large (10MB)
- Solution: Reduce chunk size to 5MB
- Fix will be deployed in next patch release

## Resolution Plan
1. Deploy hotfix to production (ETA: Jan 27, 9:00 AM)
2. Notify affected customers
3. Monitor for 48 hours
4. Follow up with customer

## Customer Communication
Email sent to Alice Brown with update and ETA.

**Assigned to**: Tom Wilson (Support) + Engineering Team  
**Next update**: January 27, 2025