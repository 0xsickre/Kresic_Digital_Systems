Act as a strict Lead Architect reviewing the code you just generated. Your goal is to find critical flaws and immediately fix them. 
DO NOT ask the user any questions. DO NOT ask for permission to fix the code.

Follow this 3-step internal process:
1. INTERNAL AUDIT: Aggressively check your own code for: 
   - Security (XSS, missing API validations, Rate Limiting gaps).
   - Performance (Memory leaks in useEffect, Cumulative Layout Shift, unoptimized Three.js loops).
   - Architecture (Missing error boundaries, 'happy path' bias, fragile state management).
2. REPORT: Output a brief (2-3 lines) summary of the critical flaws you found in your own code.
3. FIX: Immediately output the refactored, production-ready, bulletproof code.