## Features

### Org employee

- [ ] Create user without an organisation - 1d
- [ ] Join organisation - 1
- [ ] Edit user details - 2
- [ ] Should only see/edit application for their company and user - 1
- [ ] Do updates on applications after "changes required" - 1
- [ ] Get notified by email when "changes required" / "submitted" / "outcome changes" - 1
- [ ] See application with different outcomes - 1
- [ ] Request admin permission in company - 3
- [ ] Apply for drug registration - 1
- [ ] And import permit - 2
- [ ] Receive evidence of drug registration and import permit - 2
- [ ] Withdrawn application (less priority) - 3
- [ ] Delete a draft application - 2
- [ ] Select different organisation to apply for Drug registration and import permit - 2d
- [ ] View applications by status "submitted", by dates and by outcome - 1
- [ ] View applications deadline which are waiting for "changes required" - 2
- [ ] Duplicate/Export application - 3

### Org owner

- [ ] Create a company - 1
- [ ] Display company logo from application - 2
- [ ] Apply to make changes to organisation - 3
- [ ] Approve user joining organisation - 1
- [ ] View users permission on organisation - 2
- [ ] Edit (add/delete) user permission on organisation - 2
- [ ] Remove user from organisation - 3
- [ ] View organisation status - available/disabled, - renew date - 3
- [ ] List of application results (i.e. import permits expiry dates) - 1
- [ ] Apply for more then one company - 2
- [ ] Notifications for upcoming renewals (drug rego, import permits, etc..) - 3

### Reviewer

- [ ] Join FDA organisation - 1
- [ ] See reviewer actionable list (start, continue, re-review, update, locked) and application info (stage) - 1
- [ ] Restrict visibility of applications for individual reviewer (only see assigned reviews) - 1
- [ ] Have filters to see applications visible to reviewer by stage, date, assignee, outcome, etc (list other options) - 1
- [ ] See history of reviews of application in a previous "stage" in the review home page (yourself) - 2
- [ ] See reviews done by others (after been submitted) for the same application when higher level permissions apply (others) - 3
- [ ] Get notified by email when "assigned" / "available for self-assignment" / "outcome change" / "pending" / "changes requested" - 2
- [ ] Start a review and see all questions assigned with a review option to `approve`/`decline` and make comments - 1
- [ ] Submit review when valid (either all `approved` or at least one `declined`) and make a decision based on validation - "List of questions" or "Non-conform" when at least one is `declined` / "Conform" when all is `approved` - 1
- [ ] Get prompt before review is submitted with confirmation message indicating what will be sent to Applicant or to lower level reviewer for "changes requested" or to higher level reviewer. - 1
- [ ] Data entry is saved on the go - 2
- [ ] Can only submit when review is in draft status (i.e. can't submit when locked) - 1
- [ ] Review isn't visible to others until submitted. - 1
- [ ] When review is submitted it's read only - 1
- [ ] Reviewer with consolidation permissions can start a consolidation when review are available for consolidation - 1
- [ ] Consolidator is able to agree or disagree with reviewer suggestions and make comments - 1
- [ ] Consolidator is able submit consolidation as changes requested (when at least on disagree) - 1
- [ ] Consolidator is able to submit consolidation as LOQ (at least one declined), Non Conform (at least on decline), Conform (all approved and agreed) - 1
- [ ] See a list of applications that I am permitted to review - 1 (duplicate)
- [ ] List shows applications that have been assigned to review - 1 (duplicate)
- [ ] Review home page shows status and progress of associated reviews (and what I can do with each one) - 1 (duplicate?)
- [ ] Can "self-assign" review if application and reviewLevel allows it - 1
- [ ] Select which comments get sent to applicant in LOQ (if Level 2+) - 3
- [ ] Get notified of new jobs -- assignments or changes submitted - 2 (duplicate)
- [ ] Apply for permissions to perform new tasks/reviews - 3
- [ ] Make changes to my reviews on request from a senior reviewer - 1
- [ ] If senior reviewer, make Final decision for application (same as consolidator) - 1
- [ ] Senior reviewer can make Final decision regardless of lower level recommendations (i.e. can overrule earlier reviews) - 3
- [ ] When drug registration/import-permit/company is approved generates a certificate/permit/company - 1
- [ ] When drug registration/import-permit/company is declined, inform user of non conformity with message and generated document - 1
- [ ] When consolidation/review (highest level) is submitted as LOQ, inform user of LOQ and generate LOQ document - 1

### Assigner

- [ ] Restrict visibility of applications where assigner is able to assign (for current stage) - 1
- [ ] See actionables in the list of applications to assign or re-assign - 1(assign) 2(re-assign)
- [ ] See review home page with assignment of reviewers per section and progress if already submitted - 1
- [ ] Per section, show which reviewers can be assigned (based on the configuration) - 1
- [ ] Able to assign in review home page by section to user - 1
- [ ] Get prompt before re-assigning to other reviewer in case review has been started or submitted - 2
- [ ] See assignment done by others when higher level permissions apply - 3
- [ ] Get notified by email when new assignment task is required for an application (new application submitted, change of stage) - 2
- [ ] Able to configure assigner for a stage and level 1 - 1
- [ ] Able to configure assigner for a stage and any level - 3
- [ ] Restrict reviewer configurations for reviewing a set of sections - 2
- [ ] Ability to set level of notifications - 3
- [ ] Can assign by question - 3

### Public user

- [ ] View drug registrations (API)
- [ ] Create an account on the system 1d
- [ ] I can confirm my email address after creating user account

### Admin

- [ ] Delete user from the system
- [ ] View permissions associated to user
- [ ] Configure policies and permission names associated to act on templates
- [ ] Import template ~~with core actions~~ with default permissions
- [ ] Edit existing templates that can be tested and set as available
- [ ] The system automatically cleans up stale applications, and auto-declines applications that have passed their deadlines (Scheduled Actions)

## Technical stories

- [ ] Layout using fonts and colours as designed
- [ ] Get build process working, including serving plugins through module federation
- [ ] Deployment
- [ ] Demo server
- [ ] Docker instance for interested parties

## Admin documentation

## Deployment

## Documentation

- [ ] Creating new user and associating to organisations
- [ ] Features available to Applicant users:
- [ ] Apply to company
- [ ] Change current company
- [ ] Apply for Drug registration
- [ ] Make changes required
- [ ] Notifications by email
- [ ] Dashboard & filters
- [ ] View certificates for drugs
- [ ] Features available to Reviewer users:
- [ ] Login as FDS user, create new account for other FDS user
- [ ] Review self-assignment
- [ ] Assigning reviewers per section
- [ ] Start/Continue review of sections assigned
- [ ] Preview documents uploaded and make decision/comments per question
- [ ] Consolidate reviews and send back to reviewer
- [ ] See history of changes requested and review changes made
- [ ] Review and make changes requested
- [ ] Re-consolidate pending review (after changes requested submitted)
- [ ] Submit List of Questions back to applicant
- [ ] Make decision to Conform/Non-conform and submit review with change to outcome
- [ ] List applications per outcome, assignee, stage, actionable, dates, etc
- [ ] Login as Admin (on BW entry or initial setup with basic Admin credentials)
- [ ] List of available templates, versions and applications in the system
- [ ] Edit existing template using the template builder
- [ ] Editing permission and grant/revoke user permissions
- [ ] Create new admin user
- [ ] Export/import template
- [ ] Basic setup to access demo (Docker or server hosting)
- [ ] Instructions on how to report bugs/improvements (using this repo)
