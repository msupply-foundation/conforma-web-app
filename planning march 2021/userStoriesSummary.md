## Epic links

### Start/Technical

- [Epic #1](76) Schema documentation
- [Epic #2](77) App routing
- [Epic #6](74) Query Syntax and Actions plugin
- [Epic #7](75) Question (Form Element) Plugins
- [Epic #21](101) Structure refinements of hooks and new routing

### Done

- [Epic #8](70) Basic Application Skeleton
- [Epic #9](73) In Progress application
- [Epic #12](95) Login/Logout
- [Epic #11](93) JWT Token & Permissions
- [Epic #14](173) Application Submit
- [Epic #20](100) Review of applications
- [Epic #24](231) Application Start/End pages
- [Epic #17](96) Create organisation
- [Epic #42](475) Join organisation

### In progress

- [Epic #13](94) Application Changes Requested
- [Epic #16](98) List and Filter applications
- [Epic #18](97) Drug Registration
- [Epic #19](99) Review Assignment
- [Epic #22](165) Consolidation of Reviews
- [Epic #23](249) Dashboard
- [Epic #30](330) Lookup tables
- [Epic #33](333) Application to PDF for download
- [Epic #41](430) File upload management
- [Epic #47](506) Display available actions

### On hold:

- [Epic #10](78) App Layout & menus
- [Epic #31](331) Reviews History
- [Epic #32](332) Emailing action
- [Epic #34](334) Application final decision
- [Epic #35](335) Applications renew
- [Epic #36](336) Export/Import templates
- [Epic #37](337) Grafana dashboard
- [Epic #38](338) Public docs & tutorials
- [Epic #39](339) Website & demo server
- [Epic#40](340) Country Specific config

### Epics to do (revised & new):

- [Epic #43](502) Edit users permission in organisation
- [Epic #44](503) List users permissions in organisation
- [Epic #45](504) Applicant view applications permission
- [Epic #46](505) Display filter in UI applications list
- [Epic #48](507) Dashboard notifications
- [Epic #49](508) Request organisation permission
- [Epic #50](509) Import permit
- [Epic #51](510) Generate certificate/expiry
- [Epic #52](511) Delete application
- [Epic #53](512) Deadline on applications
- [Epic #54](513) Duplicate application
- [Epic #55](514) Display company logo
- [Epic #56](515) Notifications for upcoming renewals
- [Epic #57](516) Organisation page

### Epics To do/break-down:

- [Epic #25](303) Other less-priority issues
- [Epic #29](239) Template builder

## Features

### Org employee

- [x] Join organisation - 1
  - [Epic #12](95) Login/Logout
  - [Epic #42](475) Join organisation
- [ ] Edit user details - 2
  - [Epic #43](502) Edit users permission in organisation
- [ ] Should only see/edit application for their company and user - 1
  - [Epic #45](504) Applicant view applications by permission
- [x] Do updates on applications after "changes required" - 1
  - [Epic #13](94) Application Changes Requested
- [ ] Get notified by email when "changes required" / "submitted" / "outcome changes" - 1
  - [Epic #32](332) Emailing action
- [ ] See application with different outcomes - 1
  - [Epic #46](505) Display filter in UI of applications list
  - [Epic #48](507) Dashboard notifications
- [ ] Request admin permission in company - 3
  - [Epic #49](508) Request organisation permission
- [ ] Apply for drug registration - 1
  - [Epic #18](97) Drug Registration
- [ ] Apply for import permit - 2
  - [Epic #50](509) Import permit
- [ ] Receive evidence of drug registration and import permit - 2
  - [Epic #51](510) Generate certificate/expiry
- [ ] Withdrawn application - 3
  - [Epic #52](511) Delete application
- [ ] Delete a draft application - 2
  - [Epic #52](511) Delete application
- [ ] Select different organisation to apply for Drug registration and import permit - 2d
  - [Epic #12](95) Login/Logout
  - [Epic #18](97) Drug Registration
  - [Epic #50](509) Import permit
- [ ] View applications by status, by dates and by outcome - 1
  - [Epic #16](98) List and Filter applications
  - [Epic #46](505) Display filter in UI of applications list
- [ ] View applications deadline which are waiting for "changes required" - 2
  - [Epic #53](512) Deadline on applications
- [ ] Duplicate/Export application - 3
  - [Epic #33](333) Application to PDF for download
  - [Epic #54](513) Duplicate application

### Org owner

- [ ] Create a company - 1
  - [Epic #17](96) Create organisation
- [ ] Display company logo from application - 2
  - [Epic #55](514) Display company logo
- [ ] Apply to make changes to organisation - 3
- [ ] Approve user joining organisation - 1
  - [Epic #42](475) Join organisation
  - [Epic #20](100) Review of applications
  - [Epic #13](94) Application Changes Requested
- [ ] View users permission on organisation - 2
  - [Epic #44](503) List users permissions in organisation
- [ ] Edit (add/delete) user permission on organisation - 2
  - [Epic #43](502) Edit users permission in organisation
- [ ] Remove user from organisation - 3
  - TODO Epic: Remove users from organisation
- [ ] View organisation: status - available/disabled, - renew date - 3
  - [Epic #57](516) Organisation page
- [ ] List of application results (i.e. import permits expiry dates) - 1
  - [Epic #51](510) Generate certificate/expiry
- [ ] Apply for more then one company - 2
  - TODO Epic: Deal with multi-role user (Applicant/Reviewer)
- [ ] Notifications for upcoming renewals (drug rego, import permits, etc..) - 3
  - [Epic #56](515) Notifications for upcoming renewals

### Reviewer

- [ ] Join FDA organisation - 1
- [ ] See reviewer actionable list (start, continue, re-review, update, locked) and application info (stage) - 1
- [ ] Restrict visibility of applications for individual reviewer (only see assigned reviews) - 1
- [ ] Have filters to see applications visible to reviewer by stage, date, assignee, outcome, etc (list other options) - 1
- [ ] See history of reviews of application in a previous "stage" in the review home page (yourself) - 2
- [ ] See reviews done by others (after been submitted) for the same application when higher level permissions apply (others) - 3
- [ ] Get notified by email when "assigned" / "available for self-assignment" / "outcome change" / "pending" / "changes requested" - 2
  - [Epic #32](332) Emailing action
- [ ] Start a review and see all questions assigned with a review option to `approve`/`decline` and make comments - 1
- [ ] View history with previous responses or review changes required on each question - ?
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
- [ ] Apply for permissions to perform new tasks/reviews - 3
- [ ] Make changes to my reviews on request from a senior reviewer - 1
- [ ] If senior reviewer, make Final decision for application (same as consolidator) - 1
- [ ] Senior reviewer can make Final decision regardless of lower level recommendations (i.e. can overrule earlier reviews) - 3
- [ ] When drug registration/import-permit/company is approved generates a certificate/permit/company - 1
  - [Epic #51](510) Generate certificate/expiry
- [ ] When drug registration/import-permit/company is declined, inform user of non conformity with message and generated document - 1
  - [Epic #32](332) Emailing action
- [ ] When consolidation/review (highest level) is submitted as LOQ, inform user of LOQ and generate LOQ document - 1
  - [Epic #32](332) Emailing action
  - [Epic #33](333) Application to PDF for download

### Assigner

- [ ] Restrict visibility of applications where assigner is able to assign (for current stage) - 1
  - [Epic #](518) Add and configure assign policy
- [ ] See actionables in the list of applications to assign or re-assign - 1(assign) 2(re-assign)
  - [Epic #47](506) Display available actions
- [ ] See review home page with assignment of reviewers per section and progress if already submitted - 1
  - [Epic #19](99) Review Assignment
- [ ] Per section, show which reviewers can be assigned (based on the configuration) - 1
  - [Epic #19](99) Review Assignment
- [ ] Able to assign in review home page by section to user - 1
  - [Epic #19](99) Review Assignment
- [ ] Get prompt before re-assigning to other reviewer in case review has been started or submitted - 2
  - [Epic #19](99) Review Assignment
- [ ] See assignment done by others when higher level permissions apply - 3
  - `note` -> epic can be shared with other user role stories where permissions are extended with 'supervisor' policy/permissionName
- [ ] Get notified by email when new assignment task is required for an application (new application submitted, change of stage) - 2
  - [Epic #32](332) Emailing action
- [ ] Able to configure assigner for a stage and level 1 - 1
  - [Epic #19](99) Review Assignment
- [ ] Able to configure assigner for a stage and any level - 3
  - [Epic #](520) Assignment to work for all levels
- [ ] Restrict reviewer configurations for reviewing a set of sections - 2
  - [Epic #19](99) Review Assignment
- [ ] Ability to set level of notifications - 3
  - `note` -> epic can be shared with other user role stories about notifications
- [ ] Can assign by question - 3
  - [Epic #](521) Assignment by question

### Public user

- [ ] View drug registrations (API)
  - [Epic #51](510) Generate certificate/expiry
- [ ] Create an account on the system 1d
  - [Epic #12](95) Login/Logout
- [ ] I can confirm my email address after creating user account
  - [Epic #32](332) Emailing action

### Admin

- [ ] Unlink/Delete user/organisation from the system
  - [Epic #43](502) Edit users permission in organisation and organisation permission in the system
- [ ] Update permissions associated with user/s
  - [Epic #43](502) Edit users permission in organisation and organisation permission in the system
- [ ] View permissions associated to user
  - [Epic #44](503) List users permissions in organisation
- [ ] Edit existing templates that can be tested and set as available
  - [Epic #](527) Versioning templates
- [ ] Able to create new draft version of application template and edit it without affecting original 'live' version
  - [Epic #](527) Versioning templates
- [ ] The system automatically cleans up stale applications, and auto-declines applications that have passed their deadlines (Scheduled Actions)
  - [Epic #](525) Expiry and auto declined period and application limits of applications for a template
- [ ] Edit expiry and auto declined period and application limits of applications for a template
  - [Epic #](525) Expiry and auto declined period and application limits of applications for a template
- [ ] Setup localisation
  - [Epic #](528)
- [ ] Upload templates for document generation and configure at what 'level', 'stage', 'outcome', 'role' and 'template' this documents should apply
  - [Epic #33](333) Application PDF tempaltes
- [ ] Add/remove/edit - sections, stage and review levels
  - [Epic #](529) - Application Template structure and general info configurations
- [ ] Add/remove/edit - Form elements (is visible, is required, is editable, parameters)
  - [Epic #](539) Application Template configurations of Form Elements
- [ ] Add/remove/edit - Actions
  - [Epic #](530) - Application Template configuration of Actions
- [ ] Add/remove/edit - Template Permissions
- [ ] Import/Export - Whole template
  - [Epic #](523) Import and Export Template
- [ ] Import/Export - Template structure
  - [Epic #](523) Import and Export Template
- [ ] Import/Export - Selected form elements
  - [Epic #](523) Import and Export Template
- [ ] Import/Export - Actions
  - [Epic #](523) Import and Export Template
- [ ] Import/Export - Permission Structure
  - [Epic #](523) Import and Export Template
- [ ] Able to edit permission policies
  - [Epic #](532) Able to edit permission policies and names
- [ ] Able to edit permission names
  - [Epic #](532) Able to edit permission policies and names
- [ ] Able to edit Permission Structure
  - [Epic #](533) Configurations of template permissions
- [ ] Can setup outcome tables and configure how they are populated (actions)
  - [Epic #51](510) Generate certificate/expiry
- [ ] Can expose outcome tables (partial or as a whole) to public users
  - [Epic #](534) Expose tables to public
- [ ] Disable server to receive new applications (andrei - not sure what this is)

## Technical stories

- [ ] Layout using fonts and colours as designed
- [ ] Get build process working, including serving plugins through module federation
- [ ] Deployment
- [ ] Demo server
- [ ] Docker instance for interested parties

## Admin documentation

## Deployment

- [ ] Uploaded documentes hosting server

## Documentation

- [ ] External docs
  - [Epic #38](338) Public docs & tutorials
