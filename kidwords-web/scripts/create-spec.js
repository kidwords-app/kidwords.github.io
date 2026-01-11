#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const ticketId = args[0];

if (!ticketId) {
  console.error('Usage: node scripts/create-spec.js <TICKET_ID> [ticket-slug]');
  console.error('Example: node scripts/create-spec.js KID-7 implement-new-feature');
  process.exit(1);
}

// Extract ticket number and slug
const ticketMatch = ticketId.match(/KID-(\d+)/i);
if (!ticketMatch) {
  console.error('Error: Ticket ID must be in format KID-<number> (e.g., KID-7)');
  process.exit(1);
}

const ticketNumber = ticketMatch[1];
const ticketSlug = args[1] || `ticket-${ticketNumber}`;

// Generate the spec file content
const specContent = `# Ticket: (https://linear.app/kidwords/issue/${ticketId}/${ticketSlug}) 

# Functional Goal: [Describe the functional goal here]
- [Add functional requirements here]

# Non-Functional Goals: 
- no impact to latency or page load 
- read docs/development.md, docs/strategy.md to understand how to implement in this codebase 

# UX notes: empty/error/loading states
- [Add UX notes here]

# Acceptance criteria: 5–10 checkboxes
- Works functionally 
- Passes all unit tests; if there are none, write them 
- New line code coverage > 80% 
- Existing line code coverage >= 80% 
`;

// Write the file
const specPath = join(__dirname, '..', 'specs', `kid-${ticketNumber}.md`);
writeFileSync(specPath, specContent, 'utf8');

console.log(`✅ Created spec file: specs/kid-${ticketNumber}.md`);
console.log(`📝 Edit the file to fill in the details.`);

