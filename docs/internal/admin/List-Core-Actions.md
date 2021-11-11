# List of Core Actions

The snapshot loaded with the system at the start, called `core_templates`, has a template called `Sample template`, which contains all the core actions listed here.

## Disclaimer

The plugin actions that will be listed here are different from actions that users can act in the sytem, this are only meant for admins and configure how the system will work.
Core-actions aren't meant to be modified, and only someone with expertise should be dealing with these. Otherwise some of the features that rely on certain actions would stop working.

## Briefing

Core-actions are listed in each template and are configurations that run after certain events happen triggered by changes done by users in Applications linked to the template.
These actions should be added at the start of a template creation - one simple way is to duplicate the `Sample template` to start with all of these core-actions in the new template configuration, although it is recommended you duplicate one of the other core templates that mostly closely matches your requirements, and it will also have all the core actions included (with some exceptions for a couple of the simpler templates)
Some of the plugin actions - which aren't core-actions - are also defined per template (and some examples at the end) used mainly for configuring notifications, generation of certificates, and outcomes.

## Lists

This list should reflect the same as we have in `Sample templates` so when changing that we need to also add to this list.

### Templates

- Edit User Details (No review)
- User Registration (No review)
- Company Registration (1 stage)
  - Review - permission: `reviewGeneral`
- Join Company (1 stage)
  - Review: - permissioin: `reviewGeneral`
- Demo -- Features Showcase (3 stages)
  - Screening - permission: `reviewScreening` self-assignable
  - Assemessment: (2 levels)
    - 1. Review permissions: `reviewGeneral` and assigner: `assignGeneral`
    - 2. Consolidation permission: `reviewAssessmentLevel2` self-assignable
  - Final decision - permission: `reviewFinalDecision`
- Sample template (1 stage)
  - Approval - permission: `reviewGeneral` self-assignable or assigner: `assignGeneral`
- Reset Password (No review)
- Grant User Permissions (No review)
- Add User to Company (No review)

### Core-actions

There is documentation on the code of these as well in the [repo](https://github.com/openmsupply/application-manager-server/blob/develop/database/insertData/_helpers/core_mutations.js)

#### Trigger: ON_APPLICATION_CREATE

1. Generate serial
2. Generate Application name
3. Increment Stage

#### Actions

1. Generate serial

   - Action: "generateTextString"
   - Description: "**CORE-ACTION** Generate serial for application when created"
   - Condition: Always

2. Generate Application name

   - Action: "generateTextString"
   - Description: "**CORE-ACTION** Generate name for application wen created"
   - Condition: Always

3. Increment Stage

   - Action: "incrementStage"
   - Description: "**CORE-ACTION** Increment to first stage when application is created"
   - Condition: Always

#### Trigger: ON_APPLICATION_RESTART

##### Actions

1. Change status to DRAFT
   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change application status from CHANGES REQUIRED to DRAFT when the applicant restarts one application with to do updates (as requested in review)."
   - Condition: Always

#### Trigger: ON_APPLICATION_SUBMIT

1. Change Status to SUBMITTED
2. Trim duplicate responses
3. Generate Review Assignment Records
4. Update Review Statuses
5. Clean up Application files

##### Actions

1. Change Status to SUBMITTED

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change application status from DRAFT to SUBMITTED when the applicant submits the application"
   - Condition: Always

2. Trim duplicate responses

   - Action: "trimResponses"
   - Description: "**CORE-ACTION** Remove duplicated and unchanged responses when application is re-submitted by the applicant."
   - Condition: Always

3. Generate Review Assignment Records

   - Action: "generateReviewAssignments"
   - Description: "**CORE-ACTION** Generate level 1 review assignments in current stage after application is submitted by the applicant"
   - Condition: Always

4. Update Review Statuses

   - Action: "updateReviewsStatuses"
   - Description: "**CORE-ACTION** Update reviews status with review assignment linked to changed responses by applicant when application is resubmitted."
   - Condition: Always

5. Clean up Application files

   - Action: "cleanupFiles"
   - Description: "**CORE-ACTION** Garbage collector for files uploaded and removed by the applicant"
   - Condition: Always

#### Trigger: ON_REVIEW_CREATE

1. Change Status to DRAFT
2. Lock Review when Assignment is locked

##### Actions

1. Change Status to DRAFT

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change review status to DRAFT when the reviewer clicks to start one assignment (and not locked) new review"
   - Condition: Always

2. Lock Review when Assignment is locked

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change review status to LOCKED when the reviewer clicks to start one assignment with has flag isLocked as true"
   - Condition: Only when Assignment is locked

#### Trigger: ON_REVIEW_RESTART

1. Change Status to DRAFT

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change review status to DRAFT when the reviewer clicks to re-review a previous review made which has new status as PENDING or CHANGES REQUESTED. Previous status depends if is coming from lower level or applicant (PENDING) or if is coming back from upper level reviewer (CHANGES REQUESTED)"
   - Condition: Always

#### Trigger: ON_REVIEW_SELF_ASSIGN

- Asynchronous: Lock other Self-Assignments

  - Action: "updateReviewAssignmentsStatus"
  - Description: "**CORE-ACTION** On Self-assignment change other self_assignment reviewAssignment flag is_locked to True"
  - Condition: Always

#### Trigger: ON_REVIEW_ASSIGN

- Asynchornous: Lock other Self-Assignments

  - Action: "updateReviewAssignmentsStatus"
  - Description: "**CORE-ACTION** On Assignment change other self_assignment reviewAssignment flag is_locked to True"
  - Condition: Always

#### Trigger: ON_REVIEW_REASSIGN

1. Change Review status (if existing)

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** On Re-assignment if review is existing change to DRAFT or LOCKED (if assignment flag is_locked isTrue)"
   - Condition: Always

#### Trigger: ON_REVIEW_UNASSIGN

1. Unlock other Self-Assignments
2. Change Review status to DISCONTINUED

##### Actions

1. Unlock other Self-Assignments

   - Action: "updateReviewAssignmentsStatus"
   - Description: "**CORE-ACTION** On Un-assignment change other reviewAssignment that has flag is_self_assignment = True set flag is_locked to False"
   - Condition: Always

2. Change Review status to DISCONTINUED
   - Action: "changeStatus"
   - Description: "**CORE-ACTION** On Re-assignment happens change previous review status to DISCONTINUED"
   - Condition: Always

#### Trigger: ON_REVIEW_SUBMIT

1. Adjust visibility of Review Responses (for applicant - LOQ)
2. Change status to SUBMITTED
3. Trim duplicated responses
4. Update Review Statuses
5. Increment Application Stage
6. Generate Review Assignments
7. Change Application Status (for applicant - LOQ)
8. Change Application Outcome (on last stage submission)

##### Actions

1. Adjust visibility of Review Responses (for applicant - LOQ)

   - Action: "updateReviewVisibility"
   - Description: "**CORE-ACTION** Allow visibility to review responses (always level 1) on the current stage that were DECLINED to show to applicant after review is submitted with decision of LIST_OF_QUESTIONS"
   - Condition: When review is_last_level & decision is LIST_OF_QUESTIONS

2. Change status to SUBMITTED

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change review status to SUBMITTED when the reviewer submits"
   - Condition: Always

3. Trim duplicated responses

   - Action: "trimResponses"
   - Description: "**CORE-ACTION** Remove duplicated and unchanged responses or ones without a decision made when review is re-submitted by the reviewer."
   - Condition: Always

4. Update Review Statuses

   - Action: "updateReviewsStatuses"
   - Description: "**CORE-ACTION** Update other review status to PENDING or CHANGES REQUESTED after one review is submitted to another reviewer in the chain of review-levels"
   - Condition: Always

5. Increment Application Stage

   - Action: "incrementStage"
   - Description: "**CORE-ACTION** Increment stage of application when last level reviewer submits review with decision of CONFORM or NON_CONFORM"
   - Condition: When Reviewer is_last_level & decision is either CONFORM or NON_CONFORM

6. Generate Review Assignments

   - Action: "generateReviewAssignments"
   - Description: "**CORE-ACTION** Generate next level (in current stage) of review assignments after one reviewer submits a review to next level - when applicable"
   - Condition: Always

7. Change Application Status (for applicant - LOQ)

   - Action: "changeStatus"
   - Description: "**CORE-ACTION** Change application status to CHANGES_REQUIRED once a last level reviewer submits with decision of LIST_OF_QUESTIONS"
   - Condition: Reviwer is_last_level & decision is LIST_OF_QUESTIONS

8. Change Application Outcome (on last stage submission)

   - Action: "changeOutcome"
   - Description: "**CORE-ACTION** Change application outcome when last level and last stage - usually a final decision - submits a review as CONFORM or NON_CONFORM. Outcome will be APPROVED or REJECTED accordingly"
   - Condition: When Reviewer is_last_stage & is_last_level & decision is either CONFORM or NON_CONFORM

**Note**: No need to use "changeStatus" for seting status of COMPLETED when application outcomes is set to APPROVED/REJECTED - this will happen automatically.

### Other actions

#### Trigger: ON_APPLICATION_SUBMIT

- Asynchronous console log

1. **TODO** Add example of PDF generation

##### Actions

- Asynchronous console log
  - Action: "consoleLogger"
  - Description: "Example: console log with application serial and template code"
  - Condition: Always

#### Trigger: ON_REVIEW_SUBMIT

1. Change Application Outcome (on Rejection in early stage)
2. Generate new Organisation when APPROVED
3. Add User to new Organisation
4. Grant Permissions to User in Organisation
5. Send Email to User when APPROVED
6. Send Email to User when REJECTED
7. Send Email to User when LIST_OF_QUESTIONS
8. **TODO** Add example of expiry
9. **TODO** Add example of certificate

##### Actions

1. Change Application Outcome (on Rejection in early stage)

   - Action: "changeOutcome"
   - Description: "Example action - Change outcome to REJECT in case of NON_CONFORM decision in first stage of Screening."
   - Condition: When Reviewer is_last_level & stage is Sreening & decision is NON_CONFORM

2. Generate new Organisation when APPROVED

   - Action: "modifyRecord"
   - Description: "Example: action to modify record in database using fields from application when outcome is change to APPROVED"
   - Condition: When application outcome is APPROVED

3. Add User to new Organisation

   - Action: "joinUserOrg"
   - Description: "Example: action to connect user to organisation when application outcome is APPROVED"
   - Condition: When application outcome is APPROVED

4. Grant Permissions to User in Organisation

   - Action: "grantPermissions"
   - Description: "Example: action to grant permissions to user when logged in with organisation joined when application outcome is APPROVED"
   - Condition: When application outcome is APPROVED

5. Send Email to User when APPROVED

   - Action: "sendNotification"
   - Description: "Send notification about Core-action application to user's email when outcome is APPROVED"
   - Condition: When application outcome is REJECTED

6. Send Email to User when REJECTED

   - Action: "sendNotification"
   - Description: "Send notification about Demo application to user's email when the outcome is REJECTED"
   - Condition: When application outcome is APPROVED

7. Send Email to User when LIST_OF_QUESTIONS

   - Action: "sendNotification"
   - Description: "Send notification about Demo application to user's email when reviewer has submitted a List of Questions"
   - Condition: When Reviewer latest decision is LIST_OF_QUESTIONS
