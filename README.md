Networked BoardGame Infrastructure
====

Winter 2014 Project for Software Engineering 2 Group 4

Website access: http://ec2-54-213-160-158.us-west-2.compute.amazonaws.com

For logging into the Database:
* Enter mysql -u root -p
* Enter pass as Group4

**Tools**
* `initialize.[bat|sh]` - Run after cloning repo. Will pull submodules and node libraries
* `update-repo.[bat|sh]` - Updates the repo and submodules to current state
* `build-webapp.[bat|sh]` - Builds the Enyo web client and copies it to the server/public directory
* `run-server.[bat|sh]` - Run the node server, with optional argument port and ip as passed arguments.
