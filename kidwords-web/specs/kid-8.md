# Ticket: (https://linear.app/kidwords/issue/KID-8/implement-a-feedback-button-for-the-web-app) 

# Functional Goal: [Describe the functional goal here]
- Adult users should see a discreet feedback button on the bottom of the page 
- The button when pressed should be adult-gated with a simple test 
- When pressed the button should take the user to mail app to email "sumita.sami@gmail.com" with a template that uses "Feedback: <enter summary here>" as the subject line, and "Please let us know how KidWords can improve its experience: " as the body template. 

# Non-Functional Goals: 
- no impact to latency or page load 
- read docs/development.md, docs/strategy.md to understand how to implement in this codebase 

# UX notes: empty/error/loading states
- Error states should result in "please try again" message

# Acceptance criteria: 5–10 checkboxes
- Works functionally 
- Passes all unit tests; if there are none, write them 
- New line code coverage > 80% 
- Existing line code coverage >= 80% 
