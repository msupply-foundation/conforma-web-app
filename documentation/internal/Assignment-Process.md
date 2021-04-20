# Assignment Process

The logic of assigning a review spans between both web app and server — front end is only concerned with queries and mutations to review_assignment and review_question_assignment tables, whereas back end does most of the grunt work (through actions and triggers) and generates records in those tables based on user permissions and states of application and its review.

## Schema

Seems like a good starting (anchor) point for describing this functionality, let's have look:

![Review Assignment](images/Review-Assignment.png)

First of all, some bulletpoint (and rules) to help clarify the diagram

- One review assignment should exists per reviewer/application/stage/level
- Review assignment can have the following statuses
  - `Available` -> Can be assigned by assigner
  - `Self-assigned by another` -> Was available for self assignment (but self assigned by someone else)
  - `Assigned` -> At least one review_question_assignment was linked to review_assignment
  - `Available for self-assignment` -> Can be self assigned
- Review assignments can be restricted by section/s (template_section_restriction, which is an array of section codes user can review, value can be blank to allow review of all sections)
- Review assignments of status `Available or Assigned` can be assigned by the assigner linked through the join table
- `Assigned` status is used to indicate to the reviewer that they can start the review (if review hasn't been started already)
- Review assignment should only be editable by a reviewer if it's `Available for self-assignment`, otherwise by linked `Assigner`. Review assignment should not be editable once stage of review assignmetn is different to application stage
- `is_last_level` field is a helper field for front end (to avoid front ending needing to figure if if review is last level for given stage)

## Difference between self assignemnt and assignment

The idea behind self assignment originated with requirement for users (who are not themself assigners) to be able to 'choose' or pick which application they will be reviewing. Currently self assignment is not restricted by template_section_restrictions

## The Act of Assigning - Web App

From front end perspective, this involves creating a mutation, which adds review_question_assignments to review_assignment, changes status of review_assignment to `Assigned`. For self assignemnt trigger is set to `ON_REVIEW_SELF_ASSIGN`.

Front end doesn't generate review_assignment records, this happens on the server.

## Server Side

To reduce front end logic, server is responsible for generating review_assignment records, based on user permissions. This is done by an action `generateReviewAssignments` which is configured to fire when application or review changes status.

Basically, when application is submitted, we want to look at all of the permissions linked to application template of type Assign, where template permission configurations match current level and stage, review_assignment records are generated for users who are linked to that template permission (through permission name), and any extra configurations (template section restrictions, canSelfAssign, etc..) are populated for new review_assignment record.

When reviews are submitted, we do similar thing but for level + 1. Typical scenario is a consolidator being informed that they can self assign a consolidation when lower level reviewer submits a review.

## Diagram

This diagram is somewhat complex, it describes some functionality that is not implemented (re-assignment), it can be helpful when visualising full assignment flow (and for analysing different scenariors of assignment)

![Assignment Flow](images/Assignment-Flow-Detailed.png)

## Re-Assignment

todo

# Front End Implementation

Best described in a diagram (this diagram is abstracted to only show bits related to assignments)

![Assignment UI Flow](images/Assignment-Flow-Detailed.png)
