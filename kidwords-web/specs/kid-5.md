# Ticket: (https://linear.app/kidwords/issue/KID-5/implement-categories-for-easy-navigation) 

# Functional Goal: Implement word categories 
- Implement a list of categories that each word can be tagged under (occasionally words will be tagged under multiple categories like the word "bear")
- This should be a navigation panel to the left, replacing the "words" section. 
- Categories list should be safe, useful and de-duped (if we have "emotion" we shouldn't have "emotions")
- Categories list should also be based on child's level (pre-K, kindergarten, first grade)

Use something like this: 
```
export type CategoryId = "feelings" | "actions" | "space" | "describing" | "toys";

export const CATEGORIES: Record<CategoryId, {
  label: string;
  description: string;
  emoji?: string;
}> = { ... };
```
Use the categories described below for each level: 

Pre-K categories list:
* how we feel 
* things we do 
* describing words
* friends
* thinking
* the world
* play
* my date

Kindergarten
* feelings
* actions
* describing words
* friends and school 
* thinking & learning
* nature
* play and make
* my day

1st Grade
* Emotions
* Actions 
* Describing words 
* friends and community 
* thinking & learning
* nature and science 
* play and create
* time and routines


# Non-Functional Goals: 
- no impact to latency or page load 
- read docs/development.md, docs/strategy.md to understand how to implement in this codebase 

# UX notes: empty/error/loading states
- if categories are not loading, or are not found, display "no categories found, search for words" 

# Acceptance criteria: 5–10 checkboxes
- Works functionally 
- Passes all unit tests; if there are none, write them 
- New line code coverage > 80% 
- Existing line code coverage >= 80% 
