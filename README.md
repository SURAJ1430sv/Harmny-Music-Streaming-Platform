# Harmny-Music-Streaming-Platform
Spotify Clone type music streaming website where user can upload their song and listen whenever they want.

# Simplest way to run it:
Step 1 : Download it into your folder 
Step 2 : Open with code editer
Step 3 : Open terminal of editer 
Step 4 : Run this Command "npm install"
Step 5 : After that run this command "npm run dev"

modules = ["nodejs-20", "bash", "web"]
run = "npm run dev"
hidden = [".config", ".git", "generated-icon.png", "node_modules", "dist"]

[nix]
channel = "stable-24_05"

[deployment]
deploymentTarget = "cloudrun"
run = ["sh", "-c", "npm run dev"]

[[ports]]
localPort = 5000
externalPort = 80

[workflows]
runButton = "Start application"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "Suraj"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Start application"

[[workflows.workflow]]
name = "Start application"
author = "Suraj"

[workflows.workflow.metadata]
agentRequireRestartOnSave = false

[[workflows.workflow.tasks]]
task = "packager.installForAll"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000
