+++
title = "mFlow demo"
insert_anchor_links = "right"
weight = 1
+++

## Introduction

Demo can be accessed at: [https://irims-demo.msupply.org:50000/](https://irims-demo.msupply.org:50000/)

This demo allows you to use the **mFlow Application Manager** system to experience the following workflow:

1. **Create a user account**

   This is an automated process that requires email verification.

2. **Register a company**

   A reviewer will approve this application, which will create your organisation in the system.

3. **Apply for a licence for your company to register products**

   This will require 2 levels of review -- an initial screening, and an an assessment by a more senior reviewer. You will receive a PDF licence and permission to register a product (for 3 days)

4. **Register a product**

   This requires a full review process:

- initial screening
- assessment by senior reviewer
- consolidation of review (this means a more senior staff member comments on and approves the review before it gets sent back to the applicant)
- a final decision by a chief, who can over-rule lower-level review decisions if they see fit

For the purposes of this demo, you can switch to alternative "reviewer" accounts to review the applications (more on that [below](#reviewer-experience)).

### 1. Create a user account

At the login screen, click "Create new account". Fill in the registration form and submit your application. You should receive an email with a link to verify your email address. On verification, your user account will be created and you'll be able to log in.

### 2. Register a company

After logging in, you'll arrive at the **Dashboard** screen. The dashboard is essentially a "home" page where you can see a summary of your current applications, things that require action, and links to start new applications. At this point, the only application you have permission to start is "Company Registration".

Click "Start a new Company Registration", fill in the application form, and submit.

Your application now has to be reviewed. In the meantime, you can see its status on the Dashboard, or from the **Applications List**, which can be accessed from the main menu bar (select "Company Registration" from the Dropdown menu)

Once it has been reviewed, you'll receive an email stating your company has been created in the system, and your Dashboard will show you now have permission to apply for a licence.

### 3. Apply for a licence for your company to register products

Further applications must be done on behalf of the company you registered, so please make sure you are logged in with your company selected -- your company name (and logo) should show in the main header. If it's not there, try logging out and in again, and be sure to select your company name if asked during the login process.

Now, from the Dashboard, you should see a link to "Start a new Company Licence -- Modern medicines or Medical devices". Follow this link and complete the application as before.

Then wait to have your application reviewed. Be aware that you may be required to make amendments to your application if a reviewer requests it.

Once your application has been approved, you'll receive a copy of your licence via email (as a PDF document), and your Dashboard will show that you can now apply to register a product.

### 4. Apply to register a product

From the Dashboard, follow the link to "Register a product" and complete the application form.

Once your application has been approved (by a senior "chief"), you'll see your product added to the product database (accessible via "Outcomes -> Products" in the menu bar)

(Note: Outcome display might be not be configured correctly right now)

## Other utilities

"Log out" and "Edit User Details" can be found in a drop-down menu on the button that shows your name

## Reviewer experience

There are two ways to act as a reviewer in this demo:

1. (Recommended) Log in with the existing reviewer accounts. They all have the password "123456". See below for a list of reviewer accounts and what they can do.
2. (for more advanced users) Create your own new user accounts and assign them appropriate review permissions. To do this log in as Administrator (user: admin, pw: 123456), then:
   - from the "Admin" menu, select "Add user to company". Fill in the form and add a new user to the "Food & Drug Agency" organisation
   - from the same menu, select "Grant user permissions", and assign appropriate permissions to a user (and Food & Drug Agency)

When switching to reviewer accounts, it's a good idea to you use a different browser, or use private/icognito mode in a different tab in order to easily switch between "reviewer" and "applicant" logins.

### Reviewer accounts

| Username        | Permissions                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| basic_reviewer  | - can approve company registrations<br>- can perform initial Screening for licence applications and Product registrations                      |
| senior_reviewer | - can do "Assessment" stage reviews for licence applications and Product registrations                                                         |
| supervisor      | - can consolidate product registrations<br>- can assign (for review levels that can't self-assign)                                             |
| chief           | - can make final decision for product registrations                                                                                            |
| admin           | - can control whole system, including template management, adding users to organisations, granting permissions, etc. (For advanced users only) |

### Review stages for each application type

See detailed documentation for more on the concept of **stages**, **review levels** and **permissions**.

1. **Create user account**

   Automatic -- no reviewer involvement

2. **Register company**

   One stage, one review. Reviewer must have `reviewScreening` permission. Can be self-assigned.

3. **Apply for licence**

   2 stages:

   1. **Screening** - single review (requires `reviewScreening` permission).  
      Can be self-assigned.  
      _Available user_: "basic_reviewer"
   2. **Assessment** - single review level (requires `reviewLicenceAssessment` permission)  
      _Available user_: "senior*reviewer"  
      Must be assigned by an assigner (requires `canAssign` permission)  
      \_Available user*: "supervisor"

4. **Apply to register product**

   3 stages:

   1. **Screening** - single review (requires `reviewScreening` permission)  
      Can be self-assigned.  
      _Available user_: "basic_reviewer"
   2. **Assessment** - 2 review levels:

      - review (requires `reviewLicenceAssessment` permission)  
        _Available user_: "senior*reviewer"  
        Must be assigned by an assigner (`canAssign` permission)  
        \_Available user*: "supervisor"
      - consolidation (requires `consolProduct` permission)  
        _Available user_: "supervisor"

   3. **Final Decision** - single decision (requires `makeDecision` permission)  
      _Available user_: "chief"
