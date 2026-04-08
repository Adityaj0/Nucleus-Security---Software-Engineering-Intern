# Nucleus Security Engineering Internship Assessment Report

## Part 1: Code Review (Python Webhook)

### Code Comments & Security Audit

| Line | Issue Type | Description |
| :--- | :--- | :--- |
| **136** | **Security** | `WEBHOOK_SECRET` defaults to `"dev-secret"`. A missing environment variable should cause a safe failure rather than fallback to a weak default. |
| **142** | **Security** | Construction of SHA256(secret + body) is vulnerable to length extension. Recommended: Use **HMAC-SHA256**. |
| **146** | **Security** | `==` comparison is vulnerable to **Timing Attacks**. Use `hmac.compare_digest` for constant-time comparison. |
| **156** | **Reliability** | Lack of `try...except` for `json.loads`. Malformed JSON will cause a 500 error instead of a graceful 400. |
| **167** | **Critical** | **SQL Injection**. Direct string interpolation of `email` and `raw_json` into the query. An attacker can execute arbitrary SQL. |
| **172** | **Critical** | **SQL Injection**. Direct string interpolation of `email` and `role`. |
| **172** | **Logic** | The task requested an **upsert**, but the code uses a raw `INSERT`. Use `ON CONFLICT` logic for true upserts. |

---

### Follow-up Questions (Part A)

1.  **Share your prompts and the AI outputs.**
    *   **Prompt**: "Review this Python Flask webhook code for security and logic flaws. Focus on SQL injection, timing attacks, and payload validation."
    *   **Output**: The AI correctly identified the lack of parameterized queries (SQLi), string comparison for signatures (Timing Attack), and the missing upsert logic in the SQL statements.

2.  **Prompt Analysis:**
    *   **Goal**: I aimed for a comprehensive security audit targeting OWASP Top 10 vulnerabilities.
    *   **Result**: It identified all critical flaws, specifically the SQL injection and cryptographic weaknesses.
    *   **Adjustments**: No re-prompting was necessary as the initial audit was technically sound.

---

## Part 2: Coding Challenge (Calculator Web App)

### Technical Implementation
I built a full-stack calculator application with a modern, futuristic aesthetic.

*   **Frontend**: React (Vite) + Framer Motion for animations.
*   **Backend**: Node.js/Express.js handles calculation logic via REST API.
*   **Design**: Glassmorphism UI with "Quantum.Calc" theme.

### Follow-up Questions (Part B)

1.  **How far were you able to get?**
    *   Implemented the full feature set: addition, subtraction, multiplication, division, powers, and square roots. The app is fully responsive and integrated with the backend.

2.  **Challenges Encountered?**
    *   An initial typo in the `lucide-react` library icon names required a quick fix to restore UI rendering.

3.  **Future Enhancements?**
    *   Add calculation history with cloud sync.
    *   Scientific mode with trigonometry and logarithmic functions.
    *   Keyboard shortcut support for power users.

4.  **AI Prompts & Performance:**
    *   **Prompts**: "Build a premium glassmorphism calculator UI in React" and "Create an Express backend for math operations."
    *   **Good**: CSS styling and backend calculation logic were excellent.
    *   **Poor**: Hallucinated an icon name (`Equals` instead of `Equal`).
    *   **Fix**: Corrected the import manually after identifying the syntax error.
