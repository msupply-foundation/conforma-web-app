# Assignment Process

The logic of assigning a review spans between both web app and server — front end is only concerned with queries and mutations to review_assignment table, whereas back end does most of the grunt work (through actions and triggers) and generates records in those tables based on user permissions and states of application and its review.

## Schema

Seems like a good starting (anchor) point for describing this functionality, let's have look:

![Review Assignment](images/Review-Assignment.png)

First of all, some bulletpoint (and rules) to help clarify the diagram

### Assignment rules

- One `review_assignment` should exist per reviewer/application/stage/level
- Review assignment should only be assignable by a reviewer if has `is_self_assignable` = **True**, otherwise by linked `Assigner`.
- Review assignment should not be editable once stage of review assignment is different to the current application stage.
- `is_last_level` field is an automatically calculated field to help front-end (to avoid front ending needing to figure if if review is last level for given stage)

### Assignment status

Review assignment can have the following statuses

- `Available` -> Can be assigned by assigner
- `Assigned` -> indicates that the reviewer is able to create a review (or one already exists)
  - At least one section is included in field `assigned_sections` on review_assignment

To also determine if this assignment can be Self-assigned, 3 other fields come on the scene:

- `is_self_assignable` -> Can be self assigned (if not locked - how we prevent other self-assigners after one is already assigned)
- `is_locked` -> Can be used to either prevent self-assignment or to generate a Review with status = LOCKED & assignment status is ASSIGNED\*

Another possibility for assignment is using the flag:

- `is_final_decision` -> Used to assign reviewers with specific permissions that gets Assignment.status = ASSIGNED automatically.

\* This is specifically used for assignment of partial reviews. For example, 2 reviewers have been assigned to different Sections of the same application. After one submits back to the Applicant the other one needs to be blocked -- this would be flagged in the Review.status = LOCKED. But if there is only Assignment and no review started, we set the Assignment is_locked = true to generate a Review.status LOCKED when started.

### Restrictions

Review assignments can be restricted by section/s

- `template_section_restriction` is an array of section codes user can review
- Default is `null` which allow review of all sections or all questions in the application

### Assigner settings

- Review assignments of status **Available** can be assigned by assigners
- Review assignments of status **Assigned** with `Review.status` != **Submitted** can be unassigned or re-assigned by assigners
- Assigner is linked through the `review_assignment_assigner_join` table

#### Difference between self-assignment and assignment

The idea behind self assignment originated with requirement for users (who are not themselves assigners) to be able to 'choose' or pick which application they will be reviewing.
When the assignment `is_self_assignment` or `is_final_decision` all sections will be assigned to the same user.

**Note**: Currently self assignment is not restricted by `template_section_restrictions`.

## Pre-assignment process

To reduce front-end logic, server is responsible for generating `review_assignment` records, based on user permissions. This is done by an action called `generateReviewAssignments` which is configured to fire when application or review changes status.
e.g.: Application is Submitted, Review is approved and moves to new Stage or Level.

### Application submission

The server logic looks at all of the permissions linked to application template of type `review`, where template permission configurations match current `level` and `stage`. It creates `review_assignment` records for users who are linked to that template permission (through permission name), and any extra configurations (`template_section_restrictions`, `canSelfAssign`, etc..) are populated for new review_assignment record.

### Review submission

The server logic does similar thing as what is done when Application is submitted, but for level + 1. Typical scenario is a consolidator being informed that they can self assign a consolidation when lower level reviewer submits a review.

## Assigning process

Available for either a Reviewer that can do **self-assignment** or an Assigner with permission to **assign** applications of a certain template type on a `level` and `stage` (settings defined on the `template_permission` of each Template).

To **assign** or **self-assignment** the Reviewer of sections of one application there are option available on the Applications list of on the Application home page.

### Web App

#### Self-assignment

A GraphQL mutation `updateReviewAssignment` runs in the front-end when the user clicks on the **Self-assign** for each section (self-assignment will propagate for all sections).
What happens as a result of this mutation is:

1. `review_assignment.trigger` is set to ON_REVIEW_SELF_ASSIGN.
2. Changes `review_assignment.status` to **Assigned**.
3. Sets all `assigned_sections` on record

- it means that all elements of type QUESTION in these sections are also assigned

4. Other updates done on the server-side:

- Update other `review_assignment` with `is_self_assignment` as **True** to have field `is_locked` to **True**. So other self-assignments for same application get locked.

#### Assigning (by assigner)

A GraphQL mutation `updateReviewAssignment` is created on the front-end when the user selects a reviewer in drop down for each section (or all sections when rules apply).

1. `review_assignment.trigger` is set to ON_REVIEW_ASSIGN.
2. Changes status of `review_assignment` to **Assigned**.
3. Sets assignerId of current user in the new assignment.
4. Sets all `assigned_sections` on record

- it means that all elements of type QUESTION in these sections are also assigned

5. Other updates done on the server-side:
   - If an existing `review` was connected to this assignment will change the `review.status` from **Discontinued** to **Draft**.
   - Update other `review_assignment` with `is_self_assignment` as **True** to have field `is_locked` to **True**. So other self-assignments for same application get locked.

#### Re-Assignment

A GraphQL mutation `reassignReviewAssignment` runs on the front-end when one assigner:

- selects **re-assign** in the drop down
- selects the new reviewer in drop down for a section (or all sections).

1. If all sections were unassigned from previous assignemnt

- Run the unassignment with `review_assignment.trigger` for previous assignment set to ON_REVIEW_UNASSIGN.
- Set the status of previous `review_assignment` to **Available**.
- Updates the assignerId?

2. Else if some sections are still assigned to previous assignment

- Just update the previous assignment `assigned_sections` but keep status as **Assigned**.

3. Updates the new assignment

- Set the `review_assignment.trigger` to ON_REVIEW_REASSIGN.
- Changes status of new `review_assignment` to **Assigned**.
- Sets assignerId of current user in the new assignment.
- Sets `assigned_sections` on record - it means that all elements of type QUESTION in these sections are also assigned

7. Other updates done on the server-side:
   - If an existing `review` was connected to previous assignment UNASSIGNED it will change the `review.status` from **Draft** to **Discontinued**.
   - If an existing `review` was connected to new assignment REASSIGNED it will change the `review.status` from **Discontinued** to **Draft**.

**Note**: No need to change other assignment flag `is_locked` since it has been assigned to reviewers already.

#### Unassignment

A GraphQL mutation `unassignReviewAssignment` runs on the front-end when one assigner:

- selects **un-assign**
- confirms unassignment of reviewer for each section (or all sections when rules apply).

1. `review_assignment.trigger` is set to ON_REVIEW_UNASSIGN.
2. Changes status of `review_assignment` to **Available** and flag `is_locked` to **False**.
3. Set `assigned_sections` to empty array
4. Other updates done on the server-side:
   - If an existing `review` was connected to this assignment will change the `review.status` from **Draft** to **Discontinued**.
   - Update other `review_assignment` with `is_self_assignment` as **True** to have field `is_locked` to **False**. So other self-assignments for same application are unlocked.

## Diagram

This diagram is somewhat complex — it describes some functionality that is not implemented (re-assignment), but it can be helpful when visualising full assignment flow (and for analysing different scenarios of assignment)

![Assignment Flow](images/Assignment-Flow-Detailed.png)

# Front End Implementation

Best described in a diagram (this diagram is abstracted to only show bits related to assignments)

![Assignment UI Flow](images/Assignment-UI-Flow.png)
